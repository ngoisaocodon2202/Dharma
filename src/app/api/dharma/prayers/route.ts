import { NextRequest, NextResponse } from 'next/server';
import { dharmaPgQuery, broadcastDharmaRealtimeEvent } from '@/lib/db/dharmaPostgresEngine';

export const dynamic = 'force-dynamic';

export interface DharmaPrayerRow {
  id: string;
  room_type: 'cau_an' | 'cau_sieu';
  user_id: string;
  dharma_name: string;
  sender_name: string;
  target_name: string;
  target_info: string;
  category: string;
  content: string;
  co_pray_count: number;
  is_reported: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomType = (searchParams.get('room') === 'cau_an' ? 'cau_an' : 'cau_sieu') as
      | 'cau_an'
      | 'cau_sieu';

    const { rows } = await dharmaPgQuery<DharmaPrayerRow>(
      `SELECT id, room_type, user_id, dharma_name, sender_name, target_name, target_info,
              category, content, co_pray_count, is_reported, status, created_at, updated_at
       FROM dharma_prayers_realtime
       WHERE room_type = $1 AND status = 'active' AND is_reported = FALSE
       ORDER BY created_at DESC
       LIMIT 150`,
      [roomType]
    );

    const totalCoPray = rows.reduce((acc, r) => acc + Number(r.co_pray_count || 0), 0);

    return NextResponse.json({
      ok: true,
      room: roomType,
      engine: 'PostgreSQL 18 (127.0.0.1:5432/phatphap)',
      totalCount: rows.length,
      totalCoPray,
      prayers: rows,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'create';

    if (action === 'copray') {
      const prayerId = String(body.prayerId || '').trim();
      const actorId = String(body.actorId || 'phat-tu-local').trim();
      if (!prayerId) {
        return NextResponse.json({ ok: false, error: 'Missing prayerId' }, { status: 400 });
      }

      const { rows } = await dharmaPgQuery<DharmaPrayerRow>(
        `UPDATE dharma_prayers_realtime
         SET co_pray_count = co_pray_count + 1, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [prayerId]
      );

      const reactionId = `rx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await dharmaPgQuery(
        `INSERT INTO dharma_prayer_reactions (id, prayer_id, actor_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [reactionId, prayerId, actorId]
      );

      const updated = rows[0];
      if (updated) {
        broadcastDharmaRealtimeEvent({
          type: 'prayer_coprayed',
          roomType: updated.room_type,
          payload: updated,
        });
      }

      return NextResponse.json({ ok: true, prayer: updated });
    }

    if (action === 'report') {
      const prayerId = String(body.prayerId || '').trim();
      if (!prayerId) {
        return NextResponse.json({ ok: false, error: 'Missing prayerId' }, { status: 400 });
      }
      await dharmaPgQuery(
        `UPDATE dharma_prayers_realtime
         SET is_reported = TRUE, updated_at = NOW()
         WHERE id = $1`,
        [prayerId]
      );
      broadcastDharmaRealtimeEvent({
        type: 'prayer_deleted',
        payload: { id: prayerId },
      });
      return NextResponse.json({ ok: true });
    }

    // Default: Create a new real-time prayer
    const roomType: 'cau_an' | 'cau_sieu' = body.room_type === 'cau_an' ? 'cau_an' : 'cau_sieu';
    const content = String(body.content || '').trim();
    if (!content) {
      return NextResponse.json({ ok: false, error: 'Nội dung lời nguyện không được để trống' }, { status: 400 });
    }

    const id = String(body.id || `${roomType === 'cau_an' ? 'ca' : 'cs'}-${Date.now()}`);
    const userId = String(body.user_id || 'phat-tu-local').trim();
    const dharmaName = String(body.dharma_name || 'Phật tử Thiện Tâm').trim();
    const senderName = String(body.sender_name || dharmaName).trim();
    const targetName = String(body.target_name || (roomType === 'cau_an' ? 'Gia đạo bình an' : 'Cửu Huyền Thất Tổ')).trim();
    const targetInfo = String(body.target_info || '').trim();
    const category = String(body.category || (roomType === 'cau_an' ? 'Bình an gia đạo' : 'Siêu độ gia tiên')).trim();

    const { rows } = await dharmaPgQuery<DharmaPrayerRow>(
      `INSERT INTO dharma_prayers_realtime
        (id, room_type, user_id, dharma_name, sender_name, target_name, target_info, category, content, co_pray_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1)
       RETURNING *`,
      [id, roomType, userId, dharmaName, senderName, targetName, targetInfo, category, content]
    );

    const created = rows[0];
    broadcastDharmaRealtimeEvent({
      type: 'prayer_created',
      roomType,
      payload: created,
    });

    return NextResponse.json({ ok: true, prayer: created });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Database insert error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || '').trim();
    const content = String(body.content || '').trim();
    if (!id || !content) {
      return NextResponse.json({ ok: false, error: 'Thiếu ID hoặc nội dung cập nhật' }, { status: 400 });
    }

    const dharmaName = String(body.dharma_name || 'Phật tử Thiện Tâm').trim();
    const senderName = String(body.sender_name || dharmaName).trim();
    const targetName = String(body.target_name || '').trim();
    const targetInfo = String(body.target_info || '').trim();
    const category = String(body.category || 'Tâm nguyện').trim();

    const { rows } = await dharmaPgQuery<DharmaPrayerRow>(
      `UPDATE dharma_prayers_realtime
       SET dharma_name = $2,
           sender_name = $3,
           target_name = $4,
           target_info = $5,
           category = $6,
           content = $7,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, dharmaName, senderName, targetName, targetInfo, category, content]
    );

    const updated = rows[0];
    if (updated) {
      broadcastDharmaRealtimeEvent({
        type: 'prayer_updated',
        roomType: updated.room_type,
        payload: updated,
      });
    }

    return NextResponse.json({ ok: true, prayer: updated });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Database update error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = String(searchParams.get('id') || '').trim();
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
    }

    const { rows } = await dharmaPgQuery<DharmaPrayerRow>(
      `DELETE FROM dharma_prayers_realtime WHERE id = $1 RETURNING *`,
      [id]
    );

    broadcastDharmaRealtimeEvent({
      type: 'prayer_deleted',
      roomType: rows[0]?.room_type,
      payload: { id },
    });

    return NextResponse.json({ ok: true, deletedId: id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Database delete error' },
      { status: 500 }
    );
  }
}

