import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityHeaders, corsConfig } from "./middleware/security";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { logger } from "./utils/logger";
import { checkDatabaseHealth, closeDatabaseConnection } from "./db";

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(corsConfig);

// Body parsing with limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Enhanced rate limiting with Redis-like memory store
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number; blocked: boolean }> = new Map();
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests = process.env.NODE_ENV === 'production' ? 100 : 1000;
  private readonly blockDuration = 60 * 1000; // 1 minute block

  middleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    let record = this.requests.get(ip);
    
    if (!record) {
      record = { count: 1, resetTime: now + this.windowMs, blocked: false };
      this.requests.set(ip, record);
    } else if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.windowMs;
      record.blocked = false;
    } else {
      record.count++;
      
      if (record.count > this.maxRequests && !record.blocked) {
        record.blocked = true;
        record.resetTime = now + this.blockDuration;
        logger.warn('Rate limit exceeded', { ip, count: record.count });
      }
    }
    
    if (record.blocked && now < record.resetTime) {
      return res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      for (const [key, value] of this.requests.entries()) {
        if (now > value.resetTime + this.windowMs) {
          this.requests.delete(key);
        }
      }
    }
    
    next();
  };
}

const rateLimiter = new RateLimiter();
app.use(rateLimiter.middleware);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Health check endpoint
  app.get('/health', async (req, res) => {
    const dbHealthy = await checkDatabaseHealth();
    const status = dbHealthy ? 200 : 503;
    
    res.status(status).json({
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealthy ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV
    });
  });

  const server = await registerRoutes(app);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Import configuration
  const { config, isDevelopment } = await import("./config");
  const port = config.port;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Stop accepting new connections
    server.close(async () => {
      logger.info('HTTP server closed.');
      
      // Close database connections
      await closeDatabaseConnection();
      
      logger.info('Graceful shutdown completed');
      process.exit(0);
    });
    
    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 30000);
  };

  // Handle different shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

  // Handle uncaught exceptions and rejections
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
    gracefulShutdown('unhandledRejection');
  });
})();
