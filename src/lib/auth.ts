import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from './db';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET: string = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthUser {
  id: string;
  email: string;
  role_id: string;
  full_name: string;
  dharma_name?: string;
  avatar_url?: string;
}

/**
 * Hash a plain text password with bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password against stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign JWT token for user session
 */
export function signToken(payload: { userId: string; roleId: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): { userId: string; roleId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; roleId: string };
  } catch {
    return null;
  }
}

/**
 * Extract authenticated user from cookies or Authorization header
 */
export async function getCurrentUser(req?: Request): Promise<AuthUser | null> {
  let token: string | undefined;

  // 1. Check Authorization header if request is provided
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // 2. Fallback to HTTP-only cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('auth_token')?.value;
    } catch {
      // Cookies might fail in some contexts
    }
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const res = await query<AuthUser>(
    `SELECT u.id, u.email, u.role_id, p.full_name, p.dharma_name, p.avatar_url
     FROM users u
     LEFT JOIN profiles p ON u.id = p.user_id
     WHERE u.id = $1 AND u.is_active = true AND u.deleted_at IS NULL`,
    [decoded.userId]
  );

  return res.rows[0] || null;
}
