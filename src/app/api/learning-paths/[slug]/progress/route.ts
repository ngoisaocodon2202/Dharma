import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/learning-paths/[slug]/progress — get user's progress for a path
export async function GET(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ enrolledAt: null, completedModuleIds: [] });
  }

  const { slug } = await params;

  const pathRes = await query('SELECT id FROM learning_paths WHERE slug = $1', [slug]);
  const path = pathRes.rows[0];
  if (!path) return NextResponse.json({ error: 'Không tìm thấy lộ trình' }, { status: 404 });

  const [progressRes, completionsRes] = await Promise.all([
    query(
      'SELECT started_at FROM user_path_progress WHERE user_id = $1 AND path_id = $2',
      [user.id, path.id]
    ),
    query(
      `SELECT umc.module_id FROM user_module_completions umc
       JOIN learning_path_modules m ON umc.module_id = m.id
       WHERE umc.user_id = $1 AND m.path_id = $2`,
      [user.id, path.id]
    ),
  ]);

  return NextResponse.json({
    enrolledAt: progressRes.rows[0]?.started_at || null,
    completedModuleIds: completionsRes.rows.map((r: any) => r.module_id),
  });
}

// POST /api/learning-paths/[slug]/progress — enroll or mark module complete
export async function POST(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();
  const moduleId: string | undefined = body.module_id;

  const pathRes = await query('SELECT id FROM learning_paths WHERE slug = $1', [slug]);
  const path = pathRes.rows[0];
  if (!path) return NextResponse.json({ error: 'Không tìm thấy lộ trình' }, { status: 404 });

  // Enroll in path if not yet enrolled
  await query(
    `INSERT INTO user_path_progress (user_id, path_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, path_id) DO UPDATE SET last_activity_at = NOW()`,
    [user.id, path.id]
  );

  // Optionally mark a module complete
  if (moduleId) {
    const modRes = await query(
      'SELECT id FROM learning_path_modules WHERE id = $1 AND path_id = $2',
      [moduleId, path.id]
    );
    if (!modRes.rows[0]) {
      return NextResponse.json({ error: 'Module không thuộc lộ trình này' }, { status: 400 });
    }

    const existing = await query(
      'SELECT id FROM user_module_completions WHERE user_id = $1 AND module_id = $2',
      [user.id, moduleId]
    );

    if (existing.rows[0]) {
      // Toggle off
      await query('DELETE FROM user_module_completions WHERE id = $1', [existing.rows[0].id]);
      return NextResponse.json({ completed: false });
    } else {
      await query(
        'INSERT INTO user_module_completions (user_id, module_id) VALUES ($1, $2)',
        [user.id, moduleId]
      );
      return NextResponse.json({ completed: true }, { status: 201 });
    }
  }

  return NextResponse.json({ enrolled: true });
}
