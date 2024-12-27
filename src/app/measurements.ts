import { z } from "zod";
import { API_URL } from "../constants/constants";
import { validateResponse } from "./validationResponse";

const MealSchema = z.object({
  portion: z.number(),
  dish: z.string(),
});

const AfterMealSchema = z.object({
  measurement: z.number(),
  meal: MealSchema,
});

const MeasurementSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  overnight: z.number().optional(),
  bedTime: z.number().optional(),
  beforeMeal: z.number().optional(),
  afterMeal: AfterMealSchema.optional(),
  justMeasurement: z.number().optional(),
});

const MeasurementsSchema = z.array(MeasurementSchema);
export type Measurement = z.infer<typeof MeasurementSchema>;

const TypeOfMeasurementsSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const TypesOfMeasurementsSchema = z.array(TypeOfMeasurementsSchema);
export type TypesOfMeasurements = z.infer<typeof TypesOfMeasurementsSchema>;
// export type Measurements = z.infer<typeof MeasurementsSchema>;

export interface filters extends Record<string, string> {
  createdAt_gte: string;
  createdAt_lte: string;
}

export const getMeasurements = async (
  filters?: filters
): Promise<Measurement[]> => {
  let url = `${API_URL}/measurements`;

  if (filters) {
    const queryParams = new URLSearchParams(filters).toString();
    url = `${url}?${queryParams}`;
  }

  // if (filters) {
  //   url =
  //     "http://localhost:8653/measurements?createdAt_gte=2024-09-25T00:00:00.000Z&createdAt_lte=2024-09-25T23:59:59.999Z";
  // }

  return fetch(url, {
    method: "GET",
  })
    .then(validateResponse)
    .then((res) => res.json())
    .then((data) => MeasurementsSchema.parse(data))
    .catch((err) => {
      console.log("getMeasurements functions error", err);
      throw err;
    });
};

export const getTypesOfMeasuremens = async () => {
  return fetch(`${API_URL}/typesOfMeasuremens`, {
    method: "GET",
  })
    .then(validateResponse)
    .then((res) => res.json())
    .then((data) => TypesOfMeasurementsSchema.parse(data))
    .catch((err) => {
      console.log("getTypesOfMeasuremens functions error", err);
      throw err;
    });
};
