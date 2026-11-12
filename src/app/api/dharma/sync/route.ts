import { NextRequest, NextResponse } from 'next/server';
import { dharmaPgQuery, broadcastDharmaRealtimeEvent } from '@/lib/db/dharmaPostgresEngine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resource = searchParams.get('resource') || 'all';
    const featureSlug = searchParams.get('feature') || '';
    const storeKey = searchParams.get('key') || '';

    if (resource === 'memorials') {
      const { rows } = await dharmaPgQuery(
        `SELECT * FROM dharma_ancestral_memorials ORDER BY lunar_death_month ASC, lunar_death_day ASC`
      );
      return NextResponse.json({ ok: true, memorials: rows });
    }

    if (resource === 'merits') {
      const { rows } = await dharmaPgQuery(
        `SELECT * FROM dharma_merit_logs ORDER BY created_at DESC LIMIT 200`
      );
      return NextResponse.json({ ok: true, merits: rows });
    }

    if (resource === 'features') {
      const { rows } = featureSlug
        ? await dharmaPgQuery(
            `SELECT * FROM dharma_new_features_records WHERE feature_slug = $1 ORDER BY created_at DESC LIMIT 100`,
            [featureSlug]
          )
        : await dharmaPgQuery(
            `SELECT * FROM dharma_new_features_records ORDER BY created_at DESC LIMIT 200`
          );
      return NextResponse.json({ ok: true, records: rows });
    }

    if (resource === 'kv' && storeKey) {
      const { rows } = await dharmaPgQuery<{ store_key: string; payload: unknown }>(
        `SELECT store_key, payload FROM dharma_user_kv_store WHERE store_key = $1`,
        [storeKey]
      );
      return NextResponse.json({ ok: true, payload: rows[0]?.payload || null });
    }

    // Default 'all' snapshot from PostgreSQL
    const [memorialsRes, meritsRes, featuresRes, kvRes] = await Promise.all([
      dharmaPgQuery(`SELECT * FROM dharma_ancestral_memorials ORDER BY lunar_death_month ASC, lunar_death_day ASC`),
      dharmaPgQuery(`SELECT * FROM dharma_merit_logs ORDER BY created_at DESC LIMIT 150`),
      dharmaPgQuery(`SELECT * FROM dharma_new_features_records ORDER BY created_at DESC LIMIT 150`),
      dharmaPgQuery(`SELECT store_key, payload FROM dharma_user_kv_store`),
    ]);

    return NextResponse.json({
      ok: true,
      engine: 'PostgreSQL 18 (127.0.0.1:5432/phatphap)',
      memorials: memorialsRes.rows,
      merits: meritsRes.rows,
      features: featuresRes.rows,
      kv: kvRes.rows,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Sync read error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resource = body.resource || 'features';

    if (resource === 'memorials') {
      const m = body.memorial || body;
      const id = String(m.id || `mem-${Date.now()}`);
      const fullName = String(m.full_name || m.fullName || '').trim();
      const dharmaName = String(m.dharma_name || m.dharmaName || '').trim();
      const relationship = String(m.relationship || 'Gia tiên').trim();
      const lunarDay = Math.min(30, Math.max(1, Number(m.lunar_death_day || m.lunarDeathDay || 15)));
      const lunarMonth = Math.min(12, Math.max(1, Number(m.lunar_death_month || m.lunarDeathMonth || 7)));
      const deathSolarYear = m.death_solar_year || m.deathSolarYear ? Number(m.death_solar_year || m.deathSolarYear) : null;
      const burialPlace = String(m.burial_place || m.burialPlace || '').trim();
      const notes = String(m.notes || '').trim();
      const incenseCount = Number(m.incense_offered_count || m.incenseOfferedCount || 0);
      const bowsCount = Number(m.bows_offered_count || m.bowsOfferedCount || 0);

      const { rows } = await dharmaPgQuery(
        `INSERT INTO dharma_ancestral_memorials
          (id, full_name, dharma_name, relationship, lunar_death_day, lunar_death_month, death_solar_year, burial_place, notes, incense_offered_count, bows_offered_count, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         ON CONFLICT (id) DO UPDATE SET
           full_name = EXCLUDED.full_name,
           dharma_name = EXCLUDED.dharma_name,
           relationship = EXCLUDED.relationship,
           lunar_death_day = EXCLUDED.lunar_death_day,
           lunar_death_month = EXCLUDED.lunar_death_month,
           death_solar_year = EXCLUDED.death_solar_year,
           burial_place = EXCLUDED.burial_place,
           notes = EXCLUDED.notes,
           incense_offered_count = EXCLUDED.incense_offered_count,
           bows_offered_count = EXCLUDED.bows_offered_count,
           updated_at = NOW()
         RETURNING *`,
        [id, fullName, dharmaName, relationship, lunarDay, lunarMonth, deathSolarYear, burialPlace, notes, incenseCount, bowsCount]
      );

      broadcastDharmaRealtimeEvent({ type: 'sync_updated', payload: { resource: 'memorials' } });
      return NextResponse.json({ ok: true, memorial: rows[0] });
    }

    if (resource === 'merits') {
      const entry = body.merit || body;
      const id = String(entry.id || `merit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
      const dateKey = String(entry.date_key || entry.dateKey || new Date().toISOString().slice(0, 10));
      const toolSlug = String(entry.tool_slug || entry.toolSlug || 'tu-tap');
      const title = String(entry.title || 'Công đức tu tập');
      const detail = String(entry.detail || '');
      const dedicationTarget = String(entry.dedication_target || entry.dedicationTarget || 'Khắp pháp giới chúng sinh');
      const durationMinutes = Number(entry.duration_minutes || entry.durationMinutes || 5);
      const countValue = Number(entry.count_value || entry.countValue || 1);

      const { rows } = await dharmaPgQuery(
        `INSERT INTO dharma_merit_logs
          (id, date_key, tool_slug, title, detail, dedication_target, duration_minutes, count_value)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING
         RETURNING *`,
        [id, dateKey, toolSlug, title, detail, dedicationTarget, durationMinutes, countValue]
      );

      broadcastDharmaRealtimeEvent({ type: 'sync_updated', payload: { resource: 'merits' } });
      return NextResponse.json({ ok: true, merit: rows[0] });
    }

    if (resource === 'kv') {
      const storeKey = String(body.key || 'dharma_practice_state');
      const payload = body.payload || {};
      await dharmaPgQuery(
        `INSERT INTO dharma_user_kv_store (store_key, payload, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (store_key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
        [storeKey, JSON.stringify(payload)]
      );
      return NextResponse.json({ ok: true, key: storeKey });
    }

    if (resource === 'feature_like') {
      const id = String(body.id || '');
      const { rows } = await dharmaPgQuery(
        `UPDATE dharma_new_features_records
         SET likes_count = likes_count + 1, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      broadcastDharmaRealtimeEvent({ type: 'sync_updated', payload: { resource: 'features', record: rows[0] } });
      return NextResponse.json({ ok: true, record: rows[0] });
    }

    // Default: Create or update a record in dharma_new_features_records (for the 8 new features)
    const id = String(body.id || `feat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
    const featureSlug = String(body.feature_slug || body.featureSlug || 'gieo-que-quan-am');
    const authorName = String(body.author_name || body.authorName || 'Phật tử Thiện Tâm');
    const title = String(body.title || '');
    const subtitle = String(body.subtitle || '');
    const content = String(body.content || '');
    const metadata = JSON.stringify(body.metadata || {});
    const likesCount = Number(body.likes_count || 1);

    const { rows } = await dharmaPgQuery(
      `INSERT INTO dharma_new_features_records
        (id, feature_slug, author_name, title, subtitle, content, metadata, likes_count, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, NOW())
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         subtitle = EXCLUDED.subtitle,
         content = EXCLUDED.content,
         metadata = EXCLUDED.metadata,
         updated_at = NOW()
       RETURNING *`,
      [id, featureSlug, authorName, title, subtitle, content, metadata, likesCount]
    );

    broadcastDharmaRealtimeEvent({ type: 'sync_updated', payload: { resource: 'features', record: rows[0] } });
    return NextResponse.json({ ok: true, record: rows[0] });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Sync write error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resource = searchParams.get('resource') || 'features';
    const id = String(searchParams.get('id') || '').trim();
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
    }

    if (resource === 'memorials') {
      await dharmaPgQuery(`DELETE FROM dharma_ancestral_memorials WHERE id = $1`, [id]);
    } else if (resource === 'merits') {
      await dharmaPgQuery(`DELETE FROM dharma_merit_logs WHERE id = $1`, [id]);
    } else {
      await dharmaPgQuery(`DELETE FROM dharma_new_features_records WHERE id = $1`, [id]);
    }

    broadcastDharmaRealtimeEvent({ type: 'sync_updated', payload: { resource, deletedId: id } });
    return NextResponse.json({ ok: true, deletedId: id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Delete error' },
      { status: 500 }
    );
  }
}

