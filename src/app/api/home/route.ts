import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Categories
    const categoriesRes = await query(
      `SELECT id, name, slug, description, sort_order 
       FROM article_categories 
       ORDER BY sort_order ASC, name ASC`
    );

    // 2. Recent Articles
    const articlesRes = await query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.cover_image, a.reading_time_minutes, a.view_count, a.published_at,
              c.name as category_name, c.slug as category_slug,
              p.full_name as author_name, p.dharma_name as author_dharma_name, p.avatar_url as author_avatar
       FROM articles a
       JOIN article_categories c ON a.category_id = c.id
       JOIN profiles p ON a.author_id = p.user_id
       WHERE a.status = 'PUBLISHED' AND a.deleted_at IS NULL
       ORDER BY a.published_at DESC LIMIT 6`
    );

    // 3. Daily Practice (Today or latest)
    const practiceRes = await query(
      `SELECT dp.id, dp.practice_date, dp.mindful_quote, dp.quote_source, dp.reflection_text, dp.mindful_action,
              a.title as audio_title, a.audio_url, a.duration_seconds
       FROM daily_practices dp
       LEFT JOIN audio a ON dp.audio_id = a.id
       ORDER BY dp.practice_date DESC LIMIT 1`
    );

    // 4. Learning Paths
    const learningPathsRes = await query(
      `SELECT id, title, slug, description, level, icon_name, estimated_hours, total_modules
       FROM learning_paths
       ORDER BY sort_order ASC LIMIT 5`
    );

    // 5. Audio Tracks
    const audioRes = await query(
      `SELECT id, title, speaker, audio_url, duration_seconds, category, cover_image, description, listen_count
       FROM audio
       ORDER BY listen_count DESC, created_at DESC LIMIT 6`
    );

    // 6. Temples & Sacred Places
    const templesRes = await query(
      `SELECT id, name, slug, category, tradition, abbot_name, address, province, district, cover_image, description, is_verified
       FROM temples
       ORDER BY is_verified DESC, name ASC LIMIT 6`
    );

    // 7. Videos
    const videosRes = await query(
      `SELECT id, title, speaker, video_url, thumbnail_url, duration_seconds, category, description, view_count
       FROM videos
       ORDER BY view_count DESC LIMIT 4`
    );

    // 8. Events
    const eventsRes = await query(
      `SELECT id, title, slug, description, cover_image, start_date, location, is_online
       FROM events
       ORDER BY start_date ASC LIMIT 3`
    );

    // 9. Organizations
    const orgsRes = await query(
      `SELECT id, name, slug, org_type, logo_url, cover_url, description, address, website, is_verified
       FROM organizations
       WHERE is_verified = true
       ORDER BY created_at ASC LIMIT 4`
    );

    // 10. Sacred Books
    const booksRes = await query(
      `SELECT id, title, author, translator, cover_image, description, category, total_pages
       FROM books
       ORDER BY created_at DESC LIMIT 4`
    );

    return NextResponse.json({
      categories: categoriesRes.rows,
      articles: articlesRes.rows,
      dailyPractice: practiceRes.rows[0] || null,
      learningPaths: learningPathsRes.rows,
      audio: audioRes.rows,
      temples: templesRes.rows,
      videos: videosRes.rows,
      events: eventsRes.rows,
      organizations: orgsRes.rows,
      books: booksRes.rows,
    });
  } catch (error) {
    console.error('Lỗi API Home:', error);
    return NextResponse.json(
      { error: 'Không thể tải dữ liệu trang chủ từ cơ sở dữ liệu.' },
      { status: 500 }
    );
  }
}
