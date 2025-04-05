import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Loader } from "../Loader/Loader";
import { CheckoutState } from "../../types/types";

interface EditCellLoader {
  children: ReactNode;
  editStatus: CheckoutState;
}

export const EditCellLoader = ({ children, editStatus }: EditCellLoader) => {
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      {children}
      {editStatus === "LOADING" && (
        <Box
          sx={{
            position: "absolute",
            width: "25px",
            height: "25px",
            right: "5px",
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
