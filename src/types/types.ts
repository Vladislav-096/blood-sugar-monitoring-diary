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
  | "time"
  | "createdAt"
  | "afterMealMeasurement"
  | `afterMealMeasurement.meal.${number}`
  | `afterMealMeasurement.meal.${number}.portion`
  | `afterMealMeasurement.meal.${number}.dish`;

export type ModifiedMeal = Omit<Meal, "portion"> & { portion: number };

export interface MeasurementData {
  id: string;
  createdAt: number;
  time: string;
  updatedAt: number;
  typeOfMeasurement: string;
  measurement: number;
  afterMealMeasurement?: {
    meal: ModifiedMeal[];
  };
}

// Не используется
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
  time: string;
}

export interface RequestError {
  code: string;
  message: string;
}

export const textFieldStyle = {
  ".MuiInputLabel-root": {
    color: "#9198a1",
    "&.Mui-focused": {
      color: "#9198a1",
    },
    // Дизейблд для MuiOutlinedInput-root (ниже) перебивает, видимо, цвет лейбла. Еще раз продублировал тут дизейблед
    "&.Mui-disabled": {
      color: "#9198a1",
    },
  },
  ".MuiInputBase-root": {
    backgroundColor: "#151b23",
  },
  ".MuiOutlinedInput-root": {
    input: {
      color: "#f0f6fc",
      backgroundColor: "#151b23",
      borderRadius: "5px",
    },
    fieldSet: {
      border: "1px solid #3d444db3",
    },
    "&:hover fieldset": {
      border: "1px solid #9198a1",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #9198a1",
    },
  },
  ".MuiSvgIcon-root": {
    color: "#f0f6fc", // Цвет иконки
  },
  // Стили для дизейбленного состояния
  ".Mui-disabled": {
    "&.MuiOutlinedInput-root": {
      input: {
        WebkitTextFillColor: "#9198a1",
      },
      fieldSet: {
        border: "1px solid #3d444db3", // Цвет рамки при дизейбле
      },
    },
  },

  "& .MuiInputBase-input .Mui-disabled": {
    color: "red", // Darker label color
  },
};
