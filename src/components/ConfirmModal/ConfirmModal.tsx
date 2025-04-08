import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { CheckoutState } from "../../types/types";
import { Loader } from "../Loader/Loader";
import { useEffect, useState } from "react";
import { CustomRequestErrorAlert } from "../CustomRequestErrorAlert/CustomRequestErrorAlert";
import { modalContentStyles } from "../../constants/constants";

interface ConfirmModal {
  open: boolean;
  idToRemove: string;
  handleClose: () => void;
  confirmFn: (id: string) => void;
  title: string;
  status: CheckoutState;
}

const alertRemoveMeasurementError = "Failed to remove measurement";

export const ConfirmModal = ({
  open,
  idToRemove,
  handleClose,
  confirmFn,
  title,
  status,
}: ConfirmModal) => {
  const [isAlert, setIsAlert] = useState<boolean>(false);

  useEffect(() => {
    if (status === "READY") {
      handleClose();
    }
  }, [status]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 200,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalContentStyles}>
            <Typography component="h2">{title}</Typography>
            <Stack spacing={2} direction="row">
              <Button
                onClick={() => {
                  confirmFn(idToRemove);
                }}
                variant="contained"
                sx={{
                  position: "relative",
                  paddingRight: status === "LOADING" ? "33px" : "16px",
                }}
              >
                <Typography>yes</Typography>
                {status === "LOADING" && (
                  <Box
                    sx={{
                      position: "absolute",
                      width: "19%",
                      height: "60%",
                      right: "7px",
                    }}
                  >
                    <Loader />
                  </Box>
                )}
              </Button>
              <Button onClick={handleClose} variant="contained">
                <Typography>no</Typography>
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <CustomRequestErrorAlert
        title={alertRemoveMeasurementError}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        status={status}
      />
    </>
  );
};
