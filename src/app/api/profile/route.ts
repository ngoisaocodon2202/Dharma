import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  const res = await query(
    `SELECT p.full_name, p.dharma_name, p.avatar_url, p.cover_url, p.bio, p.province, p.is_public,
            u.email, u.created_at
     FROM profiles p JOIN users u ON u.id = p.user_id
     WHERE p.user_id = $1`,
    [user.id]
  );
  return NextResponse.json({ profile: res.rows[0] || null });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

  const body = await request.json();
  const { full_name, dharma_name, bio, province, is_public, avatar_url, cover_url } = body;

  // Validate
  if (full_name !== undefined && (typeof full_name !== 'string' || full_name.trim().length < 2)) {
    return NextResponse.json({ error: 'Họ tên phải có ít nhất 2 ký tự' }, { status: 400 });
  }

  const updates: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const addField = (col: string, val: unknown) => {
    if (val !== undefined) {
      updates.push(`${col} = $${idx++}`);
      values.push(val);
    }
  };

  addField('full_name', full_name?.trim());
  addField('dharma_name', dharma_name?.trim() || null);
  addField('bio', bio?.trim() || null);
  addField('province', province?.trim() || null);
  addField('is_public', is_public);
  if (avatar_url !== undefined) {
    addField('avatar_url', avatar_url || null);
  }
  if (cover_url !== undefined) {
    addField('cover_url', cover_url || null);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'Không có thông tin nào để cập nhật' }, { status: 400 });
  }

  updates.push(`updated_at = NOW()`);
  values.push(user.id);

  await query(
    `UPDATE profiles SET ${updates.join(', ')} WHERE user_id = $${idx}`,
    values
  );

  // Return updated profile
  const res = await query(
    `SELECT full_name, dharma_name, avatar_url, cover_url, bio, province, is_public
     FROM profiles WHERE user_id = $1`,
    [user.id]
  );

  return NextResponse.json({ profile: res.rows[0] });
}
