import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { TypesOfMeasurements } from "../../app/measurements";
import { useState } from "react";

interface CustomSelectTypeOfMeasurement {
  typesOfMeasurements: TypesOfMeasurements;
  // dispatchEditMeasurement: (data: MeasurementData) => void;
  // row: MeasurementData;
  initialValue: string;
}

export const CustomSelectTypeOfMeasurement = ({
  typesOfMeasurements,
  // dispatchEditMeasurement,
  // row,
  initialValue,
}: CustomSelectTypeOfMeasurement) => {
  const [chosenOption, setChosenOption] = useState<string>(initialValue);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value: newValue } = event.target;
    // const newValueId = typesOfMeasurements.filter(
    //   (item) => item.name === newValue
    // )[0].id;

    // setChosenOption(newValueId);
    setChosenOption(newValue);
    // const newRow: MeasurementData = { ...row, typeOfMeasurement: newValueId };
    // dispatchEditMeasurement(newRow);
  };

  return (
    <Select value={chosenOption} onChange={handleChange} fullWidth>
      {typesOfMeasurements.map((item, index) => (
        <MenuItem key={index} value={item.name}>
          {item.name}
        </MenuItem>
      ))}
    </Select>
  );
};
