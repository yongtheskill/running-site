import { sql } from '../utils/db.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.user == null || typeof query.user !== 'string') return 'user id required';
  const userId = parseInt(query.user);

  const result = await sql`SELECT username FROM users where id = ${userId}`;
  if (result.length == 0) return 'user not found';

  return result[0].username;
});
