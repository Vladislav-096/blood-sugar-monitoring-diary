import dayjs from "dayjs";

export const convertTimestampToDate = (timestamp: number) => {
  const result = dayjs(timestamp * 1000).format("YYYY-MM-DD");
  return result;
};

export const convertTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return dayjs()
    .set("hour", hours)
    .set("minute", minutes)
    .format("YYYY-MM-DDTHH:mm");
};
