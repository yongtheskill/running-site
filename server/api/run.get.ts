import { sql } from '../utils/db.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.run == null || typeof query.run !== 'string') return 'run id required';
  const runId = parseInt(query.run);
  if (isNaN(runId)) return 'run id required';

  const result = await sql`SELECT id, ran_at, distance, duration, avg_speed, elevation_gain,
    array[ST_XMin(ST_TRANSFORM(ST_Envelope(route),3857)), ST_YMin(ST_TRANSFORM(ST_Envelope(route),3857)), ST_XMax(ST_TRANSFORM(ST_Envelope(route),3857)), ST_YMax(ST_TRANSFORM(ST_Envelope(route),3857))] AS bbox 
    FROM runs WHERE id = ${runId}`;

  if (result.length === 0) return 'run not found';
  console.log(result[0]);

  return result[0];
});
