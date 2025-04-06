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
