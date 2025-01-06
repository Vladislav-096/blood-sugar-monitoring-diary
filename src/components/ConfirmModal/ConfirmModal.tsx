import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";

interface ConfirmModal {
  open: boolean;
  idToRemove: string;
  handleClose: () => void;
  dispatchRemoveMeasurement: (id: string) => void;
  title: string;
}

const modalContentStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "#151b23",
  padding: "15px",
  borderRadius: "5px",
  textAlign: "center",
};

export const ConfirmModal = ({
  open,
  idToRemove,
  handleClose,
  dispatchRemoveMeasurement,
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
                dispatchRemoveMeasurement(idToRemove);
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
