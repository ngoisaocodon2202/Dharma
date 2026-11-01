import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let poolInstance: Pool | null = null;

export function getPool(): Pool | null {
  if (poolInstance) return poolInstance;

  const connectionString = process.env.DATABASE_URL;

  // On Vercel, if DATABASE_URL is not set or points to localhost/127.0.0.1, do not connect
  const isVercel = Boolean(process.env.VERCEL);
  const isLocalhost = Boolean(
    !connectionString ||
    connectionString.includes('127.0.0.1') ||
    connectionString.includes('localhost')
  );

  if (isVercel && isLocalhost) {
    return null;
  }

  const isRemote = Boolean(
    connectionString &&
    !connectionString.includes('127.0.0.1') &&
    !connectionString.includes('localhost')
  );

  try {
    poolInstance = new Pool(
      isRemote
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

    poolInstance.on('error', (err) => {
      console.warn('[PostgreSQL Pool Warning]:', err.message);
    });

    return poolInstance;
  } catch (err: any) {
    console.warn('[PostgreSQL Init Warning]:', err.message);
    return null;
  }
}

// Backwards compatibility export
export const pool = {
  query: (text: string, params?: any[]) => query(text, params),
};

/**
 * Execute a parameterized SQL query safely against PostgreSQL pool
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const p = getPool();
  if (!p) {
    return {
      rows: [] as T[],
      rowCount: 0,
      command: '',
      oid: 0,
      fields: [],
    } as QueryResult<T>;
  }

  try {
    return await p.query<T>(text, params);
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
