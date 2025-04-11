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

export const mergeDateAndTime = (
  timestampDate: number,
  timestampTime: number
) => {
  // Парсим таймстампы в Day.js объекты
  const datePart = dayjs.unix(timestampDate);
  const timePart = dayjs.unix(timestampTime);

  // Берем дату из первого таймстампа
  const merged = datePart
    .hour(timePart.hour()) // Подставляем часы
    .minute(timePart.minute()) // Минуты
    .second(timePart.second()); // Секунды

  // Возвращаем результат в Unix-таймстампе
  return merged.unix();
};
