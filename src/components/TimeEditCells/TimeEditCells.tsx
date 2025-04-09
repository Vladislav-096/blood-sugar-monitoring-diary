import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { CheckoutState } from "../../types/types";
import { EditCellLoader } from "../EditCellLoader/EditCellLoader";
import { timePickerMenu } from "../../constants/constants";

interface TimeEditCells {
  initialValue: string;
  params: GridRenderEditCellParams;
  editStatus: CheckoutState;
}

export const TimeEditCells = ({
  initialValue,
  params,
  editStatus,
}: TimeEditCells) => {
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
    <EditCellLoader editStatus={editStatus}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={dayjs(convertedTime)}
          onChange={handleOnTimeChange}
          // ampm={false}
          format="HH:mm"
          slotProps={{
            textField: {
              sx: {
                height: "100%",
                ".MuiInputBase-root": { height: "100%" },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Убирает border
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Убирает border при наведении
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Убирает border при фокусе
                },
              },
            },
            ...timePickerMenu,
            openPickerButton: {
              sx: { display: editStatus === "LOADING" ? "none" : "block" },
            },
          }}
        />
      </LocalizationProvider>
    </EditCellLoader>
  );
};
