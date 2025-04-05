import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { modalContentStyles } from "../../utils/modalContentStyles";
import { CheckoutState } from "../../types/types";
import { Loader } from "../Loader/Loader";
import { useEffect } from "react";

interface ConfirmModal {
  open: boolean;
  idToRemove: string;
  handleClose: () => void;
  confirmFn: (id: string) => void;
  title: string;
  status: CheckoutState;
}

export const ConfirmModal = ({
  open,
  idToRemove,
  handleClose,
  confirmFn,
  title,
  status,
}: ConfirmModal) => {
  useEffect(() => {
    if (status === "READY") {
      handleClose();
    }
  }, [status]);

  return (
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
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontFamily: '"Play"', color: "#f0f6fc" }}
          >
            {title}
          </Typography>
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
              No
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};
