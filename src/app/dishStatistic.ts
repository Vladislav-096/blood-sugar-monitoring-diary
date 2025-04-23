import { validateResponse } from "./validationResponse";

const API_URL = "https://api.together.xyz/v1/chat/completions";
// const API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface GetDisgStatistic {
  dishName: string;
  signal?: AbortSignal;
}

export const getDishStatistic = async ({
  dishName,
  signal,
}: GetDisgStatistic) => {
  const prompt = `How many calories, proteins, fats, and carbohydrates are in 100 grams of ${dishName}? Return the answer as a JSON string with fields for calories, proteins, fats, and carbohydrates, and a separate field with a comment about the glycemic index in English. Do not include ANYTHING else in the response (no extra symbols or words) except the JSON string. But if ${dishName} is not a food, then return an empty string as an answer (no need any JSON string anymore)`;
  // const prompt = `What are the macronutrients (calories, proteins, fats, and carbohydrates) in ${dishName}? Return the answer as a JSON string with fields for proteins, fats, and carbohydrates, and a separate field with a comment about the glycemic index in English. Return an empty string if ${dishName} is not a food`;
  return fetch(API_URL, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // model: "thudm/glm-4-32b:free",
      model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  })
    .then(validateResponse)
    .catch((err) => {
      // console.log("getDisgStatistic function error", err);
      throw err;
    });
};
