import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
import {
  FALLBACK_CATEGORIES,
  getDynamicDailyArticles,
  FALLBACK_TEMPLES,
  FALLBACK_VIDEOS,
  FALLBACK_BOOKS,
  FALLBACK_AUDIO,
  FALLBACK_LEARNING_PATHS,
  FALLBACK_DAILY_PRACTICE,
  FALLBACK_EVENTS,
  FALLBACK_ORGANIZATIONS,
  FALLBACK_MEDITATION_PRESETS,
} from './fallbackData';

dotenv.config();

let poolInstance: Pool | null = null;

/**
 * Validate PostgreSQL connection string safely
 */
function isValidPostgresUrl(urlStr?: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  if (urlStr.includes('[') || urlStr.includes(']')) return false;

  try {
    const parsed = new URL(urlStr);
    const isValidProto = parsed.protocol === 'postgres:' || parsed.protocol === 'postgresql:';
    if (!isValidProto) return false;

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

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

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

export const pool = {
  query: (text: string, params?: any[]) => query(text, params),
};

function makeResult<T extends QueryResultRow = any>(rows: any[]): QueryResult<T> {
  return {
    rows: rows as T[],
    rowCount: rows.length,
    command: 'SELECT',
    oid: 0,
    fields: [],
  };
}

/**
 * Resolve queries against in-memory Fallback Data when DB is offline or empty on Vercel
 */
function resolveFallbackQuery<T extends QueryResultRow = any>(
  text: string,
  params: any[] = []
): QueryResult<T> {
  const sql = text.replace(/\s+/g, ' ').trim().toLowerCase();

  // 1. Article Categories
  if (sql.includes('from article_categories')) {
    return makeResult<T>(FALLBACK_CATEGORIES);
  }

  // 2. Articles (Daily auto-updated from Monks & Temples)
  if (sql.includes('from articles')) {
    let articles = getDynamicDailyArticles();

    // Single article by slug
    if (sql.includes('a.slug = $1') && params[0]) {
      const found = articles.filter((a) => a.slug === params[0]);
      return makeResult<T>(found);
    }

    // Related articles by category_id and id != $2
    if (sql.includes('a.category_id = $1') && params[0]) {
      const filtered = articles
        .filter((a) => a.category_id === params[0] && a.id !== params[1])
        .slice(0, 3);
      return makeResult<T>(filtered);
    }

    // Filter by category slug or search query
    if (sql.includes('c.slug =')) {
      const catSlug = params[0];
      articles = articles.filter((a) => a.category_slug === catSlug);
      if (params[1]) {
        const q = String(params[1]).replace(/%/g, '').toLowerCase();
        articles = articles.filter(
          (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
        );
      }
    } else if (sql.includes('ilike') && params[0]) {
      const q = String(params[0]).replace(/%/g, '').toLowerCase();
      articles = articles.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }

    const limitMatch = sql.match(/limit\s+(\d+)/);
    if (limitMatch) {
      articles = articles.slice(0, parseInt(limitMatch[1], 10));
    }

    return makeResult<T>(articles);
  }

  // 3. Daily Practice
  if (sql.includes('from daily_practices')) {
    return makeResult<T>([FALLBACK_DAILY_PRACTICE]);
  }

  // 4. Learning Paths & Modules
  if (sql.includes('from learning_paths')) {
    if (sql.includes('slug = $1') && params[0]) {
      return makeResult<T>(FALLBACK_LEARNING_PATHS.filter((p) => p.slug === params[0]));
    }
    return makeResult<T>(FALLBACK_LEARNING_PATHS);
  }

  if (sql.includes('from learning_modules')) {
    const articles = getDynamicDailyArticles();
    const modules = articles.slice(0, 5).map((art, i) => ({
      id: `mod-${i + 1}`,
      title: `Bài ${i + 1}: ${art.title}`,
      description: art.excerpt,
      module_order: i + 1,
      estimated_minutes: (art.reading_time_minutes || 7) * 2,
      article_slug: art.slug,
      article_title: art.title,
    }));
    return makeResult<T>(modules);
  }

  // 5. Audio
  if (sql.includes('from audio')) {
    if (sql.includes('select count(*)')) {
      return makeResult<T>([{ count: FALLBACK_AUDIO.length }]);
    }
    if (sql.includes('select distinct speaker')) {
      const speakers = Array.from(new Set(FALLBACK_AUDIO.map((a) => a.speaker))).map((s) => ({
        speaker: s,
      }));
      return makeResult<T>(speakers);
    }
    let list = [...FALLBACK_AUDIO];
    if (params.length > 0) {
      for (const p of params) {
        const val = String(p).replace(/%/g, '');
        if (['PHAP_THOAI', 'KINH_TUNG', 'THIEN', 'PODCAST'].includes(val)) {
          list = list.filter((a) => a.category === val);
        } else {
          const q = val.toLowerCase();
          list = list.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.speaker.toLowerCase().includes(q) ||
              a.description.toLowerCase().includes(q)
          );
        }
      }
    }
    return makeResult<T>(list);
  }

  // 6. Videos
  if (sql.includes('from videos')) {
    if (sql.includes('select count(*)')) {
      return makeResult<T>([{ count: FALLBACK_VIDEOS.length }]);
    }
    if (sql.includes('select distinct speaker')) {
      const speakers = Array.from(new Set(FALLBACK_VIDEOS.map((v) => v.speaker))).map((s) => ({
        speaker: s,
      }));
      return makeResult<T>(speakers);
    }
    let list = [...FALLBACK_VIDEOS];
    if (params.length > 0) {
      for (const p of params) {
        const val = String(p).replace(/%/g, '');
        if (['PHAP_THOAI', 'THIEN_QUAN', 'KINH_TUNG', 'VAN_HOA'].includes(val)) {
          list = list.filter((v) => v.category === val);
        } else {
          const q = val.toLowerCase();
          list = list.filter(
            (v) =>
              v.title.toLowerCase().includes(q) ||
              v.speaker.toLowerCase().includes(q) ||
              v.description.toLowerCase().includes(q)
          );
        }
      }
    }
    return makeResult<T>(list);
  }

  // 7. Temples
  if (sql.includes('from temples')) {
    if (sql.includes('select distinct province')) {
      const provinces = Array.from(new Set(FALLBACK_TEMPLES.map((t) => t.province)))
        .sort()
        .map((p) => ({ province: p }));
      return makeResult<T>(provinces);
    }
    if (sql.includes('slug = $1') && params[0]) {
      return makeResult<T>(FALLBACK_TEMPLES.filter((t) => t.slug === params[0]));
    }
    let list = [...FALLBACK_TEMPLES];
    if (params.length > 0) {
      for (const p of params) {
        const val = String(p).replace(/%/g, '');
        if (['CHUA', 'THIEN_VIEN', 'TU_VIEN', 'DI_TICH'].includes(val)) {
          list = list.filter((t) => t.category === val);
        } else if (FALLBACK_TEMPLES.some((t) => t.province === val)) {
          list = list.filter((t) => t.province === val);
        } else {
          const q = val.toLowerCase();
          list = list.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.address.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q)
          );
        }
      }
    }
    const limitMatch = sql.match(/limit\s+(\d+)/);
    if (limitMatch) {
      list = list.slice(0, parseInt(limitMatch[1], 10));
    }
    return makeResult<T>(list);
  }

  // 8. Books
  if (sql.includes('from books')) {
    if (sql.includes('slug = $1') && params[0]) {
      return makeResult<T>(FALLBACK_BOOKS.filter((b) => b.slug === params[0]));
    }
    const limitMatch = sql.match(/limit\s+(\d+)/);
    const list = limitMatch
      ? FALLBACK_BOOKS.slice(0, parseInt(limitMatch[1], 10))
      : FALLBACK_BOOKS;
    return makeResult<T>(list);
  }

  // 9. Events
  if (sql.includes('from events')) {
    if (sql.includes('slug = $1') && params[0]) {
      return makeResult<T>(FALLBACK_EVENTS.filter((e) => e.slug === params[0]));
    }
    return makeResult<T>(FALLBACK_EVENTS);
  }

  // 10. Organizations
  if (sql.includes('from organizations')) {
    return makeResult<T>(FALLBACK_ORGANIZATIONS);
  }

  // 11. Meditation Presets
  if (sql.includes('from meditation_presets')) {
    return makeResult<T>(FALLBACK_MEDITATION_PRESETS);
  }

  return makeResult<T>([]);
}

/**
 * Execute a parameterized SQL query safely against PostgreSQL pool with automatic Fallback Data
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const sqlLower = text.toLowerCase();

  // For articles, always prefer dynamic daily rotation so new articles from Monks & Temples appear fresh every day
  if (sqlLower.includes('from articles')) {
    return resolveFallbackQuery<T>(text, params);
  }

  const p = getPool();
  if (!p) {
    return resolveFallbackQuery<T>(text, params);
  }

  try {
    const res = await p.query<T>(text, params);
    if (res.rows.length === 0 && sqlLower.startsWith('select')) {
      const fallback = resolveFallbackQuery<T>(text, params);
      if (fallback.rows.length > 0) return fallback;
    }
    return res;
  } catch (error: any) {
    console.warn(`[Database Warning] Using fallback data: ${error.message}`);
    return resolveFallbackQuery<T>(text, params);
  }
}
