export const formatDistance = (distance: number): string => {
  if (distance < 1000) return `${distance.toFixed(0)} m`;
  if (distance < 10000) return `${(distance / 1000).toFixed(2)} km`;
  return `${(distance / 1000).toFixed(1)} km`;
};

export const formatDuration = (duration: number): string => {
  if (duration < 60 * 1000) return `${(duration / 1000).toFixed(0)} s`;
  if (duration < 60 * 60 * 1000) return `${(duration / (60 * 1000)).toFixed(0)} min`;
  if (Math.round((duration / (60 * 1000)) % 60) == 0)
    return `${(duration / (60 * 60 * 1000)).toFixed(0)} h`;
  return `${(duration / (60 * 60 * 1000)).toFixed(0)}h ${((duration / (60 * 1000)) % 60).toFixed(
    0
  )}min`;
};

export const formatFullDuration = (duration: number): string => {
  // format the millisecond duration in HH:mm:ss
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export const formatSpeed = (speed: number): string => {
  // speed is in m/s, convert to s/km
  const sPerKm = (1 / speed) * 1000;
  return `${(sPerKm / 60).toFixed(0)}' ${(sPerKm % 60).toFixed(0)}" /km`;
};
