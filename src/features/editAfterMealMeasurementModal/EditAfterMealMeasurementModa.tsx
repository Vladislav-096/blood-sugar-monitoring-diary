import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { FieldName, FormTypes, MeasurementData } from "../../types/types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { fetchEditMeasurement } from "../shared/slices/measurementsSlice";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { modalContentStyles } from "../../utils/modalContentStyles";
import styles from "./editAfterMealMeasurementModal.module.scss";
import { initialAfterMealMeasurement } from "../../constants/constants";

interface EditAfterMeasurementModal {
  afterMealMeasurement: MeasurementData;
  setAfterMealMeasurement: React.Dispatch<
    React.SetStateAction<MeasurementData>
  >;
  open: boolean;
  handleClose: () => void;
}

const testRules = {
  required: "Надо заполнить",
};

export const EditAfterMeasurementModal = ({
  open,
  handleClose,
  afterMealMeasurement,
  setAfterMealMeasurement,
}: EditAfterMeasurementModal) => {
  const dispatch = useAppDispatch();
  const [measurement, setMeasurement] = useState<string>(" "); // Чтобы визуально не съебывал лэйбл при открытии модалки. Оставлю?

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

    if (fieldName === "measurement") {
      setMeasurement(numericValue);
    }

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
    reset();
    setValue("measurement", "");
    setMeasurement(" ");
    clearErrors();
    remove();
  };

  const onSubmit = (formData: FormTypes) => {
    const data = {
      id: afterMealMeasurement.id,
      createdAt: afterMealMeasurement.createdAt,
      updatedAt: afterMealMeasurement.updatedAt,
      typeOfMeasurement: afterMealMeasurement.typeOfMeasurement,
      measurement: Number(formData.measurement),
      ...(formData.afterMealMeasurement.meal.length > 0 && {
        afterMealMeasurement: {
          meal: formData.afterMealMeasurement.meal.map((item) => {
            return { portion: Number(item.portion), dish: item.dish };
          }),
        },
      }),
    };

    console.log("data1", data);

    dispatch(fetchEditMeasurement(data));
    resetValues();
    handleClose();
  };

  useEffect(() => {
    if (afterMealMeasurement.id) {
      const measurement =
        afterMealMeasurement.measurement.toString() as FieldName;
      setValue("measurement", measurement);
      setValue("typeOfMeasurement", "After meal");
      setMeasurement(measurement);

      afterMealMeasurement.afterMealMeasurement?.meal.forEach((item) => {
        append({
          portion: item.portion.toString(),
          dish: item.dish,
        });
      });
    }
    //  else {
    //   resetValues();
    // }
  }, [afterMealMeasurement]);

  return (
    <Modal
      open={open}
      onClose={() => {
        resetValues();
        setAfterMealMeasurement(initialAfterMealMeasurement);
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
            Edit measurement
          </Typography>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <Controller
                name="typeOfMeasurement"
                control={control}
                rules={testRules}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={errors.typeOfMeasurement ? true : false}
                    helperText={errors.typeOfMeasurement?.message}
                    label="Type of measurement"
                    variant="outlined"
                    disabled={true}
                  ></TextField>
                )}
              />
            </FormControl>
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
                            errors.afterMealMeasurement?.meal?.[index]?.portion
                              ? true
                              : false
                          }
                          helperText={
                            errors.afterMealMeasurement?.meal?.[index]?.portion
                              ?.message
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
