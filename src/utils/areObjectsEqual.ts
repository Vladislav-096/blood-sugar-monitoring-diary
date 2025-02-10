import { GridRowModel, GridValidRowModel } from "@mui/x-data-grid";

export const areObjectsEqual = (
  newRow: GridRowModel,
  oldRow: GridValidRowModel
): boolean => {
  // Сравнение примитивных значений
  if (newRow.typeOfMeasurement !== oldRow.typeOfMeasurement) return false;
  if (newRow.id !== oldRow.id) return false;
  if (newRow.createdAt !== oldRow.createdAt) return false;
  if (newRow.updatedAt !== oldRow.updatedAt) return false;
  if (newRow.time !== oldRow.time) return false;
  if (newRow.measurement !== oldRow.measurement) return false;

  // Сравнение afterMealMeasurement
  if (newRow.afterMealMeasurement && oldRow.afterMealMeasurement) {
    if (
      newRow.afterMealMeasurement.meal.length !==
      oldRow.afterMealMeasurement.meal.length
    )
      return false;

    // Сравнение каждого элемента массива meal
    for (let i = 0; i < newRow.afterMealMeasurement.meal.length; i++) {
      const meal1 = newRow.afterMealMeasurement.meal[i];
      const meal2 = oldRow.afterMealMeasurement.meal[i];

      if (meal1.dish !== meal2.dish) return false;
      if (meal1.portion !== meal2.portion) return false;
    }
  } else if (newRow.afterMealMeasurement || oldRow.afterMealMeasurement) {
    // Если один объект содержит afterMealMeasurement, а другой - нет
    return false;
  }

  // Если все проверки прошли
  return true;
};
