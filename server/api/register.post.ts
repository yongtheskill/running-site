import { sql } from '../utils/db.js';
import argon2 from 'argon2';

export default defineEventHandler(
  async (event): Promise<{ success: boolean; error?: string; token?: string }> => {
    const body = await readBody(event);
    if (body.username == null || typeof body.username !== 'string')
      return { success: false, error: 'username required' };
    if (body.password == null || typeof body.password !== 'string')
      return { success: false, error: 'password required' };

    const passwordHash = await argon2.hash(body.password);

    const newUserResult =
      await sql`INSERT INTO users (username, password) VALUES (${body.username}, ${passwordHash}) RETURNING id`;

    const sessionResult =
      await sql`INSERT INTO sessions (user_id) VALUES (${newUserResult[0].id}) RETURNING id`;
    return { success: true, token: sessionResult[0].id };
  }
);

// e2a96410-f3ec-4f63-84e4-65c1f4e0119f
