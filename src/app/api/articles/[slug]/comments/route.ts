import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/articles/[slug]/comments — fetch comments + replies
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;

  const articleRes = await query(
    'SELECT id FROM articles WHERE slug = $1 AND status = $2 AND deleted_at IS NULL',
    [slug, 'PUBLISHED']
  );
  const article = articleRes.rows[0];
  if (!article) {
    return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 });
  }

  const res = await query(
    `SELECT c.id, c.content, c.parent_id, c.likes_count, c.created_at,
            p.full_name, p.dharma_name, p.avatar_url
     FROM comments c
     JOIN profiles p ON c.user_id = p.user_id
     WHERE c.article_id = $1 AND c.status = 'APPROVED' AND c.deleted_at IS NULL
     ORDER BY c.created_at ASC`,
    [article.id]
  );

  // Nest replies under parent comments
  const all = res.rows;
  const roots: any[] = [];
  const map: Record<string, any> = {};

  for (const c of all) {
    map[c.id] = { ...c, replies: [] };
  }
  for (const c of all) {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id]);
    } else if (!c.parent_id) {
      roots.push(map[c.id]);
    }
  }

  return NextResponse.json({ comments: roots });
}

// POST /api/articles/[slug]/comments — create comment or reply
export async function POST(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập để bình luận' }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();
  const content: string = (body.content || '').trim();
  const parentId: string | null = body.parent_id || null;

  if (!content || content.length < 2) {
    return NextResponse.json({ error: 'Nội dung bình luận quá ngắn' }, { status: 400 });
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: 'Bình luận không được vượt quá 2000 ký tự' }, { status: 400 });
  }

  const articleRes = await query(
    'SELECT id FROM articles WHERE slug = $1 AND status = $2 AND deleted_at IS NULL',
    [slug, 'PUBLISHED']
  );
  const article = articleRes.rows[0];
  if (!article) {
    return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 });
  }

  // Validate parent_id belongs to same article
  if (parentId) {
    const parentRes = await query(
      'SELECT id FROM comments WHERE id = $1 AND article_id = $2 AND deleted_at IS NULL',
      [parentId, article.id]
    );
    if (!parentRes.rows[0]) {
      return NextResponse.json({ error: 'Bình luận gốc không hợp lệ' }, { status: 400 });
    }
  }

  const insertRes = await query(
    `INSERT INTO comments (article_id, user_id, parent_id, content, status)
     VALUES ($1, $2, $3, $4, 'APPROVED')
     RETURNING id, content, parent_id, likes_count, created_at`,
    [article.id, user.id, parentId, content]
  );

  const newComment = insertRes.rows[0];

  // Fetch author profile for response
  const profileRes = await query(
    'SELECT full_name, dharma_name, avatar_url FROM profiles WHERE user_id = $1',
    [user.id]
  );
  const profile = profileRes.rows[0];

  return NextResponse.json({
    comment: { ...newComment, ...profile, replies: [] },
  }, { status: 201 });
}
