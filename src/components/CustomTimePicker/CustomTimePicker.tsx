import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";

interface CustomTimePicker {
  initialValue: string;
  params: GridRenderEditCellParams;
}

export const CustomTimePicker = ({
  initialValue,
  params,
}: CustomTimePicker) => {
  const [convertedTime, setConvertedTime] = useState<string>(initialValue); // YYYY-MM-DDTHH:mm

  const handleOnTimeChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      const newTime = newValue.format("HH:mm");
      console.log("newTime", newTime);
      setConvertedTime(newValue.format("YYYY-MM-DDTHH:mm"));
      params.api.setEditCellValue(
        {
          id: params.id,
          field: params.field,
          value: newTime,
        },
        true
      ); // true означает немедленное применение изменений
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="Time"
        value={dayjs(convertedTime)}
        onChange={handleOnTimeChange}
        // ampm={false}
        format="HH:mm"
      />
    </LocalizationProvider>
  );
};
