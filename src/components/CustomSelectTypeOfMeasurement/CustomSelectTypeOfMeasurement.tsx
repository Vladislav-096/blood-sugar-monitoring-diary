import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { TypesOfMeasurements } from "../../app/measurements";
import { useState } from "react";
import { GridRenderEditCellParams } from "@mui/x-data-grid";

interface CustomSelectTypeOfMeasurement {
  typesOfMeasurements: TypesOfMeasurements;
  // dispatchEditMeasurement: (data: MeasurementData) => void;
  // row: MeasurementData;
  initialValue: string;
  params: GridRenderEditCellParams;
}

export const CustomSelectTypeOfMeasurement = ({
  typesOfMeasurements,
  // dispatchEditMeasurement,
  // row,
  initialValue,
  params,
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
    <Select value={chosenOption} onChange={handleChange} fullWidth>
      {typesOfMeasurements.map((item, index) => (
        <MenuItem key={index} value={item.id}>
          {item.name}
        </MenuItem>
      ))}
    </Select>
  );
};
