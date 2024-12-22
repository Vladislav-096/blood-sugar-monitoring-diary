import { z } from "zod";
import { API_URL } from "../constants/constants";

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

const Measurementschema = z.object({
  measurements: z.array(MeasurementSchema),
});

export type Measurements = z.infer<typeof Measurementschema>;
