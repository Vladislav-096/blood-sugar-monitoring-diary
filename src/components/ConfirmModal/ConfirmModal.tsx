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

interface ConfirmModal {
  open: boolean;
  idToRemove: string;
  handleClose: () => void;
  confirmFn: (id: string) => void;
  title: string;
}

export const ConfirmModal = ({
  open,
  idToRemove,
  handleClose,
  confirmFn,
  title,
}: ConfirmModal) => {
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
                handleClose();
              }}
              variant="contained"
            >
              Yes
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
