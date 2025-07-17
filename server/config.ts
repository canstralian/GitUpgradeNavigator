
export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
};

// Validate required environment variables
if (!config.databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is required');
  process.exit(1);
}

if (config.port < 1000 || config.port > 65535) {
  console.error('ERROR: PORT must be between 1000 and 65535');
  process.exit(1);
}

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
