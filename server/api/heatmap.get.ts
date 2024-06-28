import { sql } from '../utils/db.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.user == null || typeof query.user !== 'string') return 'user id required';
  const userId = parseInt(query.user);

  const result =
    await sql`SELECT jsonb_build_object('type','FeatureCollection', 'features',jsonb_agg(agg_point_json)) as geojson
FROM (SELECT json_build_object(
'type','Feature',
'id',agg_point.id,
'geometry',ST_AsGeoJSON(agg_point.snapped_point)::json,
'properties',json_build_object('count',agg_point.count)) agg_point_json 
FROM (WITH points AS (SELECT ST_Transform(ST_StartPoint(geom),3857) roadStart FROM roads
LEFT JOIN visited_roads ON (visited_roads.road_gid = roads.gid AND visited_roads.visited_by = ${userId})
WHERE visited_roads.visited_by IS NULL),
snapped_points as (SELECT ST_AsText(roadStart) roadStart, st_snaptogrid(roadStart,100) snapped_point FROM points)
SELECT row_number() OVER () as id, ST_Transform(snapped_point,4326) snapped_point, count(*) FROM snapped_points GROUP BY snapped_point) agg_point)`;
  //   console.log(Math.max(...result[0].geojson.features.map((f) => f.properties.count))); // get maximum count
  return result[0].geojson;
});
