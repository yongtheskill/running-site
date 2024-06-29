export const epsg4326to3875 = ([lng, lat]: [number, number]): [number, number] => {
  return [
    (lng * 20037508.34) / 180,
    ((Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)) * 20037508.34) / 180,
  ];
};

export const epsg3857to4326 = ([x, y]: [number, number]): [number, number] => {
  return [
    (x * 180) / 20037508.34,
    (Math.atan(Math.pow(Math.E, ((y * 180) / 20037508.34) * (Math.PI / 180))) * 360) / Math.PI - 90,
  ];
};

// xmin, ymin, xmax, ymax,

export const tileTobbox = (z: number, x: number, y: number): [number, number, number, number] => {
  const nw = epsg4326to3875(tileNWCoords(z, x, y));
  const se = epsg4326to3875(tileNWCoords(z, x + 1, y + 1));
  return [nw[0], nw[1], se[0], se[1]];
};

const tileNWCoords = (z: number, x: number, y: number): [number, number] => {
  const n = Math.pow(2, z);
  const lon = (x / n) * 360 - 180;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
  return [lon, lat];
};
