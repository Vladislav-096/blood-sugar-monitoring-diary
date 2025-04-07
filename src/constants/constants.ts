export const API_URL = "http://localhost:8653";

export const initialAfterMealMeasurement = {
  id: "",
  time: "",
  createdAt: 0,
  updatedAt: 0,
  typeOfMeasurement: "",
  measurement: 0,
};

export const buttonDisabledStyles = {
  "&.Mui-disabled": {
    backgroundColor: "#323232f7",
  },
};

export const requestErrorInitial = {
  code: "",
  message: "",
};

export const textFieldStyle = {
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
      color: "#f44336 !important", // Красный цвет для лейбла при ошибке
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
        borderColor: "#f44336 !important", // Красная рамка при наведении с ошибкой
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f44336 !important", // Красная рамка при фокусе с ошибкой
      },
      "& fieldset": {
        borderColor: "#f44336 !important", // Базовая красная рамка
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
  "& .MuiFormHelperText-root": {
    // Стиль для текста ошибки
    "&.Mui-error": {
      color: "#f44336",
      marginLeft: "14px",
    },
  },
};
