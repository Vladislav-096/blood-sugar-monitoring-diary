// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { CheckoutState, ModifiedMeal } from "../../types/types";

// export interface afterMealMeasurementData {
//   afterMealMeasurementId: string;
//   afterMealMeasurementMeasurement: number | null;
//   afterMealMeasurementMeals: ModifiedMeal[];
// }

// interface AfterMealMeasurementState {
//   afterMealMeasurement: afterMealMeasurementData;
//   checkoutAfterMealMeasurement: CheckoutState;
//   errorAfterMealMeasurementMessage: string;
// }

// export const initialState: AfterMealMeasurementState = {
//   afterMealMeasurement: {
//     afterMealMeasurementId: "",
//     afterMealMeasurementMeasurement: null,
//     afterMealMeasurementMeals: [],
//   },
//   checkoutAfterMealMeasurement: "READY",
//   errorAfterMealMeasurementMessage: "",
// };

// export const afterMealMeasurementSlice = createSlice({
//   name: "afterMealMeasurement",
//   initialState,
//   reducers: {
//     editAfterMealMeasurement(
//       state,
//       action: PayloadAction<afterMealMeasurementData>
//     ) {
//       const data = action.payload;
//       state.afterMealMeasurement = data;
//     },
//   },
// });