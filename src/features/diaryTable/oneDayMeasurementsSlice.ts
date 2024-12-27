import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getMeasurements, Measurement } from "../../app/measurements";
import { CheckoutState } from "../../types/types";
import { getDateRange } from "../../utils/getDateRange";

interface OneDayMeasurementsState {
  oneDayMeasurements: Measurement[];
  checkoutState: CheckoutState;
  errorMessage: string;
}

const initialState: OneDayMeasurementsState = {
  oneDayMeasurements: [],
  checkoutState: "READY",
  errorMessage: "",
};

export const recieveFilteredMeasurements = createAsyncThunk(
  "oneDayMeasurements/recieveFilteredMeasurements",
  async (arg: number) => {
    const dataRange = getDateRange(arg);
    const filteredMeasurements = await getMeasurements(dataRange);
    return filteredMeasurements;
  }
);

export const oneDayMeasurementsSlice = createSlice({
  name: "oneDayMeasurements",
  initialState,
  reducers: {},
  extraReducers: function (builder) {
    builder.addCase(recieveFilteredMeasurements.pending, (state) => {
      state.checkoutState = "LOADING";
    });
    builder.addCase(
      recieveFilteredMeasurements.fulfilled,
      (state, action: PayloadAction<Measurement[]>) => {
        state.checkoutState = "READY";
        const filteredMeasurements = action.payload;
        state.oneDayMeasurements = filteredMeasurements;
      }
    );
    builder.addCase(recieveFilteredMeasurements.rejected, (state, action) => {
      state.checkoutState = "ERROR";
      state.errorMessage = action.error.message || "";
    });
  },
});
