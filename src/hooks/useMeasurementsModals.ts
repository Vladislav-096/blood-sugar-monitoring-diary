import { useRef, useState } from "react";
import {
  FieldPath,
  PathValue,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import {
  FormTypesCreateMeasurement,
  FormTypesEditMeasurement,
} from "../types/types";
import { DishStatistic } from "../app/measurements";
import { getDishStatistic } from "../app/dishStatistic";

interface UseMeasurementsModalProps<
  T extends FormTypesCreateMeasurement | FormTypesEditMeasurement
> {
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  initialMeasurement?: string;
}

export const useMeasurementsModal = <
  T extends FormTypesCreateMeasurement | FormTypesEditMeasurement
>({
  setValue,
  trigger,
  initialMeasurement = "",
}: UseMeasurementsModalProps<T>) => {
  const [dishStatistic, setDishStatistic] = useState<DishStatistic[]>([]);
  const [measurement, setMeasurement] = useState<string>(initialMeasurement);
  const abortControllersRef = useRef<Record<number, AbortController>>({});
  const debounceTimeoutsRef = useRef<
    Record<number, ReturnType<typeof setTimeout>>
  >({});

  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );

  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  const handleDishAndPortionFocus = (index: number) => {
    // Using type assertion to handle nested field paths in form types
    const fieldPath =
      `afterMealMeasurement.meal.${index}.id` as unknown as FieldPath<T>;
    setValue(fieldPath, index as unknown as PathValue<T, typeof fieldPath>);
  };

  const formatInputValueToNumbers = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: FieldPath<T>
  ) => {
    const { value } = event.target;
    const pattern = /[^0-9]/g;
    const numericValue = value.replace(pattern, "");

    if (fieldName === ("measurement" as FieldPath<T>)) {
      setMeasurement(numericValue);
    }

    setValue(
      fieldName,
      numericValue as unknown as PathValue<T, typeof fieldName>
    );
    trigger(fieldName);
  };

  const handlePortionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const fieldName =
      `afterMealMeasurement.meal.${index}.portion` as FieldPath<T>;
    formatInputValueToNumbers(event, fieldName);
  };

  const handleMeasurementChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = "measurement" as FieldPath<T>;
    formatInputValueToNumbers(event, fieldName);
  };

  const handleRemoveMeal = (
    index: number,
    remove: (index?: number | number[]) => void
  ) => {
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

  const handleDishChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = event.target;
    const fieldName = `afterMealMeasurement.meal.${index}.dish` as FieldPath<T>;

    // Use type assertion to handle the complex nested form structure
    setValue(fieldName, value as unknown as PathValue<T, typeof fieldName>);
    trigger(fieldName);

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

      // Удаляю предыдущую статистику если она есть
      setDishStatistic((prev) => {
        // Удаляем нужный индекс
        const filtered = prev.filter((item) => item.id !== index);

        return filtered;
      });

      try {
        // console.log(`started loading ${index}`);
        const DishStatisticResponse = await getDishStatistic({
          dishName: value,
          signal: controller.signal,
        });

        const DishStatisticJson = await DishStatisticResponse.json();

        // console.log(`stopped loading ${index}`);
        const DishStatisticData: DishStatistic = {
          id: index,
          ...JSON.parse(DishStatisticJson.choices[0].message.content),
        };

        // Тупая нейросеть отказывается отвечать мне пустой строкой, как я прошу, в случае
        // если dishName не еда. Вместо этого она отвечает объектом, в котором proteins,
        // fats, carbs и calories равны 0. Поэтому делаю проверку по этим полям
        if (
          DishStatisticData.calories === 0 &&
          DishStatisticData.proteins === 0 &&
          DishStatisticData.fats === 0 &&
          DishStatisticData.carbohydrates === 0
        ) {
          return;
        }

        setDishStatistic((prev) => {
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

  const resetMeasurement = (value: string = "") => {
    setMeasurement(value);
  };

  return {
    handleDishChange,
    handlePortionChange,
    handleMeasurementChange,
    handleDishAndPortionFocus,
    handleRemoveMeal,
    formatInputValueToNumbers,
    measurement,
    resetMeasurement,
    dishStatistic,
    setDishStatistic,
    isAnyLoading,
    abortControllersRef,
    loadingStates,
    setLoadingStates,
  };
};
