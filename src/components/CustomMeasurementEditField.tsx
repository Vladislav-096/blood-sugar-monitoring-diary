import { TextField } from "@mui/material";
import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import { CheckoutState } from "../types/types";
import { EditCellLoader } from "./EditCellLoader/EditCellLoader";

interface CustomMeasurementEditField {
  params: GridRenderEditCellParams;
  editStatus: CheckoutState;
}

export const CustomMeasurementEditField = ({
  params,
  editStatus,
}: CustomMeasurementEditField) => {
  const [measurementValue, setMeasurementValue] = useState<number>(
    Number(params.row.measurement)
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    const pettern = /[^0-9]/g;
    const numericValue = value.replace(pettern, "");
    setMeasurementValue(Number(numericValue));

    params.api.setEditCellValue(
      {
        id: params.id,
        field: params.field,
        value: numericValue,
      },
      true
    );
  };

  return (
    <EditCellLoader editStatus={editStatus}>
      <TextField
        value={measurementValue}
        onChange={handleChange}
        autoFocus={true}
        hiddenLabel
        sx={{
          ".MuiInputBase-input": { height: "100%", paddingRight: "50px" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
    </EditCellLoader>
  );
};
