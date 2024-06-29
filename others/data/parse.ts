// SG CHECK
const sgData = Bun.file('./singaporeOutline.geojson');

const sgJson = await sgData.json();

const partsOfSG: number[][][] = [];

for (const feature of sgJson.features) {
  const coordinates = feature.geometry.coordinates[0];
  partsOfSG.push(coordinates);
}

partsOfSG.sort((a, b) => {
  return b.length - a.length;
});

function pointInGeometry(point: number[], vs: number[][]) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

function pointInSG(point: number[]) {
  for (const part of partsOfSG) {
    if (pointInGeometry(point, part)) {
      return true;
    }
  }
  return false;
}

function lineInSG(line: number[][]) {
  for (const point of line) {
    if (pointInSG(point)) {
      return true;
    }
  }
  return false;
}

// ACTUAL PARSING

const file = Bun.file('./singapore.geojson');
const contents = await file.json();

const allHighwayTypes = [
  'pedestrian',
  'footway',
  'residential',
  'bus_stop',
  'elevator',
  'corridor',
  'rest_area',
  'services',
  'path',
  'service',
  'primary',
  'tertiary',
  'secondary',
  'motorway',
  'motorway_link',
  'trunk',
  'trunk_link',
  'primary_link',
  'living_street',
  'construction',
  'unclassified',
  'secondary_link',
  'steps',
  'track',
  'cycleway',
  'tertiary_link',
  'bridleway',
  'raceway',
  'proposed',
  'no_stopping',
  'crossing',
  'motorway_junction',
  'traffic_signals',
  'stop',
  'speed_camera',
  'turning_circle',
  'traffic_signals_emergency',
  'turning_loop',
  'mini_roundabout',
  'traffic_signals;crossing',
  'give_way',
  'street_lamp',
  'traffic_mirror',
  'milestone',
  'toll_gantry',
  'trailhead',
];

const highwayTypesToKeep = [
  'pedestrian',
  'footway',
  'residential',
  'corridor',
  'path',
  'service',
  'steps',
  //   'primary',
  //   'tertiary',
  //   'secondary',
  //   'motorway',
  //   'motorway_link',
  //   'trunk',
  //   'trunk_link',
  //   'primary_link',
  'living_street',
  //   'construction',
  'unclassified',
  //   'secondary_link',
  'track',
  'cycleway',
  //   'tertiary_link',
  'bridleway',
  'raceway',
  //   'proposed',
  //   'no_stopping',
  //   'crossing',
];

// create a new json only containing features with the property "highway"
const highways = contents.features.filter((f) => {
  if (!f.properties.hasOwnProperty('highway')) {
    return false;
  }

  const highwayType = f.properties.highway;
  if (!highwayTypesToKeep.includes(highwayType)) {
    return false;
  }

  if (f.geometry.type === 'Point' || f.geometry.type === 'Polygon') {
    return false;
  }

  return lineInSG(f.geometry.coordinates);
});

const reformattedHighways = highways.map((feat) => {
  return {
    type: 'Feature',
    osm_id: feat.id,
    properties: {
      highway: feat.properties.highway,
      name: feat.properties.name,
      osm_id: feat.id,
    },
    geometry: feat.geometry,
  };
});

console.log(reformattedHighways.length);

const geojson = {
  type: 'FeatureCollection',
  features: reformattedHighways,
};

// write the new json to a file
await Bun.write('./roads.geojson', JSON.stringify(geojson, null, 2));
// await Bun.write('../webmap/highways.geojson', JSON.stringify(geojson, null, 2));
