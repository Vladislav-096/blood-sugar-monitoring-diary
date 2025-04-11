import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FieldName, FormTypes, MeasurementData } from "../../types/types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { fetchEditMeasurement } from "../shared/slices/measurementsSlice";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  FormHelperText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./editAfterMealMeasurementModal.module.scss";
import {
  formHelperErrorStyles,
  initialAfterMealMeasurement,
  modalContentStyles,
  selectDropdowStyles,
  textFieldStyle,
  validationRules,
} from "../../constants/constants";
import { CustomRequestErrorAlert } from "../../components/CustomRequestErrorAlert/CustomRequestErrorAlert";
import { SubmitModalButton } from "../../components/SubmitModalButton/SubmitModalButton";
import dayjs from "dayjs";
import { areObjectsEqual } from "../../utils/areObjectsEqual";

interface EditAfterMeasurementModal {
  afterMealMeasurement: MeasurementData;
  setAfterMealMeasurement: React.Dispatch<
    React.SetStateAction<MeasurementData>
  >;
  open: boolean;
  handleClose: () => void;
}

const alertEditMeasurementError = "Failed to edit measurement";

export const EditAfterMeasurementModal = ({
  open,
  handleClose,
  afterMealMeasurement,
  setAfterMealMeasurement,
}: EditAfterMeasurementModal) => {
  const dispatch = useAppDispatch();
  const editMeasurementsErrorStatus = useAppSelector(
    (state) => state.measurements.checkoutEditMeasurementState
  );
  const [isAlert, setIsAlert] = useState<boolean>(false);
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
    formatInputValueToNumbers(event, fieldName as FieldName);
  };

  const handleDishChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = event.target;
    const fieldName = `afterMealMeasurement.meal.${index}.dish`;
    setValue(fieldName as FieldName, value);
    trigger(fieldName as FieldName);
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

  const onSubmit = async (formData: FormTypes) => {
    const data: MeasurementData = {
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
    // console.log({ ...data, updatedAt: dayjs().unix() });

    const areObjectsTheSame = areObjectsEqual(afterMealMeasurement, data);

    if (areObjectsTheSame.result) {
      resetValues();
      setAfterMealMeasurement(initialAfterMealMeasurement);
      handleClose();
      return;
    }

    const res = await dispatch(
      fetchEditMeasurement({ ...data, updatedAt: dayjs().unix() })
    );

    if (!res.payload) {
      // В алерт улетит строка "ERROR", потому что произойдет ререндер. Но что вызывает ререндер,
      // если тут прерывается выполнение кода?
      return;
    }

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
    <>
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
              component="h2"
              sx={{ marginBottom: "10px", fontSize: "20px" }}
            >
              Edit measurement
            </Typography>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                fullWidth
                error={errors.typeOfMeasurement ? true : false}
              >
                <Controller
                  name="typeOfMeasurement"
                  control={control}
                  rules={validationRules.typeOfMeasurement}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      // Это, наверное тут не нужно
                      slotProps={selectDropdowStyles}
                      // helperText={errors.typeOfMeasurement?.message}
                      error={errors.typeOfMeasurement ? true : false}
                      label="Type of measurement"
                      variant="outlined"
                      disabled={true}
                      sx={textFieldStyle}
                    ></TextField>
                  )}
                />
                {/* По сути это тут не нужно */}
                {errors.typeOfMeasurement && (
                  <FormHelperText sx={formHelperErrorStyles}>
                    {errors.typeOfMeasurement?.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box sx={{ marginBottom: "10px", padding: "0 10px 0 10px" }}>
                {fields.map((item, index) => (
                  <Box key={item.id} sx={{ marginBottom: "10px" }}>
                    <FormControl
                      error={
                        errors.afterMealMeasurement?.meal?.[index]?.dish
                          ? true
                          : false
                      }
                      fullWidth
                    >
                      <Controller
                        name={`afterMealMeasurement.meal.${index}.dish`}
                        control={control}
                        rules={validationRules.mealItems.dish}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            onChange={(e) => handleDishChange(e, index)}
                            label="Dish"
                            variant="outlined"
                            error={
                              errors.afterMealMeasurement?.meal?.[index]?.dish
                                ? true
                                : false
                            }
                            // helperText={
                            //   errors.afterMealMeasurement?.meal?.[index]?.dish
                            //     ?.message
                            // }
                            sx={textFieldStyle}
                          />
                        )}
                      />
                      {errors.afterMealMeasurement?.meal?.[index]?.dish && (
                        <FormHelperText sx={formHelperErrorStyles}>
                          {
                            errors.afterMealMeasurement.meal?.[index].dish
                              .message
                          }
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl
                      error={
                        errors.afterMealMeasurement?.meal?.[index]?.portion
                          ? true
                          : false
                      }
                      fullWidth
                    >
                      <Controller
                        name={`afterMealMeasurement.meal.${index}.portion`}
                        control={control}
                        rules={validationRules.mealItems.dish}
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
                            // helperText={
                            //   errors.afterMealMeasurement?.meal?.[index]
                            //     ?.portion?.message
                            // }
                            sx={textFieldStyle}
                          />
                        )}
                      />
                      {errors.afterMealMeasurement?.meal?.[index]?.portion && (
                        <FormHelperText sx={formHelperErrorStyles}>
                          {
                            errors.afterMealMeasurement?.meal?.[index]?.portion
                              ?.message
                          }
                        </FormHelperText>
                      )}
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
              <FormControl error={errors.measurement ? true : false} fullWidth>
                <Controller
                  name="measurement"
                  control={control}
                  rules={validationRules.measurement}
                  render={() => (
                    <TextField
                      value={measurement}
                      onChange={handleMeasurementChange}
                      label="Measurement"
                      variant="outlined"
                      error={errors.measurement ? true : false}
                      // helperText={errors.measurement?.message}
                      sx={textFieldStyle}
                    />
                  )}
                />
                {errors.measurement && (
                  <FormHelperText sx={formHelperErrorStyles}>
                    {errors.measurement?.message}
                  </FormHelperText>
                )}
              </FormControl>
              <SubmitModalButton
                requestStatus={editMeasurementsErrorStatus}
                buttonName={"submit"}
              />
            </form>
          </Box>
        </Fade>
      </Modal>
      <CustomRequestErrorAlert
        title={alertEditMeasurementError}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        status={editMeasurementsErrorStatus}
      />
    </>
  );
};
