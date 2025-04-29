import { validateResponse } from "./validationResponse";

// const API_URL = "https://api.together.xyz/v1/chat/completions";
const API_URL = import.meta.env.VITE_BACKEND_URL;

interface GetDisgStatistic {
  dishName: string;
  signal?: AbortSignal;
}

export const getDishStatistic = async ({
  dishName,
  signal,
}: GetDisgStatistic) => {
  return fetch(`${API_URL}/api/getDishStatistic`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dishName }),
  })
    .then(validateResponse)
    .catch((err) => {
      console.log("getDishStatistic function error", err);
      throw err;
    });
};
