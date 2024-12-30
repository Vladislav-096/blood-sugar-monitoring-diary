import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addMeasurement,
  getMeasurements,
  Measurement,
} from "../../../app/measurements";
import { CheckoutState } from "../../../types/types";
import { MeasurementData } from "../../measurementModal/MeasurementModal";

interface MeasurementsState {
  measurements: Measurement[];
  checkoutGetMeasurementsState: CheckoutState;
  checkoutAddMeasurementState: CheckoutState;
  errorGetMeasurementsMessage: string;
  errorAddMeasurementsMessage: string;
}

const initialState: MeasurementsState = {
  measurements: [],
  checkoutGetMeasurementsState: "READY",
  checkoutAddMeasurementState: "READY",
  errorGetMeasurementsMessage: "",
  errorAddMeasurementsMessage: "",
};

export const fetchGetMeasurements = createAsyncThunk(
  "measurements/fetchGetMeasurements",
  async () => {
    const measurements = await getMeasurements();
    return measurements;
  }
);

export const fetchAddMeasurement = createAsyncThunk(
  "measurements/fetchAddMeasurement",
  async (arg: MeasurementData) => {
    const response = await addMeasurement(arg);
    const data = await response.json();
    return data;
  }
);

export const measurementsSlice = createSlice({
  name: "measurements",
  initialState,
  reducers: {},
  extraReducers: function (builder) {
    builder.addCase(fetchGetMeasurements.pending, (state) => {
      state.checkoutGetMeasurementsState = "LOADING";
    });
    builder.addCase(
      fetchGetMeasurements.fulfilled,
      (state, action: PayloadAction<Measurement[]>) => {
        state.checkoutGetMeasurementsState = "READY";
        const measurements = action.payload;
        state.measurements = measurements;
      }
    );
    builder.addCase(fetchGetMeasurements.rejected, (state, action) => {
      state.checkoutGetMeasurementsState = "ERROR";
      state.errorGetMeasurementsMessage = action.error.message || "";
    });

    builder.addCase(fetchAddMeasurement.pending, (state) => {
      state.checkoutAddMeasurementState = "LOADING";
    });
    builder.addCase(
      fetchAddMeasurement.fulfilled,
      (state, action: PayloadAction<MeasurementData>) => {
        state.checkoutAddMeasurementState = "READY";
        state.measurements = [...state.measurements, action.payload];
      }
    );
    builder.addCase(fetchAddMeasurement.rejected, (state, action) => {
      state.errorAddMeasurementsMessage = "ERROR";
      state.errorAddMeasurementsMessage = action.error.message || "";
    });
  },
});
