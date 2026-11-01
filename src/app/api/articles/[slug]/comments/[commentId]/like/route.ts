import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST /api/articles/[slug]/comments/[commentId]/like — toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
  }

  const { commentId } = await params;

  const commentRes = await query(
    'SELECT id, likes_count FROM comments WHERE id = $1 AND deleted_at IS NULL',
    [commentId]
  );
  const comment = commentRes.rows[0];
  if (!comment) {
    return NextResponse.json({ error: 'Bình luận không tồn tại' }, { status: 404 });
  }

  // Simple increment (no per-user like tracking for now — Phase 5 adds that)
  await query(
    'UPDATE comments SET likes_count = likes_count + 1 WHERE id = $1',
    [commentId]
  );

  return NextResponse.json({ likes_count: comment.likes_count + 1 });
}
