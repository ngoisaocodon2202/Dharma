import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/bookmarks?type=ARTICLE — list user's bookmarks
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get('type') || 'ARTICLE';

  const res = await query(
    `SELECT b.id, b.entity_type, b.entity_id, b.created_at
     FROM bookmarks b
     WHERE b.user_id = $1 AND b.entity_type = $2
     ORDER BY b.created_at DESC`,
    [user.id, entityType]
  );

  return NextResponse.json({ bookmarks: res.rows });
}

// POST /api/bookmarks — toggle bookmark
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập để lưu bài' }, { status: 401 });
  }

  const body = await req.json();
  const entityType: string = body.entity_type;
  const entityId: string = body.entity_id;

  const validTypes = ['ARTICLE', 'VIDEO', 'AUDIO', 'TEMPLE', 'BOOK'];
  if (!validTypes.includes(entityType) || !entityId) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  // Check existing bookmark
  const existing = await query(
    'SELECT id FROM bookmarks WHERE user_id = $1 AND entity_type = $2 AND entity_id = $3',
    [user.id, entityType, entityId]
  );

  if (existing.rows[0]) {
    // Remove bookmark
    await query('DELETE FROM bookmarks WHERE id = $1', [existing.rows[0].id]);
    return NextResponse.json({ bookmarked: false });
  } else {
    // Add bookmark
    await query(
      'INSERT INTO bookmarks (user_id, entity_type, entity_id) VALUES ($1, $2, $3)',
      [user.id, entityType, entityId]
    );
    return NextResponse.json({ bookmarked: true }, { status: 201 });
  }
}
