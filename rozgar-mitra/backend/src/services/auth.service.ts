import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/connection';
import { config } from '../config';
import type { AuthUser, TokenPayload } from '@rozgar-mitra/shared';

interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  role: 'worker' | 'employer';
  preferred_language: 'en' | 'hi';
  company_name?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: AuthUser;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const db = getDb();

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(input.email);
  if (existing) throw new Error('EMAIL_EXISTS');

  const password_hash = await bcrypt.hash(input.password, config.bcryptRounds);

  const result = db.prepare(`
    INSERT INTO users (email, password_hash, role, full_name, preferred_language)
    VALUES (?, ?, ?, ?, ?)
  `).run(input.email, password_hash, input.role, input.full_name, input.preferred_language);

  const userId = result.lastInsertRowid as number;

  if (input.role === 'worker') {
    db.prepare(`INSERT INTO worker_profiles (user_id) VALUES (?)`).run(userId);
  } else if (input.role === 'employer') {
    db.prepare(`
      INSERT INTO employer_profiles (user_id, company_name)
      VALUES (?, ?)
    `).run(userId, input.company_name || input.full_name);
  }

  const user: AuthUser = {
    id: userId,
    email: input.email,
    role: input.role,
    full_name: input.full_name,
    preferred_language: input.preferred_language,
    created_at: new Date().toISOString(),
  };

  const token = signToken(user);
  return { token, user };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const db = getDb();

  const row = db.prepare(`
    SELECT id, email, password_hash, role, full_name, preferred_language, created_at, is_active
    FROM users WHERE email = ?
  `).get(input.email) as any;

  if (!row) throw new Error('INVALID_CREDENTIALS');
  if (!row.is_active) throw new Error('ACCOUNT_DISABLED');

  const valid = await bcrypt.compare(input.password, row.password_hash);
  if (!valid) throw new Error('INVALID_CREDENTIALS');

  const user: AuthUser = {
    id: row.id,
    email: row.email,
    role: row.role,
    full_name: row.full_name,
    preferred_language: row.preferred_language,
    created_at: row.created_at,
  };

  const token = signToken(user);
  return { token, user };
}

function signToken(user: AuthUser): string {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    sub: user.id,
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as any);
}
