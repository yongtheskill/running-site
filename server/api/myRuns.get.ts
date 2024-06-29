import { sql } from '../utils/db.js';
import { getLoggedInUser } from '../utils/auth.js';

export default defineEventHandler(async (event) => {
  const userId = await getLoggedInUser(event);
  if (userId == null) {
    setResponseStatus(event, 401);
    return 'unauthorized';
  }

  const result =
    await sql`SELECT id, ran_at, distance, duration FROM runs WHERE ran_by = ${userId} ORDER BY ran_at DESC`;

  return result;
});
