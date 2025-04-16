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
          backgroundImage: "none",
          marginTop: "5px",
          backgroundColor: "#0d1117",
          border: "1px solid #9198a1",
          padding: "8px",
          "& .MuiMenuItem-root": {
            borderRadius: "5px",
            color: "#f0f6fc",
            "&:hover": {
              backgroundColor: "#388bfd66",
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

export const scrollBarStyles = {
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
};

export const timePickerMenu = {
  popper: {
    sx: {
      // Стили для контейнера выбора вреимени
      "& .MuiPaper-root": {
        marginTop: "5px",
        backgroundColor: "#0d1117",
        // backgroundColor: "#121212",
        backgroundImage: "none",
        color: "#f0f6fc",
        borderRadius: "5px",
        border: "1px solid #9198a1",
      },
      ".MuiMultiSectionDigitalClock-root": {
        borderBottom: "1px solid #9198a1",
      },
      ".MuiList-root": {
        // Стили для скроллбара (работает в Chrome, Edge, Safari)
        ...scrollBarStyles,
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
          color: "#f0f6fc",
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
        backgroundColor: "#0d1117",
        // backgroundColor: "#121212",
        backgroundImage: "none",
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
        ...scrollBarStyles,

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
          color: "#31363d !important",
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

export const modalContentStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#151b23",
  padding: "15px",
  borderRadius: "5px",
  textAlign: "center",
  width: "400px",
};

export const modalInnerContentStyles = {
  maxHeight: "650px",
  overflowY: "auto",
  ...scrollBarStyles,
};

// Полностью в ручную. Отказался. Частично воспользовался темами библиотеки
export const dataGridStyles = {
  border: "1px solid #3d444db3",
  color: "#f0f6fc",
  backgroundColor: "#010409",

  // Футер таблицы
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid #3d444db3", // Верхняя граница
  },

  // Заголовки колонок
  "& .MuiDataGrid-columnHeaders": {
    fontSize: "16px",

    // Стили для иконки сортировки
    "& .MuiButtonBase-root": {
      "&:hover": {
        backgroundColor: "#3d444db3",
      },

      "& .MuiDataGrid-sortIcon": {
        color: "#f0f6fc", // Цвет иконки
        fontSize: "20px", // Размер
        borderRadius: "50%",
        // opacity: '1 !important',
        // transition: "all 0.2s ease", // Анимация

        "&:hover": {
          // opacity: '1',
          // backgroundColor: "#3d444db3",
          transform: "scale(1.1)",
        },
      },
    },

    // Стили для активной сортировки
    "& .MuiDataGrid-columnHeader--sorted": {
      "&:focus": {
        outline: "1px solid #3d444db3",
      },

      "& .MuiDataGrid-sortIcon": {
        color: "#f0f6fc", // Другой цвет при активной сортировке
        opacity: 1,
      },
    },

    // Стили ячеек заголовков при активной сортировки если сортировал по клику на кнопку сортировки
    "& .MuiDataGrid-columnHeader:focus-within": {
      outline: "1px solid #3d444db3",
    },

    // Устанавливаем font-weight для текста заголовков
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
      userSelect: "none",
    },

    ".MuiDataGrid-filler": {
      backgroundColor: "#151b23", // Красит оставшееся постаранство в заголовках
      borderBottom: "none !important",
    },
  },

  // Нижняя часть таблицы (Я точно сделал какую-то хуйню)
  "& .MuiDataGrid-filler": {
    ".css-1tdeh38": {
      borderTop: "1px solid #3d444db3",
    },
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#151b23", // Красит каждую ячейку заголовка
    borderBottom: "none !important",

    "&:focus": {
      outline: "1px solid #3d444db3", // Оранжевая обводка
    },
  },

  // Строки
  "& .MuiDataGrid-row": {
    "&:hover": {
      backgroundColor: "#388bfd66", // Фон строки при наведении
    },

    "&.Mui-selected": {
      backgroundColor: "#3d444db3",
      "&:hover": {
        backgroundColor: "#3d444db3", // Цвет при наведении на выделенную строку
      },
    },

    // Ячейки
    "& .MuiDataGrid-cell": {
      fontSize: "14px", // Устанавливаем размер шрифта для всех ячеек
      borderTop: "1px solid #3d444db3",

      "&:focus": {
        outline: "none",
        // backgroundColor: "#3d444db3",
      },
    },

    "&.MuiDataGrid-row--firstVisible": {
      borderTop: "none",
    },
  },

  // Пагинация
  "& .MuiTablePagination-root": {
    color: "#f0f6fc",

    // Иконки и кнопки
    "& .MuiButtonBase-root": {
      color: "#f0f6fc",
      "&:hover": {
        backgroundColor: "#3d444db3",
      },

      "&.Mui-disabled": {
        color: "#3d444db3", // Серый цвет для неактивных кнопок
        cursor: "not-allowed", // Курсор "недоступно"
      },
    },
  },
};

export const dataGridStylesTest = {
  backgroundColor: "#010409",
  color: "#f0f6fc",

  // Скроллбар талблицы
  "& .MuiDataGrid-scrollbar": {
    ...scrollBarStyles,
  },

  // Стили для ячейки в режиме редактирования
  "& .MuiDataGrid-cell--editing": {
    "& .MuiInputBase-input": {
      fontSize: "15px",
    },
  },

  // Устанавливаем font-weight для текста заголовков
  "& .MuiDataGrid-columnHeaderTitle": {
    fontSize: "16px",
    fontWeight: 700,
    userSelect: "none",
  },

  "& .MuiDataGrid-cell": {
    fontSize: "15px", // Устанавливаем размер шрифта для всех ячеек
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#0d1117", // Красит каждую ячейку заголовка
  },

  ".MuiDataGrid-filler": {
    backgroundColor: "#0d1117", // Красит оставшееся постаранство в заголовках

    // Вот тут, предположительно, хуета. Странный класс
    ".css-1tdeh38": {
      // backgroundColor: "red",
    },
  },

  "& .MuiDataGrid-row": {
    "&:hover": {
      backgroundColor: "#3187ff1a", // Фон строки при наведении
    },

    "&.Mui-selected": {
      backgroundColor: "#3d444db3",
      "&:hover": {
        backgroundColor: "#3d444db3", // Цвет при наведении на выделенную строку
      },
    },
  },
};

export const controlPanelStyles = {
  // Кастомизация окон фильтрации
  columnsPanel: {
    sx: {
      backgroundColor: "#0d1117",
      backgroundImage: "none",
      // borderRight: "1px solid #9198a1",
      // borderBottom: "1px solid #9198a1",
    },
  },
  filterPanel: {
    sx: {
      backgroundColor: "#0d1117",
      backgroundImage: "none",
      // borderRight: "1px solid #9198a1",
      // borderBottom: "1px solid #9198a1",
    },
  },
};
