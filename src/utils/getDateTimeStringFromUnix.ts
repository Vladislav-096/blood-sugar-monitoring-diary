export const getDateStringFromUnix = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const formattedDate =
    date.getDate().toString().padStart(2, "0") +
    "." +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    date.getFullYear();

  return formattedDate;
};

export const getTimeStringFromUnix = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  // Получаем часы и минуты с ведущими нулями
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
