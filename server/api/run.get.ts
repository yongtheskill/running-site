import { sql } from '../utils/db.js';
import { getLoggedInUser } from '../utils/auth.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.run == null || typeof query.run !== 'string') return 'run id required';
  const runId = parseInt(query.run);
  if (isNaN(runId)) return 'run id required';

  const userId = await getLoggedInUser(event);
  if (userId == null) {
    setResponseStatus(event, 401);
    return 'unauthorized';
  }

  const result = await sql`SELECT id, ran_at, distance, duration, avg_speed, elevation_gain,
    array[ST_XMin(ST_TRANSFORM(ST_Envelope(route),3857)), ST_YMin(ST_TRANSFORM(ST_Envelope(route),3857)), ST_XMax(ST_TRANSFORM(ST_Envelope(route),3857)), ST_YMax(ST_TRANSFORM(ST_Envelope(route),3857))] AS bbox 
    FROM runs WHERE id = ${runId} AND ran_by = ${userId}`;

  if (result.length === 0) return 'run not found';

  return result[0];
});
