import {
  Backdrop,
  Box,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import styles from "./measurementModal.module.scss";

interface MeasurementModal {
  open: boolean;
  handleClose: () => void;
}

interface FormTypes {
  typeOfMeasurement: string;
  food?: string;
  measurement: string;
  createdAt: string;
  updatedAt: string;
}

const testRules = {
  required: "Надо заполнить",
};

export const MeasurementModal = ({ open, handleClose }: MeasurementModal) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 444,
    bgcolor: "#151b23",
    padding: "15px",
    borderRadius: "5px",
    textAlign: "center",
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<FormTypes>({
    defaultValues: {
      typeOfMeasurement: "", // Задаем начальное значение для поля
      food: "", // Если это поле тоже существует в форме
      measurement: "",
      createdAt: "",
      updatedAt: "",
    },
  });

  const resetValues = () => {
    reset();
    clearErrors();
  };

  const onSubmit = (formData: FormTypes) => {
    console.log("formData", formData);
    resetValues();
  };

  //   <TextField
  // id="outlined-select-currency"
  // select
  // label="Select"
  // defaultValue="EUR"
  // helperText="Please select your currency"
  // >
  // {currencies.map((option) => (
  //   <MenuItem key={option.value} value={option.value}>
  //     {option.label}
  //   </MenuItem>
  // ))}
  // </TextField>

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
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontFamily: '"Play"', color: "#f0f6fc" }}
          >
            Text in a modal
          </Typography>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="typeOfMeasurement"
              control={control}
              rules={testRules}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  error={errors.typeOfMeasurement ? true : false}
                  helperText={
                    errors.typeOfMeasurement
                      ? errors.typeOfMeasurement.message
                      : ""
                  }
                  label="Type of measurement"
                  variant="outlined"
                />
              )}
            />
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
