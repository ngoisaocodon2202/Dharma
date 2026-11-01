import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    message: 'Đăng xuất thành công. Hẹn gặp lại quý đạo hữu.',
  });

  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
