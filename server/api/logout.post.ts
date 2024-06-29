import { getSessionToken } from '../utils/auth.js';
import { sql } from '../utils/db.js';

export default defineEventHandler(async (event) => {
  const sessionToken = await getSessionToken(event);
  console.log('SESSION TOKEN', sessionToken);
  if (sessionToken == null) return { success: false, error: 'not logged in' };
  await sql`DELETE FROM sessions WHERE id = ${sessionToken}`;
  return { success: true };
});
