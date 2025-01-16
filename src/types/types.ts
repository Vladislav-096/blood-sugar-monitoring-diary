export type CheckoutState = "LOADING" | "READY" | "ERROR";

export interface Meal {
  portion: string;
  dish: string;
}

export interface AfterMealMeasurement {
  meal: Meal[];
}

export type FieldName =
  | "typeOfMeasurement"
  | "measurement"
  | "createdAt"
  | "updatedAt"
  | "afterMealMeasurement"
  | `afterMealMeasurement.meal.${number}`
  | `afterMealMeasurement.meal.${number}.portion`
  | `afterMealMeasurement.meal.${number}.dish`;

export type ModifiedMeal = Omit<Meal, "portion"> & { portion: number };

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

export interface FormTypes {
  typeOfMeasurement: string;
  afterMealMeasurement: AfterMealMeasurement;
  measurement: string;
  createdAt: string;
  updatedAt: string;
}
