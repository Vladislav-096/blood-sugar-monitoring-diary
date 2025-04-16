import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { CheckoutState } from "../../types/types";
import { EditCellLoader } from "../EditCellLoader/EditCellLoader";
import { dataPisckerCalendar } from "../../constants/constants";

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
          slotProps={{
            textField: {
              sx: {
                height: "100%",
                ".MuiInputBase-root": { height: "100%" },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            },
            ...dataPisckerCalendar,
            openPickerButton: {
              sx: { display: editStatus === "LOADING" ? "none" : "block" },
            },
          }}
        />
      </LocalizationProvider>
    </EditCellLoader>
  );
};
