export type CheckoutState = "LOADING" | "READY" | "ERROR";

interface Meal {
  id: number | null;
  portion: string;
  dish: string;
}

interface AfterMealMeasurement {
  meal: Meal[];
}

export type FieldNameCreateMeasurementForm =
  | "typeOfMeasurement"
  | "measurement"
  | "time"
  | "createdAt"
  | "afterMealMeasurement"
  | `afterMealMeasurement.meal.${number}`
  | `afterMealMeasurement.meal.${number}.portion`
  | `afterMealMeasurement.meal.${number}.dish`
  | `afterMealMeasurement.meal.${number}.id`;

export type FieldNameEditMeasurementForm = Exclude<
  FieldNameCreateMeasurementForm,
  "time" | "createdAt"
>;

// Переписал значение тип свойства portion
type ModifiedMeal = Omit<Meal, "portion"> & { portion: number };

// Не нужен (?)
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

// Не используется
// export interface EditMeasurement {
//   id: string;
//   data: PartialMeasurementData;
// }

// export type PartialMeasurementData = Partial<MeasurementData>;

export interface FormTypesCreateMeasurement {
  createdAt: number;
  time: string;
  typeOfMeasurement: string;
  afterMealMeasurement: AfterMealMeasurement;
  measurement: string;
}

export type FormTypesEditMeasurement = Omit<
  FormTypesCreateMeasurement,
  "createdAt" | "time"
>;

export interface RequestError {
  code: string;
  message: string;
}

export interface DateRangeTableRow {
  id: string;
  date: number;
  measurement: number;
}

export interface DateRangeChart {
  x: string;
  y: number;
}
