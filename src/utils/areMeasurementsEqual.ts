import { Measurement } from "../app/measurements";

interface AreObjectsEqualResult {
  result: boolean;
  field?: string;
}

export const areMeasurementsEqual = (
  obj1: Measurement,
  obj2: Measurement
): AreObjectsEqualResult => {
  if (obj1.typeOfMeasurement !== obj2.typeOfMeasurement)
    return { result: false, field: "typeOfMeasurement" };
  if (obj1.measurement !== obj2.measurement)
    return { result: false, field: "measurement" };

  const meal1 = obj1.afterMealMeasurement?.meal || [];
  const meal2 = obj2.afterMealMeasurement?.meal || [];

  if (meal1.length !== meal2.length)
    return { result: false, field: "afterMealMeasurement.meal.length" };

  for (let i = 0; i < meal1.length; i++) {
    const m1 = meal1[i];
    const m2 = meal2[i];

    if (m1.dish !== m2.dish)
      return { result: false, field: `afterMealMeasurement.meal[${i}].dish` };
    if (Number(m1.portion) !== Number(m2.portion))
      return {
        result: false,
        field: `afterMealMeasurement.meal[${i}].portion`,
      };

    const s1 = m1.statistic;
    const s2 = m2.statistic;

    if (s1 && s2) {
      if (s1.calories !== s2.calories)
        return {
          result: false,
          field: `afterMealMeasurement.meal[${i}].statistic.calories`,
        };
      if (s1.proteins !== s2.proteins)
        return {
          result: false,
          field: `afterMealMeasurement.meal[${i}].statistic.proteins`,
        };
      if (s1.fats !== s2.fats)
        return {
          result: false,
          field: `afterMealMeasurement.meal[${i}].statistic.fats`,
        };
      if (s1.carbohydrates !== s2.carbohydrates)
        return {
          result: false,
          field: `afterMealMeasurement.meal[${i}].statistic.carbohydrates`,
        };
      if (s1.comment !== s2.comment)
        return {
          result: false,
          field: `afterMealMeasurement.meal[${i}].statistic.comment`,
        };
    } else if (s1 || s2) {
      return {
        result: false,
        field: `afterMealMeasurement.meal[${i}].statistic`,
      };
    }
  }

  return { result: true };
};
