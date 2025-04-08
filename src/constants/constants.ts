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
  ".MuiButtonBase-root": {
    "&:hover": {
      backgroundColor: "#3d444db3",
    },
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

export const timePickerMenu = {
  popper: {
    sx: {
      // Стили для контейнера выбора вреимени
      "& .MuiPaper-root": {
        marginTop: "5px",
        backgroundColor: "#151b23",
        color: "#f0f6fc",
        borderRadius: "5px",
        border: "1px solid #9198a1",
      },
      ".MuiMultiSectionDigitalClock-root": {
        borderBottom: "1px solid #9198a1",
      },
      ".MuiList-root": {
        // Стили для скроллбара (работает в Chrome, Edge, Safari)
        "&::-webkit-scrollbar": {
          width: "4px", // ширина вертикального скроллбара
          height: "4px", // высота горизонтального скроллбара
        },
        "&::-webkit-scrollbar-track": {
          background: "#3d444db3", // цвет трека
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#388bfd66", // цвет ползунка
          borderRadius: "5px",
        },
        //

        "&:not(:first-of-type)": {
          borderLeft: "1px solid #9198a1",
        },
      },
      ".MuiButtonBase-root": {
        borderRadius: "5px",

        "&:hover": {
          backgroundColor: "#388bfd66",
        },
        "&.Mui-selected": {
          backgroundColor: "#3d444db3",
        },
      },
    },
  },
};

export const dataPisckerCalendar = {
  popper: {
    sx: {
      "& .MuiPaper-root": {
        // Стили для контейнера календаря
        marginTop: "5px",
        backgroundColor: "#151b23",
        color: "#f0f6fc",
        borderRadius: "5px",
        border: "1px solid #9198a1",
      },
    },
  },
  desktopPaper: {
    sx: {
      "& .MuiPickersCalendarHeader-root": {
        // Заголовок календаря
        // backgroundColor: "#1e293b",
        color: "#f0f6fc",
      },
      // Сегодня
      "& .MuiPickersDay-today:not(.Mui-selected)": {
        border: "1px solid #388bfd66",
      },
      // Стрелка переключения вида (месяц/год)
      "& .MuiPickersCalendarHeader-switchViewButton": {
        color: "#f0f6fc", // Цвет иконки
        "&:hover": {
          backgroundColor: "#388bfd66",
        },
      },
      // Выбранный год
      "& .MuiYearCalendar-root": {
        "& .MuiPickersYear-yearButton": {
          // Обычный год
          color: "#f0f6fc",
          "&:hover": {
            backgroundColor: "#388bfd66",
          },
          // Выбранный год
          "&.Mui-selected": {
            backgroundColor: "#3d444db3",
            "&:hover": {
              backgroundColor: "#3d444db3",
            },
          },
        },
      },
      // Стрелки переключения месяцев
      "& .MuiPickersArrowSwitcher-button": {
        color: "#f0f6fc", // Основной цвет
        "&:hover": {
          color: "#f0f6fc", // При наведении
          backgroundColor: "#388bfd66", // Фон при наведении
        },
        "&.Mui-disabled": {
          color: "#64748b", // Когда стрелка неактивна
        },
      },
      "& .MuiDayCalendar-weekDayLabel": {
        // Дни недели (Пн, Вт и т.д.)
        color: "#f0f6fc",
      },
      "& .MuiPickersDay-root": {
        // Обычные дни
        color: "#f0f6fc",
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "#388bfd66",
        },
        "&.Mui-selected": {
          // Выбранный день
          backgroundColor: "#3d444db3 !important",
          color: "#f0f6fc",
        },
        "&.Mui-disabled": {
          // Неактивные дни
          color: "#f0f6fc", // хз чо это
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
