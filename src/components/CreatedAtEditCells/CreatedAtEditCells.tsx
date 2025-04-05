import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { CheckoutState } from "../../types/types";
import { EditCellLoader } from "../EditCellLoader/EditCellLoader";

interface CreatedAtEditCells {
  initialValue: string;
  params: GridRenderEditCellParams;
  editStatus: CheckoutState;
}

export const CreatedAtEditCells = ({
  initialValue,
  params,
  editStatus,
}: CreatedAtEditCells) => {
  const [date, setDate] = useState<string>(initialValue); // YYYY-MM-DD

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
    <EditCellLoader editStatus={editStatus}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={dayjs(date)}
          onChange={handleOnDateChange}
          format="DD.MM.YYYY"
          // slots={{ textField: TextField }}
          slotProps={{
            textField: {
              sx: {
                height: "100%",
                ".MuiInputBase-root": { height: "100%" },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Убирает бордер
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Убирает бордер при наведении
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none", // Убирает бордер при фокусе
                },
              },
            },
            openPickerButton: {
              sx: { display: editStatus === "LOADING" ? "none" : "block" },
            },
          }}
        />
      </LocalizationProvider>
    </EditCellLoader>
  );
};
