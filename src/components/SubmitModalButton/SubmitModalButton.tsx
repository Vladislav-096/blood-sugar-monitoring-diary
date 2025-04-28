import { Box, Button } from "@mui/material";
import { Loader } from "../Loader/Loader";
import { CheckoutState } from "../../types/types";
import { loaderDarkColor, loaderDefaultColor } from "../../constants/constants";

interface SubmitModalButton {
  requestStatus: CheckoutState;
  buttonName: string;
  isDisbled: boolean;
}

export const SubmitModalButton = ({
  requestStatus,
  buttonName,
  isDisbled,
}: SubmitModalButton) => {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        position: "relative",
        paddingRight:
          requestStatus === "LOADING" || isDisbled ? "33px" : "16px",
      }}
      disabled={isDisbled}
    >
      {buttonName}
      {(requestStatus === "LOADING" || isDisbled) && (
        <Box
          sx={{
            position: "absolute",
            width: "19%",
            height: "60%",
            right: "7px",
          }}
        >
          <Loader lineColor={isDisbled ? loaderDefaultColor : loaderDarkColor} />
        </Box>
      )}
    </Button>
  );
};
