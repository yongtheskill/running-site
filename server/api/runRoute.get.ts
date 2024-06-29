import { sql } from '../utils/db.js';
import { getLoggedInUser } from '../utils/auth.js';

export default defineEventHandler(async (event): Promise<string> => {
  const query = getQuery(event);
  if (query.run == null || typeof query.run !== 'string') return 'run id required';
  const runId = parseInt(query.run);

  const userId = await getLoggedInUser(event);
  if (userId == null) {
    setResponseStatus(event, 401);
    return 'unauthorized';
  }

  const result =
    await sql`SELECT ST_AsGeoJSON(ST_TRANSFORM(route,3857)) as route FROM runs WHERE id = ${runId} AND ran_by = ${userId}`;

  if (result.length === 0) return 'run not found';

  return result[0].route;
});
