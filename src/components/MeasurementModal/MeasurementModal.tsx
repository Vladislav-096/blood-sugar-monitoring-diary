import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import styles from "./measurementModal.module.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { recieveTypesOfMeasurements } from "./typesOfMeasurementsSlice";

interface MeasurementModal {
  open: boolean;
  handleClose: () => void;
}

// Сделать потом
// interface Meal {
//   portion: number;
//   dish: string;
// }

// interface AfterMealMeasurement {
//   meal: Meal[];
// }

interface FormTypes {
  typeOfMeasurement: string;
  // afterMealMeasurement?: AfterMealMeasurement; // Сделать потом
  food?: string; // Временно так
  portion: string; // Временно так
  measurement: string;
  createdAt: string;
  updatedAt: string;
}

const testRules = {
  required: "Надо заполнить",
};

const modalContentStyles = {
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

export const MeasurementModal = ({ open, handleClose }: MeasurementModal) => {
  const dispatch = useAppDispatch();
  const [measurementType, setMeasurementType] = useState<string>("");

  useEffect(() => {
    dispatch(recieveTypesOfMeasurements());
  }, [dispatch]);

  const typeOfMeasurementsState = useAppSelector(
    (state) => state.typesOfMeasurements
  );

  const typesOptions = [...typeOfMeasurementsState.typesOfMeasurements];
  console.log("typesOptions", typesOptions);

  const handleTypeOfMeasurementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    console.log("value", value);
    if (!value) return;

    setMeasurementType(value);

    const typeId = typesOptions.filter((item) => item.name === value);
    if (typeId.length > 0) {
      setValue("typeOfMeasurement", typeId[0].name);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
    trigger,
  } = useForm<FormTypes>();

  console.log("errors", errors);

  const resetValues = () => {
    reset();
    clearErrors();
    setMeasurementType("");
  };

  const onSubmit = (formData: FormTypes) => {
    console.log("formData", formData);
    resetValues();
  };

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
            Add new measurement
          </Typography>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <Controller
                name="typeOfMeasurement"
                control={control}
                rules={testRules}
                render={() => (
                  <TextField
                    select
                    error={errors.typeOfMeasurement ? true : false}
                    onChange={handleTypeOfMeasurementChange}
                    value={measurementType}
                    helperText={
                      errors.typeOfMeasurement
                        ? errors.typeOfMeasurement.message
                        : ""
                    }
                    label="Type of measurement"
                    variant="outlined"
                  >
                    {typesOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.name}
                        onClick={() => clearErrors("typeOfMeasurement")}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>

            <Button type="submit" variant="contained">
              submit
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
