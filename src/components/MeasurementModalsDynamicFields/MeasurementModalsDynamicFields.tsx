import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  FieldPath,
  RegisterOptions,
  UseFieldArrayRemove,
} from "react-hook-form";
import {
  validationRules,
  textFieldStyle,
  formHelperErrorStyles,
  scrollBarStyles,
} from "../../constants/constants";
import { HtmlTooltip } from "../HtmlTooltip/HtmlTooltip";
import { Loader } from "../Loader/Loader";
import {
  FormTypesCreateMeasurement,
  FormTypesEditMeasurement,
} from "../../types/types";
import { DishStatistic } from "../../app/measurements";
import InfoIcon from "@mui/icons-material/Info";
import styles from "./measurementModalsDynamicFields.module.scss";

interface MeasurementModalsDynamicFields<
  T extends FormTypesCreateMeasurement | FormTypesEditMeasurement
> {
  index: number;
  control: Control<T> | undefined;
  errors: FieldErrors<T>;
  handleDishChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => Promise<void>;
  handleDishAndPortionFocus: (index: number) => void;
  loadingStates: Record<number, boolean>;
  dishStatistic: DishStatistic[];
  handlePortionChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  handleRemoveMeal: (
    index: number,
    remove: (index?: number | number[]) => void
  ) => void;
  remove: UseFieldArrayRemove;
}

// Define a type for the nested error structure
type NestedErrors = {
  afterMealMeasurement?: {
    meal?: Array<{
      dish?: { message?: string };
      portion?: { message?: string };
    }>;
  };
} & Record<string, unknown>;

const dishNameLegth = 100;
const measurementAndPortionMaxLength = 5;

export const MeasurementModalsDynamicFields = <
  T extends FormTypesCreateMeasurement | FormTypesEditMeasurement
>({
  index,
  control,
  errors,
  handleDishChange,
  handleDishAndPortionFocus,
  loadingStates,
  dishStatistic,
  handlePortionChange,
  handleRemoveMeal,
  remove,
}: MeasurementModalsDynamicFields<T>) => {
  // Cast errors to our nested type
  const nestedErrors = errors as unknown as NestedErrors;

  return (
    <>
      <FormControl sx={{ display: "none" }}>
        <Controller
          name={`afterMealMeasurement.meal.${index}.id` as FieldPath<T>}
          control={control}
          render={() => <TextField />}
        />
      </FormControl>
      <FormControl
        error={
          nestedErrors.afterMealMeasurement?.meal?.[index]?.dish ? true : false
        }
        fullWidth
      >
        <Controller
          name={`afterMealMeasurement.meal.${index}.dish` as FieldPath<T>}
          control={control}
          rules={
            validationRules.mealItems.dish as RegisterOptions<T, FieldPath<T>>
          }
          render={({ field }) => (
            <TextField
              {...field}
              onChange={(e) => handleDishChange(e, index)}
              onFocus={() => handleDishAndPortionFocus(index)}
              label="Dish"
              variant="outlined"
              error={
                nestedErrors.afterMealMeasurement?.meal?.[index]?.dish
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
        {nestedErrors.afterMealMeasurement?.meal?.[index]?.dish && (
          <FormHelperText sx={formHelperErrorStyles}>
            {nestedErrors.afterMealMeasurement.meal?.[index].dish.message}
          </FormHelperText>
        )}
        {loadingStates[index] && (
          <Box
            sx={{
              position: "absolute",
              width: "10%",
              height: "40%",
              top: "50%",
              transform: nestedErrors.afterMealMeasurement?.meal?.[index]?.dish
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
              transform: nestedErrors.afterMealMeasurement?.meal?.[index]?.dish
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
                              <span className={styles.descr}>{`${key}:`}</span>
                              <span className={styles.value}>
                                {`${value} ${
                                  !["comment", "calories", "id"].includes(key)
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
          nestedErrors.afterMealMeasurement?.meal?.[index]?.portion
            ? true
            : false
        }
        fullWidth
      >
        <Controller
          name={`afterMealMeasurement.meal.${index}.portion` as FieldPath<T>}
          control={control}
          rules={
            validationRules.mealItems.dish as RegisterOptions<T, FieldPath<T>>
          }
          render={({ field }) => (
            <TextField
              {...field}
              onChange={(e) => handlePortionChange(e, index)}
              onFocus={() => handleDishAndPortionFocus(index)}
              label="Portion (grams)"
              variant="outlined"
              error={
                nestedErrors.afterMealMeasurement?.meal?.[index]?.portion
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
        {nestedErrors.afterMealMeasurement?.meal?.[index]?.portion && (
          <FormHelperText sx={formHelperErrorStyles}>
            {nestedErrors.afterMealMeasurement?.meal?.[index]?.portion?.message}
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
    </>
  );
};
