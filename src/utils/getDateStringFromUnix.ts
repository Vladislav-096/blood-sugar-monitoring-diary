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
