import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getMeasurements, Measurement } from "../../app/measurements";

type CheckoutState = "LOADING" | "READY" | "ERROR";
export interface MeasurementsState {
  measurements: Measurement[];
  checkoutState: CheckoutState;
  errorMessage: string;
}

const initialState: MeasurementsState = {
  measurements: [],
  checkoutState: "READY",
  errorMessage: "",
};

export const recieveMeasurements = createAsyncThunk(
  "measurements/recieveMeasurements",
  async () => {
    const measurements = await getMeasurements();
    return measurements;
  }
);

export const measurementsSlice = createSlice({
  name: "measurements",
  initialState,
  reducers: {},
  extraReducers: function (builder) {
    builder.addCase(recieveMeasurements.pending, (state) => {
      state.checkoutState = "LOADING";
    });
    builder.addCase(
      recieveMeasurements.fulfilled,
      (state, action: PayloadAction<Measurement[]>) => {
        state.checkoutState = "READY";
        const measurements = action.payload;
        state.measurements = measurements;
      }
    );
    builder.addCase(recieveMeasurements.rejected, (state, action) => {
      state.checkoutState = "ERROR";
      state.errorMessage = action.error.message || "";
    });
  },
});
