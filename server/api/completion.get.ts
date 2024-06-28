import { sql } from '../utils/db.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.user == null || typeof query.user !== 'string') return 'user id required';
  const userId = parseInt(query.user);

  const result = await sql`SELECT (visited/total::float)*100 completion_percentage
FROM (SELECT COUNT(*) total, SUM(CASE WHEN visited_roads.id IS NOT NULL THEN 1 ELSE 0 END) visited FROM roads
LEFT JOIN visited_roads ON (visited_roads.road_gid = roads.gid AND visited_roads.visited_by = ${userId}))`;
  return result[0].completion_percentage;
});
