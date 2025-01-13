import { configureStore } from "@reduxjs/toolkit";
import { measurementsSlice } from "../features/shared/slices/measurementsSlice";
import { typesOfMeasurementsSlice } from "../features/measurementModal/typesOfMeasurementsSlice";
import { oneDayMeasurementsSlice } from "../features/diaryTable/oneDayMeasurementsSlice";
import { afterMealMeasurementSlice } from "../features/diaryTable/afterMealMeasurementSlice";

// Глобальный стейт приложения
export const store = configureStore({
  reducer: {
    measurements: measurementsSlice.reducer,
    typesOfMeasurements: typesOfMeasurementsSlice.reducer,
    oneDayMeasurements: oneDayMeasurementsSlice.reducer,
    afterMealMeasurement: afterMealMeasurementSlice.reducer,
  },
});

console.log("store", store.getState()); // Будет пустой, вроде потому что увижу только при первом рендере

// ReturnType — это утилита в TypeScript, которая позволяет получить тип возвращаемого значения функции.
export type RootState = ReturnType<typeof store.getState>;
// Оператор type позволяет получить тип выражения. В данном случае, он используется для извлечения типа dispatch из объекта store.
export type AppDispatch = typeof store.dispatch;
