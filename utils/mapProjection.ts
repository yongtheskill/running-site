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
