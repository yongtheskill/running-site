import { sql } from '../utils/db.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.run == null || typeof query.run !== 'string') return 'run id required';
  const runId = parseInt(query.run);

  const result = await sql`SELECT ST_AsGeoJSON(route) as route FROM runs WHERE id = ${runId}`;

  if (result.length === 0) return 'run not found';

  return result[0].route;
});
