import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isVercel = Boolean(process.env.VERCEL);
const connectionString = process.env.DATABASE_URL;

const hasRemoteDb = Boolean(
  connectionString &&
  !connectionString.includes('127.0.0.1') &&
  !connectionString.includes('localhost')
);

export const pool = new Pool(
  hasRemoteDb
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
    : {
        connectionString: connectionString || undefined,
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_DATABASE || 'phatphap',
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
);

// Prevent uncaught exceptions on idle client errors
pool.on('error', (err) => {
  console.warn('[PostgreSQL Pool Warning] Connection or idle client error:', err.message);
});

/**
 * Execute a parameterized SQL query safely against PostgreSQL pool
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  // If running on Vercel without a remote cloud database configured, do not attempt local connection
  if (isVercel && !hasRemoteDb) {
    return {
      rows: [] as T[],
      rowCount: 0,
      command: '',
      oid: 0,
      fields: [],
    } as QueryResult<T>;
  }

  try {
    return await pool.query<T>(text, params);
  } catch (error: any) {
    console.warn(`[Database Warning] Query failed or connection unreachable: ${error.message}`);
    return {
      rows: [] as T[],
      rowCount: 0,
      command: '',
      oid: 0,
      fields: [],
    } as QueryResult<T>;
  }
}
