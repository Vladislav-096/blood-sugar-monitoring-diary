import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getTypesOfMeasuremens,
  TypesOfMeasurements,
} from "../../app/measurements";
import { CheckoutState } from "../../types/types";
import { RootState } from "@reduxjs/toolkit/query";

interface TypesOfMeasurementsState {
  typesOfMeasurements: TypesOfMeasurements;
  checkoutState: CheckoutState;
  errorMessage: string;
}

const initialState: TypesOfMeasurementsState = {
  typesOfMeasurements: [],
  checkoutState: "READY",
  errorMessage: "",
};

export const recieveTypesOfMeasurements = createAsyncThunk(
  "typesOfMeasurements/recieveTypesOfMeasurements",
  async () => {
    const typesOfMeasurements = await getTypesOfMeasuremens();
    return typesOfMeasurements;
  }
);

export const typesOfMeasurementsSlice = createSlice({
  name: "typesOfMeasurements",
  initialState,
  reducers: {},
  extraReducers: function (builder) {
    builder.addCase(recieveTypesOfMeasurements.pending, (state) => {
      state.checkoutState = "LOADING";
    });
    builder.addCase(
      recieveTypesOfMeasurements.fulfilled,
      (state, action: PayloadAction<TypesOfMeasurements>) => {
        state.checkoutState = "READY";
        const measurements = action.payload;
        state.typesOfMeasurements = measurements;
      }
    );
    builder.addCase(recieveTypesOfMeasurements.rejected, (state, action) => {
      state.checkoutState = "ERROR";
      state.errorMessage = action.error.message || "";
    });
  },
});

// const recieveTypesOfMeasuremens = createSelector(
//     (state: RootState) => state.
// )