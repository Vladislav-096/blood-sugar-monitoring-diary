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
import { useState } from "react";
import { v7 as uuidv4 } from "uuid";
import { fetchAddMeasurement } from "../shared/slices/measurementsSlice";
import {
  AfterMealMeasurement,
  FieldName,
  MeasurementData,
} from "../../types/types";
import { modalContentStyles } from "../../utils/modalContentStyles";

interface MeasurementModal {
  open: boolean;
  handleClose: () => void;
  // afterMealMeasurementData?: afterMealMeasurementData;
}

interface FormTypes {
  typeOfMeasurement: string;
  afterMealMeasurement: AfterMealMeasurement;
  measurement: string;
  createdAt: string;
  updatedAt: string;
}

// interface afterMealFields {
//   id: string;
//   dish: string;
//   portion: string;
// }

const testRules = {
  required: "Надо заполнить",
};

export const MeasurementModal = ({
  open,
  handleClose,
}: // afterMealMeasurementData,
MeasurementModal) => {
  const dispatch = useAppDispatch();
  const [measurementType, setMeasurementType] = useState<string>("");
  const [measurement, setMeasurement] = useState<string>("");
  const typeOfMeasurementsState = useAppSelector(
    (state) => state.typesOfMeasurements
  );
  const typesOptions = [...typeOfMeasurementsState.typesOfMeasurements];
  // const [afterMealFields, setAfterMealFields] = useState<afterMealFields[]>([]);
  // console.log("afterMealMeasurementData", afterMealMeasurementData);

  console.log("component", measurement);

  const handleTypeOfMeasurementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
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
    const fieldName = `afterMealMeasurement.meal.${index}.portion`;
    formatInputValueToNumbers(event, fieldName as FieldName);
  };

  const handleMeasurementChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = "measurement";
    formatInputValueToNumbers(event, fieldName);
  };

  const formatInputValueToNumbers = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: FieldName
  ) => {
    const { value } = event.target;
    const pettern = /[^0-9]/g;
    const numericValue = value.replace(pettern, "");

    setMeasurement(value);
    setValue(fieldName, numericValue);
    trigger(fieldName);
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
    console.log("resetValues");
    reset();
    setValue("measurement", "");
    setValue("typeOfMeasurement", "");
    setMeasurementType("");
    setMeasurement("");
    clearErrors();
    remove();
  };

  const onSubmit = (formData: FormTypes) => {
    const measurementId = uuidv4();
    const unixTimestampDate = Math.floor(new Date().getTime() / 1000);
    const measurement = Number(formData.measurement);
    const typeOfMeasurement = typesOptions.filter(
      (item) => item.name === formData.typeOfMeasurement
    );

    let data: MeasurementData = {
      id: measurementId,
      createdAt: unixTimestampDate,
      updatedAt: unixTimestampDate,
      typeOfMeasurement: typeOfMeasurement[0].id,
      measurement: measurement,
    };

    if (formData.afterMealMeasurement.meal.length > 0) {
      data = {
        ...data,
        afterMealMeasurement: {
          meal: formData.afterMealMeasurement.meal.map((item) => {
            return { portion: Number(item.portion), dish: item.dish };
          }),
        },
      };
    }

    dispatch(fetchAddMeasurement(data));
    resetValues();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        resetValues();
        handleClose();
      }}
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
                        rules={testRules}
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

            <FormControl fullWidth>
              <Controller
                name="measurement"
                control={control}
                rules={testRules}
                render={() => (
                  <TextField
                    value={measurement}
                    onChange={handleMeasurementChange}
                    label="Measurement"
                    variant="outlined"
                    error={errors.measurement ? true : false}
                    helperText={errors.measurement?.message}
                  />
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
