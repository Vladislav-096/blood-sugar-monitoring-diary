import { Backdrop, Box, Fade, Modal, Typography } from "@mui/material";
import { AfterMealMeasurement, EditMeasurement } from "../../types/types";
import { modalContentStyles } from "../../utils/modalContentStyles";
import { useFieldArray, useForm } from "react-hook-form";

interface EditAfterMealMeasurementModal {
  openEditAfterMealMeasurementModal: boolean;
  handleCloseEditAfterMealMeasurementModal: () => void;
  editAfterMealMeasurementId: string;
  dispatchEditMeasurement: (data: EditMeasurement) => void;
}

interface FormTypes {
  afterMealMeasurement: AfterMealMeasurement;
  measurement: string;
}

export const EditAfterMealMeasurementModal = ({
  openEditAfterMealMeasurementModal,
  handleCloseEditAfterMealMeasurementModal,
  editAfterMealMeasurementId,
  dispatchEditMeasurement,
}: EditAfterMealMeasurementModal) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm<FormTypes>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "afterMealMeasurement.meal",
  });

  const onSubmit = (formData: FormTypes) => {
    const data = {
      id: editAfterMealMeasurementId,
      data: {
        measurement: formData.measurement,
        ...(formData.afterMealMeasurement && {
          afterMealMeasurement: formData.afterMealMeasurement,
        }),
      },
    };
  };

  return (
    <Modal
      open={openEditAfterMealMeasurementModal}
      onClose={handleCloseEditAfterMealMeasurementModal}
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
      <Fade in={openEditAfterMealMeasurementModal}>
        <Box sx={modalContentStyles}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontFamily: '"Play"', color: "#f0f6fc" }}
          >
            Edit food notes
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}></form>
        </Box>
      </Fade>
    </Modal>
  );
};
