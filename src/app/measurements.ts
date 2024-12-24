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
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  overnight: z.number().optional(),
  bedTime: z.number().optional(),
  beforeMeal: z.number().optional(),
  afterMeal: AfterMealSchema.optional(),
  justMeasurement: z.number().optional(),
});

const MeasurementsSchema = z.array(MeasurementSchema);

export type Measurement = z.infer<typeof MeasurementSchema>;
export type Measurements = z.infer<typeof MeasurementsSchema>;

export const getMeasurements = async (): Promise<Measurement[]> => {
  console.log("here");
  return fetch(`${API_URL}/measurements`, {
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
