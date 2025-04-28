import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { useEffect } from "react";
import { CheckoutState } from "../../types/types";

interface CustomRequestErrorAlert {
  title: string;
  isAlert: boolean;
  setIsAlert: React.Dispatch<React.SetStateAction<boolean>>;
  status: CheckoutState;
}

export const CustomRequestErrorAlert = ({
  title,
  isAlert,
  setIsAlert,
  status,
}: CustomRequestErrorAlert) => {
  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsAlert(false);
  };

  useEffect(() => {
    if (status === "ERROR") {
      setIsAlert(true);
    }
  }, [status]);

  return (
    <>
      <Snackbar
        open={isAlert}
        autoHideDuration={2500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert variant="filled" severity="error">
          {title}
        </Alert>
      </Snackbar>
    </>
  );
};
