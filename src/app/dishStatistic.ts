import { validateResponse } from "./validationResponse";

interface GetDisgStatistic {
  dishName: string;
  signal?: AbortSignal;
}

const API_URL = import.meta.env.VITE_BACKEND_PROXY_URL;

export const getDishStatistic = async ({
  dishName,
  signal,
}: GetDisgStatistic) => {
  return fetch(`${API_URL}/dish-statistics`, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dishName }),
  })
    .then(validateResponse)
    .catch((err) => {
      console.log("getDishStatistic function error", err);
      throw err;
    });
};
