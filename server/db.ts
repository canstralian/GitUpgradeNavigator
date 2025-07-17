import { drizzle } from "drizzle-orm/neon-serverless";
import { neon, Pool } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import { logger } from "./utils/logger";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Connection pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

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

export const db = drizzle(sql, { schema });