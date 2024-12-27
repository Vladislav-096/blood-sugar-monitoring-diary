export function getDateRange(timestamp: number) {
  const date = new Date(timestamp * 1000);

  const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(date.setUTCHours(23, 59, 59)).toISOString();

  const unixStartOfDay = Math.floor(
    new Date(startOfDay).getTime() / 1000
  ).toString();
  const unixEndOfDay = Math.floor(
    new Date(endOfDay).getTime() / 1000
  ).toString();

  return {
    createdAt_gte: unixStartOfDay,
    createdAt_lte: unixEndOfDay,
  };
}
