import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { TypesOfMeasurements } from "../../app/measurements";
import { useState } from "react";
import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { CheckoutState } from "../../types/types";
import { EditCellLoader } from "../EditCellLoader/EditCellLoader";

interface CustomSelectTypeOfMeasurement {
  typesOfMeasurements: TypesOfMeasurements;
  // dispatchEditMeasurement: (data: MeasurementData) => void;
  // row: MeasurementData;
  initialValue: string;
  params: GridRenderEditCellParams;
  editStatus: CheckoutState;
}

export const CustomSelectTypeOfMeasurement = ({
  typesOfMeasurements,
  // dispatchEditMeasurement,
  // row,
  initialValue,
  params,
  editStatus,
}: CustomSelectTypeOfMeasurement) => {
  const [chosenOption, setChosenOption] = useState<string>(initialValue);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value: newValue } = event.target;
    // const newValueId = typesOfMeasurements.filter(
    //   (item) => item.name === newValue
    // )[0].id;

    // setChosenOption(newValueId);
    setChosenOption(newValue);
    params.api.setEditCellValue(
      {
        id: params.id,
        field: params.field,
        value: newValue,
      },
      true
    ); // true означает немедленное применение изменений

    // const newRow: MeasurementData = { ...row, typeOfMeasurement: newValueId };
    // dispatchEditMeasurement(newRow);
  };

  return (
    <EditCellLoader editStatus={editStatus}>
      <Select
        value={chosenOption}
        onChange={handleChange}
        fullWidth
        sx={{
          height: "100%", // Главный контейнер
          "& .MuiOutlinedInput-root": {
            height: "100%", // Корневой элемент ввода
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // Убирает бордер
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none", // Убирает бордер при наведении
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none", // Убирает бордер при фокусе
          },

          "& .MuiSelect-icon": {
            display: editStatus === "LOADING" ? "none" : "block",
          },
        }}
      >
        {typesOfMeasurements.map((item, index) => (
          <MenuItem key={index} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </EditCellLoader>
  );
};
