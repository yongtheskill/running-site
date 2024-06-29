import { XMLParser } from 'fast-xml-parser';
import { sql } from '../utils/db.js';
import { getLoggedInUser } from '../utils/auth.js';

const visitRadius = 10;

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  if (formData == undefined) return 'no data received';

  // verify session
  const userId = await getLoggedInUser(event);
  if (userId == null) {
    setResponseStatus(event, 401);
    return 'unauthorized';
  }

  // handle data
  const gpxData = formData.find((formItem) => formItem.name == 'file');
  if (gpxData == undefined) return 'no file received';
  const filename = gpxData.filename;
  const gpx = gpxData.data.toString();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '___',
  });
  const parsed = parser.parse(gpx)['gpx'];
  const exerciseInfo = parsed['exerciseinfo'];
  const points = parsed['trk']['trkseg']['trkpt'] as {
    ele: string;
    time: string;
    ___lat: string;
    ___lon: string;
  }[];

  // metadata
  const date = new Date(parsed['metadate']);
  const distance = exerciseInfo['distance'];
  const duration = exerciseInfo['duration'];
  const avgspeed = exerciseInfo['avgspeed'];
  const elevationGain = exerciseInfo['elevationgain'];

  // route
  const wktPoints = points
    .map((point) => {
      const lat = parseFloat(point.___lat);
      const lon = parseFloat(point.___lon);
      return `${lon.toFixed(9)} ${lat.toFixed(9)}`;
    })
    .join(',');
  const routeWkt = `LINESTRING(${wktPoints})`;

  await sql.begin(async (sql) => {
    // insert run
    const [newRun] =
      await sql`INSERT INTO runs (avg_speed,distance,duration,elevation_gain,ran_at,ran_by,route) VALUES
        (${avgspeed}, ${distance}, ${duration}, ${elevationGain}, ${date.toISOString()}, ${userId}, ST_GeomFromText(${routeWkt},4326)) RETURNING id`;

    // update visited roads
    await sql`INSERT INTO visited_roads (visited_by, road_gid, run_id)
        ((WITH current_route (route,radius) as (values((SELECT ST_Transform(route,3857) FROM runs WHERE id = ${newRun.id}), ${visitRadius}::INT))
        SELECT ${userId}, gid, ${newRun.id} FROM roads, current_route WHERE
        ST_Distance(route, ST_Transform(ST_LineInterpolatePoint(geom, 0.2),3857)) < radius
        AND ST_Distance(route, ST_Transform(ST_LineInterpolatePoint(geom, 0.5),3857)) < radius
        AND ST_Distance(route, ST_Transform(ST_LineInterpolatePoint(geom, 0.8),3857)) < radius))
        ON CONFLICT DO NOTHING`;
  });

  return 'success';
});
