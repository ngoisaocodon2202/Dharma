import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let poolInstance: Pool | null = null;

/**
 * Validate PostgreSQL connection string safely
 */
function isValidPostgresUrl(urlStr?: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  // Ignore placeholder values like [PASSWORD] or [HOST]
  if (urlStr.includes('[') || urlStr.includes(']')) return false;

  try {
    const parsed = new URL(urlStr);
    const isValidProto = parsed.protocol === 'postgres:' || parsed.protocol === 'postgresql:';
    if (!isValidProto) return false;

    // Localhost or 127.0.0.1 is never reachable inside Vercel cloud environment
    if (process.env.VERCEL) {
      if (
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname === 'localhost' ||
        parsed.hostname === '0.0.0.0'
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

export function getPool(): Pool | null {
  if (poolInstance) return poolInstance;

  const connectionString = process.env.DATABASE_URL;

  // If no valid URL provided, skip connection
  if (!isValidPostgresUrl(connectionString)) {
    return null;
  }

  const isRemote = Boolean(
    connectionString &&
    !connectionString.includes('127.0.0.1') &&
    !connectionString.includes('localhost')
  );

  try {
    poolInstance = new Pool({
      connectionString,
      ssl: isRemote ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

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
