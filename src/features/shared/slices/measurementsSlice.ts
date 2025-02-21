import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addMeasurement,
  editMeasurement,
  getMeasurements,
  Measurement,
  removeMeasurement,
} from "../../../app/measurements";
import { CheckoutState, MeasurementData } from "../../../types/types";

interface MeasurementsState {
  measurements: Measurement[];
  checkoutGetMeasurementsState: CheckoutState;
  checkoutAddMeasurementState: CheckoutState;
  checkoutRemoveMeasurementState: CheckoutState;
  checkoutEditMeasurementState: CheckoutState;
  errorGetMeasurementsMessage: string;
  errorAddMeasurementsMessage: string;
  errorRemoveMeasurementsMessage: string;
  errorEditMeasurementsMessage: string;
}

const initialState: MeasurementsState = {
  measurements: [],
  checkoutGetMeasurementsState: "READY",
  checkoutAddMeasurementState: "READY",
  checkoutRemoveMeasurementState: "READY",
  checkoutEditMeasurementState: "READY",
  errorGetMeasurementsMessage: "",
  errorAddMeasurementsMessage: "",
  errorRemoveMeasurementsMessage: "",
  errorEditMeasurementsMessage: "",
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

export const fetchRemoveMeasurement = createAsyncThunk(
  "measurements/fetchRemoveMeasurement",
  async (id: string) => {
    const response = await removeMeasurement(id);
    const data = await response.json();
    return data;
  }
);

export const fetchEditMeasurement = createAsyncThunk(
  "measurement/fetchEditMeasurement",
  async (arg: MeasurementData) => {
    const response = await editMeasurement(arg);
    const data = await response.json();
    return data;
  }
);

export const measurementsSlice = createSlice({
  name: "measurements",
  initialState,
  reducers: {},
  extraReducers: function (builder) {
    // get
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
    // add
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
      console.log("fn")
      state.checkoutAddMeasurementState = "ERROR";
      state.errorAddMeasurementsMessage = action.error.message || "";
    });
    // remove
    builder.addCase(fetchRemoveMeasurement.pending, (state) => {
      state.checkoutRemoveMeasurementState = "LOADING";
    });
    builder.addCase(
      fetchRemoveMeasurement.fulfilled,
      (state, action: PayloadAction<MeasurementData>) => {
        state.checkoutRemoveMeasurementState = "READY";
        const newData = state.measurements.filter(
          (item) => item.id !== action.payload.id
        );
        state.measurements = newData;
      }
    );
    builder.addCase(fetchRemoveMeasurement.rejected, (state, action) => {
      state.checkoutRemoveMeasurementState = "ERROR";
      state.errorAddMeasurementsMessage = action.error.message || "";
    });
    // edit
    builder.addCase(fetchEditMeasurement.pending, (state) => {
      state.checkoutEditMeasurementState = "LOADING";
    });
    builder.addCase(
      fetchEditMeasurement.fulfilled,
      (state, action: PayloadAction<MeasurementData>) => {
        state.checkoutEditMeasurementState = "READY";
        const index = state.measurements.findIndex(
          (item) => item.id === action.payload.id
        );

        console.log("action.payload", action.payload);

        if (index !== -1) {
          state.measurements[index] = action.payload;
        }
      }
    );
    builder.addCase(fetchEditMeasurement.rejected, (state, action) => {
      state.checkoutEditMeasurementState = "ERROR";
      state.errorEditMeasurementsMessage = action.error.message || "";
    });
  },
});
