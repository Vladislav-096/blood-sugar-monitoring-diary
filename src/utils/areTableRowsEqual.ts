import { GridRowModel, GridValidRowModel } from "@mui/x-data-grid";

interface areObjectsEqual {
  result: boolean;
  field: string;
}

export const areTableRowsEqual = (
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
    const meals1 = newRow.afterMealMeasurement.meal;
    const meals2 = oldRow.afterMealMeasurement.meal;

    if (meals1.length !== meals2.length)
      return { result: false, field: "afterMealMeasurement" };

    for (let i = 0; i < meals1.length; i++) {
      const meal1 = meals1[i];
      const meal2 = meals2[i];

      if (meal1.dish !== meal2.dish) return { result: false, field: "dish" };
      if (meal1.portion !== meal2.portion)
        return { result: false, field: "portion" };

      // Сравнение statistic, если есть
      const stat1 = meal1.statistic;
      const stat2 = meal2.statistic;

      if (stat1 && stat2) {
        if (stat1.id !== stat2.id)
          return { result: false, field: "statistic.id" };
        if (stat1.calories !== stat2.calories)
          return { result: false, field: "statistic.calories" };
        if (stat1.proteins !== stat2.proteins)
          return { result: false, field: "statistic.proteins" };
        if (stat1.carbohydrates !== stat2.carbohydrates)
          return { result: false, field: "statistic.carbohydrates" };
        if (stat1.fats !== stat2.fats)
          return { result: false, field: "statistic.fats" };
        if (stat1.comment !== stat2.comment)
          return { result: false, field: "statistic.comment" };
      } else if (stat1 || stat2) {
        // Один есть, второго нет
        return { result: false, field: "statistic" };
      }
    }
  } else if (newRow.afterMealMeasurement || oldRow.afterMealMeasurement) {
    return { result: false, field: "afterMealMeasurement" };
  }

  // Всё ок
  return { result: true, field: "" };

  // // Сравнение afterMealMeasurement
  // if (newRow.afterMealMeasurement && oldRow.afterMealMeasurement) {
  //   if (
  //     newRow.afterMealMeasurement.meal.length !==
  //     oldRow.afterMealMeasurement.meal.length
  //   )
  //     return { result: false, field: "afterMealMeasurement" };

  //   // Сравнение каждого элемента массива meal
  //   for (let i = 0; i < newRow.afterMealMeasurement.meal.length; i++) {
  //     const meal1 = newRow.afterMealMeasurement.meal[i];
  //     const meal2 = oldRow.afterMealMeasurement.meal[i];

  //     if (meal1.dish !== meal2.dish) return { result: false, field: "dish" };
  //     if (meal1.portion !== meal2.portion)
  //       return { result: false, field: "portion" };
  //   }
  // } else if (newRow.afterMealMeasurement || oldRow.afterMealMeasurement) {
  //   // Если один объект содержит afterMealMeasurement, а другой - нет
  //   return { result: false, field: "afterMealMeasurement" };
  // }

  // // Если все проверки прошли
  // return { result: true, field: "" };
};
