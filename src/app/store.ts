import { configureStore } from "@reduxjs/toolkit";
import { measurementsSlice } from "../features/shared/slices/measurementsSlice";
import { typesOfMeasurementsSlice } from "../features/addMeasurementModal/typesOfMeasurementsSlice";

export const store = configureStore({
  reducer: {
    measurements: measurementsSlice.reducer,
    typesOfMeasurements: typesOfMeasurementsSlice.reducer,
  },
});

// ReturnType — это утилита в TypeScript, которая позволяет получить тип возвращаемого значения функции.
export type RootState = ReturnType<typeof store.getState>;
// Оператор type позволяет получить тип выражения. В данном случае, он используется для извлечения типа dispatch из объекта store.
export type AppDispatch = typeof store.dispatch;
