import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';

    if (!q || q.length < 2) {
      return NextResponse.json({
        articles: [],
        temples: [],
        audio: [],
        learningPaths: [],
      });
    }

    const searchPattern = `%${q}%`;

    // 1. Articles Search
    const articlesRes = await query(
      `SELECT a.id, a.title, a.slug, a.excerpt, c.name as category_name
       FROM articles a
       JOIN article_categories c ON a.category_id = c.id
       WHERE a.status = 'PUBLISHED' AND (a.title ILIKE $1 OR a.excerpt ILIKE $1)
       LIMIT 5`,
      [searchPattern]
    );

    // 2. Temples Search
    const templesRes = await query(
      `SELECT id, name, slug, address, province, is_verified
       FROM temples
       WHERE name ILIKE $1 OR province ILIKE $1 OR address ILIKE $1
       LIMIT 5`,
      [searchPattern]
    );

    // 3. Audio Search
    const audioRes = await query(
      `SELECT id, title, speaker, audio_url, duration_seconds, category
       FROM audio
       WHERE title ILIKE $1 OR speaker ILIKE $1
       LIMIT 5`,
      [searchPattern]
    );

    // 4. Learning Paths Search
    const pathsRes = await query(
      `SELECT id, title, slug, description, level
       FROM learning_paths
       WHERE title ILIKE $1 OR description ILIKE $1
       LIMIT 3`,
      [searchPattern]
    );

    return NextResponse.json({
      articles: articlesRes.rows,
      temples: templesRes.rows,
      audio: audioRes.rows,
      learningPaths: pathsRes.rows,
    });
  } catch (error) {
    console.error('Lỗi API Search:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra sự cố khi tìm kiếm nội dung.' },
      { status: 500 }
    );
  }
}
