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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./measurementModal.module.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { recieveTypesOfMeasurements } from "./typesOfMeasurementsSlice";

interface MeasurementModal {
  open: boolean;
  handleClose: () => void;
}

interface Meal {
  portion: string;
  dish: string;
}

interface AfterMealMeasurement {
  meal: Meal[];
}

interface FormTypes {
  typeOfMeasurement: string;
  afterMealMeasurement?: AfterMealMeasurement;
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

  const handleTypeOfMeasurementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    console.log("value", value);
    if (!value) return;

    setMeasurementType(value);

    if (value !== "After meal") {
      remove();
    }

    const typeId = typesOptions.filter((item) => item.name === value);
    if (typeId.length > 0) {
      setValue("typeOfMeasurement", typeId[0].name);
    }
  };

  const handlePortionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = event.target;

    const pettern = /[^0-9]/g;

    const numericValue = value.replace(pettern, "");

    setValue(`afterMealMeasurement.meal.${index}.portion`, numericValue);
    trigger(`afterMealMeasurement.meal.${index}.portion`);
  };

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

  const resetValues = () => {
    reset();
    clearErrors();
    setMeasurementType("");
    remove();
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
                    helperText={errors.typeOfMeasurement?.message}
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

            {measurementType === "After meal" && (
              <Box>
                {fields.map((item, index) => (
                  <Box key={item.id}>
                    <FormControl fullWidth>
                      <Controller
                        name={`afterMealMeasurement.meal.${index}.dish`}
                        control={control}
                        rules={testRules}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Dish"
                            variant="outlined"
                            error={
                              errors.afterMealMeasurement?.meal?.[index]?.dish
                                ? true
                                : false
                            }
                            helperText={
                              errors.afterMealMeasurement?.meal?.[index]?.dish
                                ?.message
                            }
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <Controller
                        name={`afterMealMeasurement.meal.${index}.portion`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            onChange={(e) => handlePortionChange(e, index)}
                            label="Portion (grams)"
                            variant="outlined"
                            error={
                              errors.afterMealMeasurement?.meal?.[index]
                                ?.portion
                                ? true
                                : false
                            }
                            helperText={
                              errors.afterMealMeasurement?.meal?.[index]
                                ?.portion?.message
                            }
                            // type="number"
                          />
                        )}
                      />
                    </FormControl>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}

                <Button
                  variant="contained"
                  onClick={() => append({ dish: "", portion: "" })}
                >
                  Add Meal
                </Button>
              </Box>
            )}

            <Button type="submit" variant="contained">
              submit
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
