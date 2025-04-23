import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  FormHelperText,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./measurementModal.module.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useRef, useState } from "react";
import { v7 as uuidv4 } from "uuid";
import { fetchAddMeasurement } from "../shared/slices/measurementsSlice";
import {
  FieldNameCreateMeasurementForm,
  FormTypesCreateMeasurement,
  MeasurementData,
} from "../../types/types";
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
import { CustomRequestErrorAlert } from "../../components/CustomRequestErrorAlert/CustomRequestErrorAlert";
import { SubmitModalButton } from "../../components/SubmitModalButton/SubmitModalButton";
import {
  dataPisckerCalendar,
  formHelperErrorStyles,
  modalContentStyles,
  modalInnerContentStyles,
  selectDropdowStyles,
  textFieldStyle,
  timePickerMenu,
  validationRules,
} from "../../constants/constants";
import { getDishStatistic } from "../../app/dishStatistic";
import { DishStatistic } from "../../app/measurements";
import { Loader } from "../../components/Loader/Loader";
interface MeasurementModal {
  open: boolean;
  handleClose: () => void;
}

const alertAddMeasurementError = "Failed to add measurement";
const measurementAndPortionMaxLength = 5;
const dishNameLegth = 100;

export const MeasurementModal = ({ open, handleClose }: MeasurementModal) => {
  const dispatch = useAppDispatch();
  const typeOfMeasurementsState = useAppSelector(
    (state) => state.typesOfMeasurements
  );
  const addMeasurementsStatus = useAppSelector(
    (state) => state.measurements.checkoutAddMeasurementState
  );

  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [measurementType, setMeasurementType] = useState<string>("");
  const [measurement, setMeasurement] = useState<string>("");
  const testData = [
    {
      id: 0,
      calories: 111,
      proteins: 1.29,
      fats: 0.33,
      carbohydrates: 22.84,
      comment: "medium glycemic index",
    },
    {
      id: 1,
      calories: 222,
      proteins: 9.8,
      fats: 29.5,
      carbohydrates: 3.8,
      comment: "The glycemic index is considered low",
    },
  ];
  const [dishStatistic, setDishStatistic] = useState<DishStatistic[]>([]);
  // const abortControllerRef = useRef<AbortController | null>(null);
  // const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllersRef = useRef<Record<number, AbortController>>({});
  const debounceTimeoutsRef = useRef<
    Record<number, ReturnType<typeof setTimeout>>
  >({});
  const [createdAt, setCreatedAt] = useState<string>(
    convertTimestampToDate(dayjs().unix())
  ); // YYYY-MM-DD
  const [convertedTime, setConvertedTime] = useState<string>(
    convertTime(dayjs().format("HH:mm"))
  ); // YYYY-MM-DDTHH:mm
  const typesOptions = [...typeOfMeasurementsState.typesOfMeasurements];
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );
  const isAnyLoading = Object.values(loadingStates).some(Boolean);

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

  const handlePortionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const fieldName = `afterMealMeasurement.meal.${index}.portion`;
    formatInputValueToNumbers(
      event,
      fieldName as FieldNameCreateMeasurementForm
    );
  };

  const handleDishChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = event.target;
    const fieldName = `afterMealMeasurement.meal.${index}.dish`;
    setValue(fieldName as FieldNameCreateMeasurementForm, value);
    trigger(fieldName as FieldNameCreateMeasurementForm);

    // Очистить старый debounce таймер
    if (debounceTimeoutsRef.current[index]) {
      clearTimeout(debounceTimeoutsRef.current[index]);
    }

    debounceTimeoutsRef.current[index] = setTimeout(async () => {
      // Отменяем предыдущий запрос
      if (abortControllersRef.current[index]) {
        abortControllersRef.current[index].abort();
      }

      // Создаём новый AbortController
      const controller = new AbortController();
      abortControllersRef.current[index] = controller;

      // Установить флаг загрузки
      setLoadingStates((prev) => ({ ...prev, [index]: true }));

      try {
        console.log(`started loading ${index}`);
        const DishStatisticResponse = await getDishStatistic({
          dishName: value,
          signal: controller.signal,
        });

        const DishStatisticJson = await DishStatisticResponse.json();
        console.log("DishStatisticJson", DishStatisticJson);

        console.log(`stopped loading ${index}`);
        const DishStatisticData: DishStatistic = {
          id: index,
          ...JSON.parse(DishStatisticJson.choices[0].message.content),
        };
        console.log("DishStatisticData", DishStatisticData);

        // Тупая нейросеть отказывается отвечать мне пустой строкой, как я прошу, в случае
        // если dishName не еда. Вместо этого она отвечает объектом, в котором protein,
        // fat, carbs и calories равны 0. Поэтому делаю проверку по этим полям
        if (
          DishStatisticData.calories === 0 &&
          DishStatisticData.proteins === 0 &&
          DishStatisticData.fats === 0 &&
          DishStatisticData.carbohydrates === 0
        ) {
          return;
        }

        setDishStatistic((prev) => {
          const existingIndex = prev.findIndex((item) => item.id === index);

          if (existingIndex !== -1) {
            const newArray = [...prev];
            newArray[existingIndex] = DishStatisticData;
            return newArray;
          }

          return [...prev, DishStatisticData];
        });
      } catch (err) {
        console.log(err);
        return;
      } finally {
        // Сбросить флаг загрузки
        setLoadingStates((prev) => ({ ...prev, [index]: false }));
      }
    }, 400);
  };

  const handleMeasurementChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = "measurement";
    formatInputValueToNumbers(
      event,
      fieldName as FieldNameCreateMeasurementForm
    );
  };

  const formatInputValueToNumbers = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: FieldNameCreateMeasurementForm
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

  const handleDishAndPortionFocus = (index: number) => {
    console.log(index);
    setValue(
      `afterMealMeasurement.meal.${index}.id` as FieldNameCreateMeasurementForm,
      index
    );
  };

  const handleRemoveMeal = (index: number) => {
    // Отменяем текущий запрос
    if (abortControllersRef.current[index]) {
      abortControllersRef.current[index].abort();
    }

    remove(index);

    // setDishStatistic((prev) => {
    //   const existingIndex = prev.findIndex((item) => item.id === index);
    //   if (existingIndex !== -1) {
    //     const newArray = [...prev];
    //     newArray.splice(existingIndex, 1);
    //     return newArray;
    //   }
    //   return prev;
    // });

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

  const resetValues = () => {
    reset();
    setValue("createdAt", dayjs().unix());
    setValue("time", dayjs().format("HH:mm"));
    setValue("measurement", "");
    setValue("typeOfMeasurement", "");
    setCreatedAt(dayjs().format("YYYY-MM-DD"));
    setConvertedTime(dayjs().format("YYYY-MM-DDTHH:mm"));
    setMeasurementType("");
    setMeasurement("");
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

    let data: MeasurementData = {
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
              id: item.id,
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

  useEffect(() => {
    setValue("createdAt", dayjs().unix());
    setValue("time", dayjs().format("HH:mm"));
  }, [setValue]);

  return (
    <>
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
            <Box sx={modalInnerContentStyles}>
              <Typography
                component="h2"
                sx={{ marginBottom: "10px", fontSize: "20px" }}
              >
                Add new measurement
              </Typography>
              {/* <Box>
                {dishStatistic.map((item, index) => (
                  <div key={index}>
                    <div>{item.id}</div>
                    <div>{item.carbohydrates}</div>
                    <div>{item.fats}</div>
                    <div>{item.proteins}</div>
                    <div>{item.comment}</div>
                    <div>{item.calories}</div>
                  </div>
                ))}
              </Box> */}
              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
                <FormControl
                  error={errors.typeOfMeasurement ? true : false}
                  fullWidth
                >
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
                                  errors.afterMealMeasurement?.meal?.[index]
                                    ?.dish
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
                                  errors.afterMealMeasurement?.meal?.[index]
                                    ?.portion
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
                      onClick={() =>
                        append({ id: null, dish: "", portion: "" })
                      }
                    >
                      Add Meal
                    </Button>
                  </Box>
                )}
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
                        onChange={handleMeasurementChange}
                        label="Measurement"
                        variant="outlined"
                        error={errors.measurement ? true : false}
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
                  {errors.measurement && (
                    <FormHelperText sx={formHelperErrorStyles}>
                      {errors.measurement?.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <SubmitModalButton
                  requestStatus={addMeasurementsStatus}
                  buttonName={"submit"}
                  isDisbled={isAnyLoading}
                />
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <CustomRequestErrorAlert
        title={alertAddMeasurementError}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        status={addMeasurementsStatus}
      />
    </>
  );
};
