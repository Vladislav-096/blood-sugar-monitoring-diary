import { TextField } from "@mui/material";
import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";

interface CustomDatePicker {
  initialValue: string;
  params: GridRenderEditCellParams;
}

export const CustomDatePicker = ({
  initialValue,
  params,
}: CustomDatePicker) => {
  const [date, setDate] = useState<string>(initialValue); // YYYY-MM-DD
  console.log("date", date);

  const handleOnDateChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      const newDate = newValue.unix();
      console.log("newDate", newDate);
      setDate(newValue.format("YYYY-MM-DD"));
      params.api.setEditCellValue(
        {
          id: params.id,
          field: params.field,
          // В ячейку сабмичу таймстемп
          value: newDate,
        },
        true
      ); // true означает немедленное применение изменений
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date"
        value={dayjs(date)}
        onChange={handleOnDateChange}
        format="DD.MM.YYYY"
        slots={{ textField: TextField }}
      />
    </LocalizationProvider>
  );
};
