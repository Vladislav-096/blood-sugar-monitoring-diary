import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";

interface CustomErrorAlert {
  title: string;
  isAlert: boolean;
  setIsAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomErrorAlert = ({
  title,
  isAlert,
  setIsAlert,
}: CustomErrorAlert) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsAlert(false);
  };

  return (
    <>
      <Snackbar
        open={isAlert}
        autoHideDuration={3500}
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
