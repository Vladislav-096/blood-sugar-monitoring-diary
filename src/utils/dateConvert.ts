import dayjs from "dayjs";

export const convertTimestampToDate = (timestamp: number) => {
  const result = dayjs(timestamp * 1000).format("YYYY-MM-DD");
  return result;
};
