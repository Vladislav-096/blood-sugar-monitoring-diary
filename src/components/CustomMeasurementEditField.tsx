import { Box, TextField } from "@mui/material";
import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import { CheckoutState } from "../types/types";
import { Loader } from "./Loader/Loader";

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
    <Box
      sx={{
        paddingLeft: "25px",
        position: "relative",
      }}
    >
      <TextField
        value={measurementValue}
        onChange={handleChange}
        autoFocus={true}
        hiddenLabel
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
      {editStatus === "LOADING" && (
        <Box
          sx={{
            position: "absolute",
            width: "25px",
            height: "25px",
            left: "5px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <Loader lineColor="#000" />
        </Box>
      )}
    </Box>
  );
};
