import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

// GET /api/community/groups — list groups with membership status
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);

  const res = await query(
    `SELECT g.id, g.name, g.description, g.privacy,
            COUNT(DISTINCT m.user_id)::int AS member_count,
            ${user ? 'MAX(CASE WHEN m2.user_id = $1 THEN 1 ELSE 0 END)::int AS is_member' : '0 AS is_member'}
     FROM community_groups g
     LEFT JOIN group_memberships m ON m.group_id = g.id
     ${user ? 'LEFT JOIN group_memberships m2 ON m2.group_id = g.id AND m2.user_id = $1' : ''}
     GROUP BY g.id
     ORDER BY g.id`,
    user ? [user.id] : []
  );

  return NextResponse.json({ groups: res.rows });
}
