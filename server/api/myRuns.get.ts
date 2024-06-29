import { sql } from '../utils/db.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.user == null || typeof query.user !== 'string') return 'user id required';
  const userId = parseInt(query.user);

  const result =
    await sql`SELECT id, ran_at, distance, duration FROM runs WHERE ran_by = ${userId} ORDER BY ran_at DESC`;

  return result;
});
