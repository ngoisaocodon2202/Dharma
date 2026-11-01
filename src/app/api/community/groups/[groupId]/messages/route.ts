import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

// GET /api/community/groups/[groupId]/messages — get chat messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  const { groupId } = await params;

  // Auto-enroll user if not yet a member
  const member = await query(
    'SELECT id FROM group_memberships WHERE group_id = $1 AND user_id = $2',
    [groupId, user.id]
  );
  if (!member.rows[0]) {
    await query(
      'INSERT INTO group_memberships (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [groupId, user.id]
    );
  }

  const res = await query(
    `SELECT gm.id, gm.content, gm.created_at,
            p.full_name, p.dharma_name, p.avatar_url, u.id AS user_id
     FROM group_messages gm
     JOIN users u ON u.id = gm.user_id
     JOIN profiles p ON p.user_id = u.id
     WHERE gm.group_id = $1
     ORDER BY gm.created_at ASC
     LIMIT 150`,
    [groupId]
  );

  return NextResponse.json({ messages: res.rows });
}

// POST /api/community/groups/[groupId]/messages — send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  const { groupId } = await params;

  // Auto-enroll user if not yet a member
  const member = await query(
    'SELECT id FROM group_memberships WHERE group_id = $1 AND user_id = $2',
    [groupId, user.id]
  );
  if (!member.rows[0]) {
    await query(
      'INSERT INTO group_memberships (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [groupId, user.id]
    );
  }

  const body = await request.json();
  const content = body.content?.trim();
  if (!content || content.length === 0) return NextResponse.json({ error: 'Tin nhắn trống' }, { status: 400 });
  if (content.length > 1000) return NextResponse.json({ error: 'Tin nhắn quá dài (tối đa 1000 ký tự)' }, { status: 400 });

  const res = await query(
    `INSERT INTO group_messages (group_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, content, created_at`,
    [groupId, user.id, content]
  );

  return NextResponse.json({
    message: {
      ...res.rows[0],
      user_id: user.id,
      full_name: user.full_name,
      dharma_name: user.dharma_name,
      avatar_url: user.avatar_url,
    }
  });
}
