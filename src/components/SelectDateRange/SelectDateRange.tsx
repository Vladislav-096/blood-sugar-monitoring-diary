import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import {
  dataPisckerCalendar,
  formHelperErrorStyles,
  textFieldStyle,
  validationRules,
} from "../../constants/constants";
import { DateRangeChart, DateRangeTableRow } from "../../types/types";
import {
  getDateStringFromUnix,
  getTimeStringFromUnix,
} from "../../utils/getDateTimeStringFromUnix";
import { useEffect, useState } from "react";
import { CustomErrorAlert } from "../CustomErrorAlert/CustomErrorAlert";

interface SelectDateRange {
  initialMinDate: string;
  initialMaxDate: string;
  setInitialValues: () => void;
  dateStart: string;
  dateEnd: string;
  tableDateRange: DateRangeTableRow[];
  // dateRangeChart: DateRangeChart[];
  setDateStart: React.Dispatch<React.SetStateAction<string>>;
  setDateEnd: React.Dispatch<React.SetStateAction<string>>;
  setTableDateRange: React.Dispatch<React.SetStateAction<DateRangeTableRow[]>>;
  setChartDateRange: React.Dispatch<React.SetStateAction<DateRangeChart[]>>;
}

interface FormTypes {
  dateStart: number;
  dateEnd: number;
}

const alertTitle = "The second date should be greater than the first date";

const setTheEndOfTheDay = (timestamp: number) => {
  return dayjs.unix(timestamp).hour(23).minute(59).second(59).unix();
};

const areDatesValid = (dateStart: number, dateEnd: number) => {
  if (dateEnd <= dateStart) {
    return false;
  }

  return true;
};

export const SelectDateRange = ({
  initialMinDate,
  initialMaxDate,
  setInitialValues,
  dateStart,
  dateEnd,
  setDateStart,
  setDateEnd,
  setTableDateRange,
  setChartDateRange,
  tableDateRange,
}: SelectDateRange) => {
  const [isAlert, setIsAlert] = useState<boolean>(false);

  const handleDateStartChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      const newDate = newValue.unix();
      if (!areDatesValid(newDate, dayjs(dateEnd).unix())) {
        setIsAlert(true);
        return;
      }
      console.log("or here");
      setDateStart(newValue.format("YYYY-MM-DD"));
      setValue("dateStart", newDate);
    }

    trigger("dateStart");
  };

  const handleDateEndChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      const newDate = newValue.unix();
      if (!areDatesValid(dayjs(dateStart).unix(), newDate)) {
        setIsAlert(true);
        return;
      }

      console.log("or here");
      setDateEnd(newValue.format("YYYY-MM-DD"));
      setValue("dateEnd", newDate);
    }

    trigger("dateEnd");
  };

  const handleReset = () => {
    setInitialValues();
    reset(); // Сброс формы react-hook-form
    clearErrors(); // Очистка ошибок валидации
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm<FormTypes>();

  const onSubmit = (formData: FormTypes) => {
    const newDateRangeTable = [...tableDateRange].filter(
      (item) =>
        item.date >= formData.dateStart &&
        item.date <= setTheEndOfTheDay(formData.dateEnd)
    );

    const newDateRangeChart = [...newDateRangeTable].map((item) => {
      return {
        x: `${getDateStringFromUnix(item.date)}, ${getTimeStringFromUnix(
          item.date
        )}`,
        y: item.measurement,
      };
    });

    setTableDateRange(newDateRangeTable);
    setChartDateRange(newDateRangeChart);

    clearErrors();
  };

  useEffect(() => {
    setValue("dateStart", dayjs(dateStart).unix());
    setValue("dateEnd", dayjs(dateEnd).unix());
  }, [setValue, dateStart, dateEnd]);

  return (
    <Box>
      <Typography
        component="h2"
        sx={{ marginBottom: "10px", fontSize: "20px" }}
      >
        Select date range
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl error={errors.dateStart ? true : false} fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="dateStart"
              control={control}
              rules={validationRules.createdAt}
              render={() => (
                <DatePicker
                  label="Date Start"
                  value={dayjs(dateStart)}
                  onChange={handleDateStartChange}
                  format="DD.MM.YYYY"
                  slots={{ textField: TextField }}
                  minDate={dayjs(initialMinDate)}
                  maxDate={dayjs(initialMaxDate)}
                  slotProps={{
                    textField: {
                      error: errors.dateStart ? true : false,
                    },
                    ...dataPisckerCalendar,
                  }}
                  sx={textFieldStyle}
                />
              )}
            />
          </LocalizationProvider>
          {errors.dateStart && (
            <FormHelperText sx={formHelperErrorStyles}>
              {" "}
              {errors.dateStart.message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl error={errors.dateEnd ? true : false} fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="dateEnd"
              control={control}
              rules={validationRules.createdAt}
              render={() => (
                <DatePicker
                  label="Date End"
                  value={dayjs(dateEnd)}
                  onChange={handleDateEndChange}
                  format="DD.MM.YYYY"
                  slots={{ textField: TextField }}
                  minDate={dayjs(initialMinDate)}
                  maxDate={dayjs(initialMaxDate)}
                  slotProps={{
                    textField: {
                      error: errors.dateEnd ? true : false,
                    },
                    ...dataPisckerCalendar,
                  }}
                  sx={textFieldStyle}
                />
              )}
            />
          </LocalizationProvider>
          {errors.dateEnd && (
            <FormHelperText sx={formHelperErrorStyles}>
              {" "}
              {errors.dateEnd.message}
            </FormHelperText>
          )}
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="submit">Submit</Button>
          <Button onClick={handleReset} type="button">
            Reset filter
          </Button>
        </Box>
      </form>
      <CustomErrorAlert
        title={alertTitle}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
      />
    </Box>
  );
};
