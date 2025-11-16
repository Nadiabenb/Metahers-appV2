import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set");
  console.error("Please ensure DATABASE_URL is configured in your deployment secrets");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("✓ DATABASE_URL is configured");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add connection timeout and retry settings for production
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

// Test database connection on startup
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle({ client: pool, schema });