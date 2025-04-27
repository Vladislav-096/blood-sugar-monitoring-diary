import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  FieldNameEditMeasurementForm,
  FormTypesEditMeasurement,
} from "../../types/types";
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
import {
  formHelperErrorStyles,
  initialAfterMealMeasurement,
  modalContentStyles,
  modalInnerContentStyles,
  scrollBarStyles,
  selectDropdowStyles,
  textFieldStyle,
  validationRules,
} from "../../constants/constants";
import { CustomRequestErrorAlert } from "../../components/CustomRequestErrorAlert/CustomRequestErrorAlert";
import { SubmitModalButton } from "../../components/SubmitModalButton/SubmitModalButton";
import dayjs from "dayjs";
import { Measurement } from "../../app/measurements";
import { HtmlTooltip } from "../../components/HtmlTooltip/HtmlTooltip";
import styles from "./editAfterMealMeasurementModal.module.scss";
import InfoIcon from "@mui/icons-material/Info";
import { Loader } from "../../components/Loader/Loader";
import { areMeasurementsEqual } from "../../utils/areMeasurementsEqual";
import { useMeasurementsModal } from "../../hooks/useMeasurementsModals";

interface EditAfterMeasurementModal {
  afterMealMeasurement: Measurement;
  setAfterMealMeasurement: React.Dispatch<React.SetStateAction<Measurement>>;
  open: boolean;
  handleClose: () => void;
}

const alertEditMeasurementError = "Failed to edit measurement";
const measurementAndPortionMaxLength = 5;
const dishNameLegth = 100;

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
  const [measurement, setMeasurement] = useState<string>(" "); // Чтобы визуально не уезжал лэйбл при открытии модалки. Оставлю?

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm<FormTypesEditMeasurement>();

  const {
    handleDishChange,
    handlePortionChange,
    handleMeasurementChange,
    dishStatistic,
    setDishStatistic,
    isAnyLoading,
    abortControllersRef,
    loadingStates,
    setLoadingStates,
  } = useMeasurementsModal<FormTypesEditMeasurement>({ setValue, trigger });

  console.log(dishStatistic);

  const handleDishAndPortionFocus = (index: number) => {
    setValue(
      `afterMealMeasurement.meal.${index}.id` as FieldNameEditMeasurementForm,
      index
    );
  };

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

  const onSubmit = async (formData: FormTypesEditMeasurement) => {
    const data: Measurement = {
      id: afterMealMeasurement.id,
      createdAt: afterMealMeasurement.createdAt,
      updatedAt: afterMealMeasurement.updatedAt,
      typeOfMeasurement: afterMealMeasurement.typeOfMeasurement,
      measurement: Number(formData.measurement),
      ...(formData.afterMealMeasurement.meal.length > 0 && {
        afterMealMeasurement: {
          meal: formData.afterMealMeasurement.meal.map((item) => {
            const statistic = dishStatistic.find((el) => el.id === item.id);
            return {
              id: Number(item.id), // Сомнения,
              portion: Number(item.portion),
              dish: item.dish,
              ...(statistic && { statistic }),
            };
          }),
        },
      }),
    };

    const areObjectsTheSame = areMeasurementsEqual(afterMealMeasurement, data);

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
      return;
    }

    resetValues();
    handleClose();
  };

  const handleRemoveMeal = (index: number) => {
    // Отменяем текущий запрос
    if (abortControllersRef.current[index]) {
      abortControllersRef.current[index].abort();
    }

    remove(index);

    setDishStatistic((prev) => {
      // Удаляем нужный индекс
      const filtered = prev.filter((item) => item.id !== index);

      // Сдвигаем все id после удалённого вниз на 1
      const updated = filtered.map((item) => {
        if (item.id > index) {
          return { ...item, id: item.id - 1 };
        }
        return item;
      });

      return updated;
    });

    setLoadingStates((prev) => {
      const newStates: Record<number, boolean> = {};

      for (const key in prev) {
        const keyNum = Number(key);

        if (keyNum < index) {
          newStates[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          newStates[keyNum - 1] = prev[keyNum];
        }
        // keyNum === index → не добавляем
      }

      return newStates;
    });
  };

  useEffect(() => {
    if (afterMealMeasurement.id) {
      console.log("here");
      const measurement =
        afterMealMeasurement.measurement.toString() as FieldNameEditMeasurementForm;
      setValue("measurement", measurement);
      setValue("typeOfMeasurement", "After meal");
      setMeasurement(measurement);

      afterMealMeasurement.afterMealMeasurement?.meal.forEach((item) => {
        const statistic = item.statistic;
        if (statistic) {
          setDishStatistic((prev) => [
            ...prev,
            {
              id: statistic.id,
              calories: statistic.calories,
              proteins: statistic.proteins,
              fats: statistic.fats,
              carbohydrates: statistic.carbohydrates,
              comment: statistic.comment,
            },
          ]);
        }

        append({
          id: item.id,
          portion: item.portion.toString(),
          dish: item.dish,
        });
      });
    }
  }, [afterMealMeasurement]);

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          resetValues();
          setAfterMealMeasurement(initialAfterMealMeasurement);
          handleClose();
          setDishStatistic([]);
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
            <Box sx={modalInnerContentStyles}>
              <Typography
                component="h2"
                sx={{ marginBottom: "10px", fontSize: "20px" }}
              >
                Edit measurement
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
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
                        slotProps={selectDropdowStyles}
                        error={errors.typeOfMeasurement ? true : false}
                        label="Type of measurement"
                        variant="outlined"
                        disabled={true}
                        sx={textFieldStyle}
                      ></TextField>
                    )}
                  />
                  {errors.typeOfMeasurement && (
                    <FormHelperText sx={formHelperErrorStyles}>
                      {errors.typeOfMeasurement?.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <Box sx={{ marginBottom: "10px", padding: "0 10px 0 10px" }}>
                  {fields.map((item, index) => (
                    <Box key={item.id} sx={{ marginBottom: "10px" }}>
                      <FormControl sx={{ display: "none" }}>
                        <Controller
                          name={`afterMealMeasurement.meal.${index}.id`}
                          control={control}
                          render={() => <TextField />}
                        />
                      </FormControl>
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
                              onFocus={() => handleDishAndPortionFocus(index)}
                              label="Dish"
                              variant="outlined"
                              error={
                                errors.afterMealMeasurement?.meal?.[index]?.dish
                                  ? true
                                  : false
                              }
                              slotProps={{
                                input: {
                                  inputProps: {
                                    maxLength: dishNameLegth,
                                  },
                                },
                              }}
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
                        {loadingStates[index] && (
                          <Box
                            sx={{
                              position: "absolute",
                              width: "10%",
                              height: "40%",
                              top: "50%",
                              transform: errors.afterMealMeasurement?.meal?.[
                                index
                              ]?.dish
                                ? "translateY(-30px)"
                                : "translateY(-22px)",
                              right: "14px",
                            }}
                          >
                            <Loader />
                          </Box>
                        )}
                        {dishStatistic.some((stat) => stat.id === index) && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              transform: errors.afterMealMeasurement?.meal?.[
                                index
                              ]?.dish
                                ? "translateY(-28px)"
                                : "translateY(-20px)",
                              right: "14px",
                            }}
                          >
                            <HtmlTooltip
                              title={
                                <Box
                                  sx={scrollBarStyles}
                                  className={`${styles.list} list-reset`}
                                >
                                  {dishStatistic.map((statisticItem, _) => {
                                    if (statisticItem.id === index) {
                                      return Object.entries(statisticItem).map(
                                        ([key, value], fieldIndex) =>
                                          key !== "id" && (
                                            <Box
                                              key={fieldIndex}
                                              className={styles["list-item"]}
                                            >
                                              <span className={styles.descr}>
                                                {`${key}:`}
                                              </span>
                                              <span className={styles.value}>
                                                {`${value} ${
                                                  ![
                                                    "comment",
                                                    "calories",
                                                    "id",
                                                  ].includes(key)
                                                    ? "g"
                                                    : ""
                                                }`}
                                              </span>
                                            </Box>
                                          )
                                      );
                                    }
                                  })}
                                </Box>
                              }
                            >
                              <InfoIcon />
                            </HtmlTooltip>
                          </Box>
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
                              onFocus={() => handleDishAndPortionFocus(index)}
                              label="Portion (grams)"
                              variant="outlined"
                              error={
                                errors.afterMealMeasurement?.meal?.[index]
                                  ?.portion
                                  ? true
                                  : false
                              }
                              slotProps={{
                                input: {
                                  inputProps: {
                                    maxLength: measurementAndPortionMaxLength,
                                  },
                                },
                              }}
                              sx={textFieldStyle}
                            />
                          )}
                        />
                        {errors.afterMealMeasurement?.meal?.[index]
                          ?.portion && (
                          <FormHelperText sx={formHelperErrorStyles}>
                            {
                              errors.afterMealMeasurement?.meal?.[index]
                                ?.portion?.message
                            }
                          </FormHelperText>
                        )}
                      </FormControl>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveMeal(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    onClick={() => append({ id: null, dish: "", portion: "" })}
                  >
                    Add Meal
                  </Button>
                </Box>
                <FormControl
                  error={errors.measurement ? true : false}
                  fullWidth
                >
                  <Controller
                    name="measurement"
                    control={control}
                    rules={validationRules.measurement}
                    render={() => (
                      <TextField
                        value={measurement}
                        onChange={(e) => handleMeasurementChange(e, setMeasurement)}
                        label="Measurement"
                        variant="outlined"
                        error={errors.measurement ? true : false}
                        slotProps={{
                          input: {
                            inputProps: {
                              maxLength: measurementAndPortionMaxLength,
                            },
                          },
                        }}
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
                  isDisbled={isAnyLoading}
                />
              </form>
            </Box>
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
