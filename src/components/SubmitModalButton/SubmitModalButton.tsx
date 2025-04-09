import { Box, Button } from "@mui/material";
import { Loader } from "../Loader/Loader";
import { CheckoutState } from "../../types/types";

interface SubmitModalButton {
  requestStatus: CheckoutState;
  buttonName: string;
}

export const SubmitModalButton = ({
  requestStatus,
  buttonName,
}: SubmitModalButton) => {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        position: "relative",
        paddingRight: requestStatus === "LOADING" ? "33px" : "16px",
      }}
    >
      {buttonName}
      {requestStatus === "LOADING" && (
        <Box
          sx={{
            position: "absolute",
            width: "19%",
            height: "60%",
            right: "7px",
          }}
        >
          <Loader lineColor = "#010409"/>
        </Box>
      )}
    </Button>
  );
};
