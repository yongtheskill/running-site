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

// bbd6e348-1456-411d-a1c1-da4a2d17f9bd
