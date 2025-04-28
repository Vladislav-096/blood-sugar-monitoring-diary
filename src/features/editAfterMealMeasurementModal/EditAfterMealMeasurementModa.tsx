import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  FieldNameEditMeasurementForm,
  FormTypesEditMeasurement,
} from "../../types/types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { fetchEditMeasurement } from "../shared/slices/measurementsSlice";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import {
  formHelperErrorStyles,
  initialAfterMealMeasurement,
  scrollBarStyles,
  selectDropdowStyles,
  textFieldStyle,
  validationRules,
} from "../../constants/constants";
import dayjs from "dayjs";
import { Measurement } from "../../app/measurements";
import { HtmlTooltip } from "../../components/HtmlTooltip/HtmlTooltip";
import styles from "./editAfterMealMeasurementModal.module.scss";
import InfoIcon from "@mui/icons-material/Info";
import { Loader } from "../../components/Loader/Loader";
import { areMeasurementsEqual } from "../../utils/areMeasurementsEqual";
import { useMeasurementsModal } from "../../hooks/useMeasurementsModals";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";

interface EditAfterMeasurementModal {
  afterMealMeasurement: Measurement;
  setAfterMealMeasurement: React.Dispatch<React.SetStateAction<Measurement>>;
  open: boolean;
  handleClose: () => void;
}

const modalTitle = "Edit measurement";
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
  const editMeasurementsStatus = useAppSelector(
    (state) => state.measurements.checkoutEditMeasurementState
  );
  const [isAlert, setIsAlert] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm<FormTypesEditMeasurement>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "afterMealMeasurement.meal",
  });

  const {
    handleDishChange,
    handlePortionChange,
    handleMeasurementChange,
    handleDishAndPortionFocus,
    handleRemoveMeal,
    measurement,
    resetMeasurement,
    dishStatistic,
    setDishStatistic,
    isAnyLoading,
    // abortControllersRef,
    loadingStates,
    // setLoadingStates,
  } = useMeasurementsModal<FormTypesEditMeasurement>({
    setValue,
    trigger,
    initialMeasurement: " ", // Чтобы визуально не уезжал лэйбл при открытии модалки
  });

  console.log(dishStatistic);

  const resetValues = () => {
    reset();
    setValue("measurement", "");
    resetMeasurement(" ");
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

  const onClose = () => {
    resetValues();
    setAfterMealMeasurement(initialAfterMealMeasurement);
    handleClose();
    setDishStatistic([]);
  };

  useEffect(() => {
    if (afterMealMeasurement.id) {
      console.log("here");
      const measurementValue =
        afterMealMeasurement.measurement.toString() as FieldNameEditMeasurementForm;
      setValue("measurement", measurementValue);
      setValue("typeOfMeasurement", "After meal");
      resetMeasurement(measurementValue);

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
      <MeasurementModal<FormTypesEditMeasurement>
        open={open}
        onClose={onClose}
        title={modalTitle}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        control={control}
        handleMeasurementChange={handleMeasurementChange}
        measurement={measurement}
        alertMeasurementError={alertEditMeasurementError}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        measurementStatus={editMeasurementsStatus}
        isAnyLoading={isAnyLoading}
      >
        <FormControl fullWidth error={errors.typeOfMeasurement ? true : false}>
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
                    {errors.afterMealMeasurement.meal?.[index].dish.message}
                  </FormHelperText>
                )}
                {loadingStates[index] && (
                  <Box
                    sx={{
                      position: "absolute",
                      width: "10%",
                      height: "40%",
                      top: "50%",
                      transform: errors.afterMealMeasurement?.meal?.[index]
                        ?.dish
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
                      transform: errors.afterMealMeasurement?.meal?.[index]
                        ?.dish
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
                        errors.afterMealMeasurement?.meal?.[index]?.portion
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
                onClick={() => handleRemoveMeal(index, remove)}
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
      </MeasurementModal>
    </>
  );
};
