export type CheckoutState = "LOADING" | "READY" | "ERROR";

export interface Meal {
  portion: string;
  dish: string;
}

type ModifiedMeal = Omit<Meal, "portion"> & { portion: number };

export interface MeasurementData {
  id: string;
  createdAt: number;
  updatedAt: number;
  typeOfMeasurement: string;
  measurement: number;
  afterMealMeasurement?: {
    meal: ModifiedMeal[];
  };
}

export interface EditMeasurement {
  id: string;
  data: PartialMeasurementData;
}

export type PartialMeasurementData = Partial<MeasurementData>;
