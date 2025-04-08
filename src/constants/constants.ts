import dayjs from "dayjs";

export const API_URL = "http://localhost:8653";

export const initialAfterMealMeasurement = {
  id: "",
  time: "",
  createdAt: 0,
  updatedAt: 0,
  typeOfMeasurement: "",
  measurement: 0,
};

export const requestErrorInitial = {
  code: "",
  message: "",
};

export const validationRules = {
  createdAt: {
    required: "This field is required",
    validate: (value: number | null) => {
      if (value === null || isNaN(value)) return "Invalid date format";

      const date = dayjs.unix(value);
      if (!date.isValid()) return "Invalid date format";
      if (date.isBefore(dayjs("1900-01-01"))) return "Date too early";
      if (date.isAfter(dayjs("2099-12-31"))) return "Date too late";
      return true;
    },
  },
  time: {
    required: "Time is required",
    pattern: {
      value: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: "Please enter time in HH:mm format",
    },
  },
  typeOfMeasurement: {
    required: "Measurement type is required",
  },
  measurement: {
    required: "Measurement value is required",
    validate: (value: string) => {
      if (!value.trim() || Number(value) <= 0)
        return "Measurement cannot be empty";
      if (isNaN(Number(value))) return "Must be a number";
      return true;
    },
  },
  mealItems: {
    dish: {
      required: "Dish name is required",
      validate: (value: string) => {
        if (value.trim() === "") return "Dish cannot be empty";
        return true;
      },
    },
    portion: {
      required: "Portion value is required",
      validate: (value: string) => {
        if (!value.trim() || Number(value) <= 0)
          return "Portion cannot be empty";
        if (isNaN(Number(value))) return "Must be a number";
        return true;
      },
    },
  },
};

export const buttonDisabledStyles = {
  "&.Mui-disabled": {
    backgroundColor: "#323232f7",
  },
};

export const textFieldStyle = {
  marginBottom: "15px",
  "& .MuiSelect-select": {
    // Стиль выбранного текста
    color: "#f0f6fc",
  },
  ".MuiInputLabel-root": {
    color: "#9198a1",
    "&.Mui-focused": {
      color: "#9198a1",
    },
    "&.Mui-disabled": {
      color: "#9198a1",
    },
    "&.Mui-error": {
      // Добавляем стиль для ошибки
      color: "#f44336", // Красный цвет для лейбла при ошибке
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
    "&.Mui-error": {
      // Стили для состояния ошибки
      "&:hover fieldset": {
        borderColor: "#f44336", // Красная рамка при наведении с ошибкой
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f44336", // Красная рамка при фокусе с ошибкой
      },
      "& fieldset": {
        borderColor: "#f44336", // Базовая красная рамка
      },
    },
  },
  ".MuiSvgIcon-root": {
    color: "#f0f6fc",
  },
  ".Mui-disabled": {
    "&.MuiOutlinedInput-root": {
      input: {
        WebkitTextFillColor: "#9198a1",
      },
      fieldSet: {
        border: "1px solid #3d444db3",
      },
    },
  },
};

export const selectDropdowStyles = {
  select: {
    MenuProps: {
      PaperProps: {
        sx: {
          marginTop: "5px",
          backgroundColor: "#151b23",
          border: "1px solid #9198a1",
          padding: "8px",
          "& .MuiMenuItem-root": {
            borderRadius: "5px",
            color: "#f0f6fc",
            "&:hover": {
              backgroundColor: "#388bfd66",
              // #388bfd66 синий
              // #3d444db3 серый
            },
            "&.Mui-selected": {
              backgroundColor: " #3d444db3",
            },
          },
        },
      },
    },
  },
};

export const formHelperErrorStyles = {
  position: "absolute",
  bottom: "15px",
  right: "0px",
};
