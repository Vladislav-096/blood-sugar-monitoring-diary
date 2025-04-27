import { useRef, useState } from "react";
import { FieldPath, PathValue, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import {
  FormTypesCreateMeasurement,
  FormTypesEditMeasurement,
} from "../types/types";
import { DishStatistic } from "../app/measurements";
import { getDishStatistic } from "../app/dishStatistic";

interface UseMeasurementsModalProps<T extends FormTypesCreateMeasurement | FormTypesEditMeasurement> {
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
}

export const useMeasurementsModal = <T extends FormTypesCreateMeasurement | FormTypesEditMeasurement>({
  setValue,
  trigger,
}: UseMeasurementsModalProps<T>) => {
  const [dishStatistic, setDishStatistic] = useState<DishStatistic[]>([]);
  const abortControllersRef = useRef<Record<number, AbortController>>({});
  const debounceTimeoutsRef = useRef<
    Record<number, ReturnType<typeof setTimeout>>
  >({});

  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );

  const isAnyLoading = Object.values(loadingStates).some(Boolean);

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

        // Сдвигаем все id после удалённого вниз на 1
        // const updated = filtered.map((item) => {
        //   if (item.id > index) {
        //     return { ...item, id: item.id - 1 };
        //   }
        //   return item;
        // });

        // return updated;
        return filtered;
      });

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
          // const existingIndex = prev.findIndex((item) => item.id === index);

          // if (existingIndex !== -1) {
          //   const newArray = [...prev];
          //   newArray[existingIndex] = DishStatisticData;
          //   return newArray;
          // }

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

  return {
    handleDishChange,
    dishStatistic,
    setDishStatistic,
    isAnyLoading,
    abortControllersRef,
    loadingStates,
    setLoadingStates,
  };
};
