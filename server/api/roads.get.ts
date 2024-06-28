import { sql } from '../utils/db.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.bbox == null || typeof query.bbox !== 'string') return 'bbox required';
  const bbox = query.bbox.split(',').map((x) => parseFloat(x));

  if (query.user == null || typeof query.user !== 'string') return 'user required';
  const userId = parseInt(query.user);

  const result =
    await sql`SELECT jsonb_build_object('type','FeatureCollection', 'features',jsonb_agg(roadjson)) as geojson FROM
(SELECT jsonb_build_object(
'type','Feature',
'id',road.gid,
'geometry',ST_AsGeoJSON(road.geom)::jsonb,
'properties', jsonb_build_object('highway',road.highway, 'name', road.name, 'visited', (road.visited_by IS NOT NULL)) ) roadjson 
FROM (SELECT * FROM roads 
LEFT JOIN visited_roads ON (visited_roads.road_gid = roads.gid AND visited_roads.visited_by = ${userId})
WHERE geom && ST_Transform(ST_MakeEnvelope(${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]},3857),4326)) road)`;
  return result[0].geojson;
});

/*
SELECT *
FROM sg_roads
WHERE  geom 
    && -- intersects,  gets more rows, than @ (contained by)
    ST_MakeEnvelope (
        xmin, ymin, 
        xmax, ymax,
        my_srid);
*/
