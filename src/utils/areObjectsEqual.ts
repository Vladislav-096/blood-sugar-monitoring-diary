import { GridRowModel, GridValidRowModel } from "@mui/x-data-grid";

interface areObjectsEqual {
  result: boolean;
  field: string;
}

export const areObjectsEqual = (
  newRow: GridRowModel,
  oldRow: GridValidRowModel
): areObjectsEqual => {
  // Сравнение примитивных значений
  if (newRow.typeOfMeasurement !== oldRow.typeOfMeasurement)
    return { result: false, field: "typeOfMeasurement" };
  if (newRow.id !== oldRow.id) return { result: false, field: "id" };
  if (newRow.createdAt !== oldRow.createdAt)
    return { result: false, field: "createdAt" };
  if (newRow.updatedAt !== oldRow.updatedAt)
    return { result: false, field: "updatedAt" };
  if (newRow.time !== oldRow.time) return { result: false, field: "time" };
  if (newRow.measurement.toString() !== oldRow.measurement.toString())
    return { result: false, field: "measurement" };

  // Сравнение afterMealMeasurement
  if (newRow.afterMealMeasurement && oldRow.afterMealMeasurement) {
    if (
      newRow.afterMealMeasurement.meal.length !==
      oldRow.afterMealMeasurement.meal.length
    )
      return { result: false, field: "afterMealMeasurement" };

    // Сравнение каждого элемента массива meal
    for (let i = 0; i < newRow.afterMealMeasurement.meal.length; i++) {
      const meal1 = newRow.afterMealMeasurement.meal[i];
      const meal2 = oldRow.afterMealMeasurement.meal[i];

      if (meal1.dish !== meal2.dish) return { result: false, field: "dish" };
      if (meal1.portion !== meal2.portion)
        return { result: false, field: "portion" };
    }
  } else if (newRow.afterMealMeasurement || oldRow.afterMealMeasurement) {
    // Если один объект содержит afterMealMeasurement, а другой - нет
    return { result: false, field: "afterMealMeasurement" };
  }

  // Если все проверки прошли
  return { result: true, field: "" };
};
