import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neon } from "@neondatabase/serverless";
import { logger } from "./utils/logger";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Configure WebSocket for Neon serverless in Node.js environment
if (typeof global !== 'undefined') {
  global.WebSocket = ws;
}

// Create connection pool for drizzle operations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create neon client for health checks
const sql = neon(process.env.DATABASE_URL);

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 as health`;
    return result.length > 0;
  } catch (error) {
    logger.error('Database health check failed', { error: error instanceof Error ? error.message : error });
    return false;
  }
}

// Graceful database shutdown
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await pool.end();
    logger.info('Database connection pool closed');
  } catch (error) {
    logger.error('Error closing database connection', { error: error instanceof Error ? error.message : error });
  }
}

// Create drizzle instance with the pool
export const db = drizzle(pool);