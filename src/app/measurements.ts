import { z } from "zod";
import { API_URL } from "../constants/constants";
import { validateResponse } from "./validationResponse";
import { MeasurementData } from "../features/measurementModal/MeasurementModal";

const MealSchema = z.object({
  portion: z.number(),
  dish: z.string(),
});

const MealsSchema = z.array(MealSchema);
export type Meals = z.infer<typeof MealsSchema>;

const AfterMealMeasurementSchema = z.object({
  meal: MealsSchema,
});

const MeasurementSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  typeOfMeasurement: z.string(),
  measurement: z.number(),
  afterMealMeasurement: AfterMealMeasurementSchema.optional(),
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

export const addMeasurement = async (data: MeasurementData) => {
  return fetch(`${API_URL}/measurements`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(validateResponse)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
