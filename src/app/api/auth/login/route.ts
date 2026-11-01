import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ email và mật khẩu.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user and profile
    const userRes = await query(
      `SELECT u.id, u.email, u.password_hash, u.role_id, u.is_active,
              p.full_name, p.dharma_name, p.avatar_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.email = $1 AND u.deleted_at IS NULL`,
      [cleanEmail]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    const user = userRes.rows[0];

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Tài khoản của quý đạo hữu hiện đang tạm khóa. Vui lòng liên hệ Ban Quản trị.' },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // Update last_login_at
    await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // Issue JWT
    const token = signToken({ userId: user.id, roleId: user.role_id });

    const response = NextResponse.json({
      message: 'Đăng nhập thành công! Chúc quý đạo hữu một ngày an lạc.',
      user: {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        full_name: user.full_name,
        dharma_name: user.dharma_name,
        avatar_url: user.avatar_url,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Lỗi API Login:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ trong quá trình đăng nhập. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
