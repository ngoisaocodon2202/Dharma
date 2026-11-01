import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

// POST /api/community/groups/[groupId]/join — join or leave group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  const { groupId } = await params;

  // Check group exists
  const groupRes = await query('SELECT id FROM community_groups WHERE id = $1', [groupId]);
  if (!groupRes.rows[0]) return NextResponse.json({ error: 'Nhóm không tồn tại' }, { status: 404 });

  // Toggle membership
  const existing = await query(
    'SELECT id FROM group_memberships WHERE group_id = $1 AND user_id = $2',
    [groupId, user.id]
  );

  if (existing.rows[0]) {
    // Leave
    await query('DELETE FROM group_memberships WHERE group_id = $1 AND user_id = $2', [groupId, user.id]);
    return NextResponse.json({ joined: false });
  } else {
    // Join
    await query(
      'INSERT INTO group_memberships (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [groupId, user.id]
    );
    return NextResponse.json({ joined: true });
  }
}
