import { sql } from '../utils/db.js';
import argon2 from 'argon2';

export default defineEventHandler(
  async (
    event
  ): Promise<{
    success: boolean;
    error?: string;
    token?: string;
    id?: number;
    username?: string;
  }> => {
    const body = await readBody(event);
    if (body.username == null || typeof body.username !== 'string')
      return { success: false, error: 'username required' };
    if (body.password == null || typeof body.password !== 'string')
      return { success: false, error: 'password required' };

    const userResult = await sql`SELECT id, password FROM users WHERE username = ${body.username}`;
    if (userResult.length === 0) return { success: false, error: 'user not found' };
    const user = userResult[0];

    const passwordCorrect = await argon2.verify(user.password, body.password);
    if (!passwordCorrect) return { success: false, error: 'wrong password' };

    const sessionResult =
      await sql`INSERT INTO sessions (user_id) VALUES (${user.id}) RETURNING id`;
    return { success: true, token: sessionResult[0].id, id: user.id, username: body.username };
  }
);
