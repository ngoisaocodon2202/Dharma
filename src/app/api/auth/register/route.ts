import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, dharma_name, province } = body;

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email không hợp lệ. Vui lòng kiểm tra lại.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải chứa ít nhất 6 ký tự.' },
        { status: 400 }
      );
    }

    if (!full_name || full_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Họ tên hoặc Pháp danh của bạn.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing email
    const existing = await query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user and profile inside database transaction
    const userRes = await query(
      `INSERT INTO users (email, password_hash, role_id, is_active, is_verified)
       VALUES ($1, $2, 'USER', true, false)
       RETURNING id, email, role_id`,
      [cleanEmail, passwordHash]
    );

    const newUser = userRes.rows[0];

    await query(
      `INSERT INTO profiles (user_id, full_name, dharma_name, province)
       VALUES ($1, $2, $3, $4)`,
      [newUser.id, full_name.trim(), dharma_name ? dharma_name.trim() : null, province || null]
    );

    // Issue JWT
    const token = signToken({ userId: newUser.id, roleId: newUser.role_id });

    const response = NextResponse.json(
      {
        message: 'Đăng ký tài khoản tu học thành công! Chào mừng quý đạo hữu.',
        user: {
          id: newUser.id,
          email: newUser.email,
          role_id: newUser.role_id,
          full_name: full_name.trim(),
          dharma_name: dharma_name ? dharma_name.trim() : null,
        },
      },
      { status: 201 }
    );

    // Set HTTP-only secure cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Lỗi API Register:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ trong quá trình đăng ký. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
