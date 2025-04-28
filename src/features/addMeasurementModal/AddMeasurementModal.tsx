import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./addMeasurementModal.module.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { v7 as uuidv4 } from "uuid";
import { fetchAddMeasurement } from "../shared/slices/measurementsSlice";
import { FormTypesCreateMeasurement } from "../../types/types";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  convertTime,
  convertTimestampToDate,
  mergeDateAndTime,
} from "../../utils/dateTimeConvert";
import {
  dataPisckerCalendar,
  formHelperErrorStyles,
  scrollBarStyles,
  selectDropdowStyles,
  textFieldStyle,
  timePickerMenu,
  validationRules,
} from "../../constants/constants";
import { Measurement } from "../../app/measurements";
import { Loader } from "../../components/Loader/Loader";
import { HtmlTooltip } from "../../components/HtmlTooltip/HtmlTooltip";
import InfoIcon from "@mui/icons-material/Info";
import { useMeasurementsModal } from "../../hooks/useMeasurementsModals";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";

interface AddMeasurementModal {
  open: boolean;
  handleClose: () => void;
}

const modalTitle = "Create measurement";
const alertAddMeasurementError = "Failed to add measurement";
const measurementAndPortionMaxLength = 5;
const dishNameLegth = 100;

export const AddMeasurementModal = ({
  open,
  handleClose,
}: AddMeasurementModal) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm<FormTypesCreateMeasurement>();

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
    // setDishStatistic,
    isAnyLoading,
    // abortControllersRef,
    loadingStates,
    // setLoadingStates,
  } = useMeasurementsModal<FormTypesCreateMeasurement>({ setValue, trigger });
  const dispatch = useAppDispatch();
  const typeOfMeasurementsState = useAppSelector(
    (state) => state.typesOfMeasurements
  );
  const addMeasurementsStatus = useAppSelector(
    (state) => state.measurements.checkoutAddMeasurementState
  );

  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [measurementType, setMeasurementType] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>(
    convertTimestampToDate(dayjs().unix())
  ); // YYYY-MM-DD
  const [convertedTime, setConvertedTime] = useState<string>(
    convertTime(dayjs().format("HH:mm"))
  ); // YYYY-MM-DDTHH:mm
  const typesOptions = [...typeOfMeasurementsState.typesOfMeasurements];

  console.log(dishStatistic);

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      const newDate = newValue.unix();
      setCreatedAt(newValue.format("YYYY-MM-DD"));
      setValue("createdAt", newDate);
    }

    trigger("createdAt");
  };

  const handleOnTimeChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      setConvertedTime(newValue.format("YYYY-MM-DDTHH:mm"));
      setValue("time", newValue.format("HH:mm"));
    }
    trigger("time");
  };

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

  const resetValues = () => {
    reset();
    setValue("createdAt", dayjs().unix());
    setValue("time", dayjs().format("HH:mm"));
    setValue("measurement", "");
    setValue("typeOfMeasurement", "");
    setCreatedAt(dayjs().format("YYYY-MM-DD"));
    setConvertedTime(dayjs().format("YYYY-MM-DDTHH:mm"));
    setMeasurementType("");
    resetMeasurement();
    clearErrors();
    remove();
  };

  const onSubmit = async (formData: FormTypesCreateMeasurement) => {
    // console.log(formData);
    console.log("dishStatistic", dishStatistic);
    console.log("loadingStates", loadingStates);
    const measurementId = uuidv4();
    const unixTimestampDate = formData.createdAt;
    const unixTimestampTime = dayjs(convertedTime).unix();
    const measurement = Number(formData.measurement);
    const typeOfMeasurement = typesOptions.filter(
      (item) => item.name === formData.typeOfMeasurement
    );

    let data: Measurement = {
      id: measurementId,
      createdAt: mergeDateAndTime(unixTimestampDate, unixTimestampTime),
      updatedAt: dayjs().unix(),
      typeOfMeasurement: typeOfMeasurement[0].id,
      measurement: measurement,
    };

    if (formData.afterMealMeasurement.meal.length > 0) {
      data = {
        ...data,
        afterMealMeasurement: {
          meal: formData.afterMealMeasurement.meal.map((item) => {
            const statistic = dishStatistic.find((el) => el.id === item.id);
            return {
              id: Number(item.id), // Сомнения
              portion: Number(item.portion),
              dish: item.dish,
              ...(statistic && { statistic }),
            };
          }),
        },
      };
    }

    const res = await dispatch(fetchAddMeasurement(data));

    if (!res.payload) {
      return;
    }

    resetValues();
  };

  const onClose = () => {
    resetValues();
    handleClose();
  };

  useEffect(() => {
    setValue("createdAt", dayjs().unix());
    setValue("time", dayjs().format("HH:mm"));
  }, [setValue]);

  return (
    <>
      <MeasurementModal<FormTypesCreateMeasurement>
        open={open}
        onClose={onClose}
        title={modalTitle}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        control={control}
        handleMeasurementChange={handleMeasurementChange}
        measurement={measurement}
        alertMeasurementError={alertAddMeasurementError}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        measurementStatus={addMeasurementsStatus}
        isAnyLoading={isAnyLoading}
      >
        <FormControl error={errors.createdAt ? true : false} fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="createdAt"
              control={control}
              rules={validationRules.createdAt}
              render={() => (
                <DatePicker
                  label="Date"
                  value={dayjs(createdAt)}
                  onChange={handleDateChange}
                  format="DD.MM.YYYY"
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: {
                      error: errors.createdAt ? true : false,
                    },
                    ...dataPisckerCalendar,
                  }}
                  sx={textFieldStyle}
                />
              )}
            />
          </LocalizationProvider>
          {errors.createdAt && (
            <FormHelperText sx={formHelperErrorStyles}>
              {" "}
              {errors.createdAt.message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl error={errors.time ? true : false} fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="time"
              control={control}
              rules={validationRules.time}
              render={() => (
                <TimePicker
                  label="Time"
                  value={dayjs(convertedTime)}
                  onChange={handleOnTimeChange}
                  format="HH:mm"
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: { error: errors.time ? true : false },
                    ...timePickerMenu,
                  }}
                  sx={textFieldStyle}
                />
              )}
            />
          </LocalizationProvider>
          {errors.time && (
            <FormHelperText sx={formHelperErrorStyles}>
              {" "}
              {errors.time.message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl error={errors.typeOfMeasurement ? true : false} fullWidth>
          <Controller
            name="typeOfMeasurement"
            control={control}
            rules={validationRules.typeOfMeasurement}
            render={() => (
              <TextField
                select
                slotProps={selectDropdowStyles}
                onChange={handleTypeOfMeasurementChange}
                value={measurementType}
                error={errors.typeOfMeasurement ? true : false}
                label="Type of measurement"
                variant="outlined"
                sx={textFieldStyle}
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
          {errors.typeOfMeasurement && (
            <FormHelperText sx={formHelperErrorStyles}>
              {errors.typeOfMeasurement?.message}
            </FormHelperText>
          )}
        </FormControl>
        {measurementType === "After meal" && (
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
                    rules={validationRules.mealItems.portion}
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
                        sx={textFieldStyle}
                        slotProps={{
                          input: {
                            inputProps: {
                              maxLength: measurementAndPortionMaxLength,
                            },
                          },
                        }}
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
        )}
      </MeasurementModal>
    </>
  );
};
