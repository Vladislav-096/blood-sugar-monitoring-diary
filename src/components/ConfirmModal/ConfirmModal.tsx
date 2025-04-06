import { Backdrop, Box, Button, Fade, Modal, Stack } from "@mui/material";
import { modalContentStyles } from "../../utils/modalContentStyles";
import { CheckoutState } from "../../types/types";
import { Loader } from "../Loader/Loader";
import { useEffect, useState } from "react";
import { CustomErrorAlert } from "../CustomErrorAlert/CustomErrorAlert";
import { CustomTypography } from "../CustomTypography/CustomTypography";

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
            <CustomTypography componentProp="h2" text={title} />
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
                <CustomTypography text="yes" />
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
                <CustomTypography text="no" />
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <CustomErrorAlert
        title={alertRemoveMeasurementError}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        status={status}
      />
    </>
  );
};
