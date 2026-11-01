import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  const body = await request.json();
  const { data_url, type } = body; // type: 'avatar' | 'cover'

  if (!data_url || typeof data_url !== 'string') {
    return NextResponse.json({ error: 'Dữ liệu ảnh không hợp lệ' }, { status: 400 });
  }

  // Validate it's a proper data URL image
  if (!data_url.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Chỉ chấp nhận file ảnh' }, { status: 400 });
  }

  // Limit size ~8MB base64
  if (data_url.length > 10_000_000) {
    return NextResponse.json({ error: 'Ảnh quá lớn (tối đa 8MB)' }, { status: 400 });
  }

  const isCover = type === 'cover';
  const column = isCover ? 'cover_url' : 'avatar_url';
  const subFolder = isCover ? 'covers' : 'avatars';
  const prefix = isCover ? 'cover' : 'avatar';

  // Decode base64
  const matches = data_url.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!matches) {
    return NextResponse.json({ error: 'Định dạng ảnh không đúng' }, { status: 400 });
  }

  let ext = matches[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext.includes('svg')) ext = 'svg';

  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subFolder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate safe filename and relative URL
  const filename = `${prefix}-${user.id}-${Date.now()}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);

  const publicUrl = `/uploads/${subFolder}/${filename}`;

  // Persist directly to PostgreSQL profiles table
  await query(
    `UPDATE profiles SET ${column} = $1, updated_at = NOW() WHERE user_id = $2`,
    [publicUrl, user.id]
  );

  return NextResponse.json({ url: publicUrl, success: true });
}
