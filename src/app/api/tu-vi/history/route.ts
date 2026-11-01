import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({
        isAuthenticated: false,
        history: [],
      });
    }

    const res = await query(
      `SELECT id, full_name, gender, birth_date, birth_hour, 
              calendar_type, view_year, focus_area, can_chi, menh, cung, 
              reading_result, created_at
       FROM tu_vi_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [user.id]
    );

    return NextResponse.json({
      isAuthenticated: true,
      history: res.rows,
    });
  } catch (error) {
    console.error('Lỗi lấy lịch sử tử vi:', error);
    return NextResponse.json(
      { error: 'Không thể tải lịch sử xem tử vi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID bản ghi' }, { status: 400 });
    }

    await query(
      `DELETE FROM tu_vi_history WHERE id = $1 AND user_id = $2`,
      [id, user.id]
    );

    return NextResponse.json({ success: true, message: 'Đã xóa bản ghi' });
  } catch (error) {
    console.error('Lỗi xóa lịch sử tử vi:', error);
    return NextResponse.json(
      { error: 'Không thể xóa bản ghi lịch sử' },
      { status: 500 }
    );
  }
}
