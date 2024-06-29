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
