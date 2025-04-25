import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addMeasurement,
  editMeasurement,
  getMeasurements,
  Measurement,
  removeMeasurement,
} from "../../../app/measurements";
import {
  CheckoutState,
  RequestError,
} from "../../../types/types";
import { requestErrorInitial } from "../../../constants/constants";

interface MeasurementsState {
  measurements: Measurement[];
  checkoutGetMeasurementsState: CheckoutState;
  checkoutAddMeasurementState: CheckoutState;
  checkoutRemoveMeasurementState: CheckoutState;
  checkoutEditMeasurementState: CheckoutState;
  errorGetMeasurements: RequestError;
  errorAddMeasurements: RequestError;
  errorRemoveMeasurements: RequestError;
  errorEditMeasurements: RequestError;
}

const initialState: MeasurementsState = {
  measurements: [],
  checkoutGetMeasurementsState: "READY",
  checkoutAddMeasurementState: "READY",
  checkoutRemoveMeasurementState: "READY",
  checkoutEditMeasurementState: "READY",
  errorGetMeasurements: requestErrorInitial,
  errorAddMeasurements: requestErrorInitial,
  errorRemoveMeasurements: requestErrorInitial,
  errorEditMeasurements: requestErrorInitial,
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
  async (arg: Measurement) => {
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
  async (arg: Measurement) => {
    const response = await editMeasurement(arg);
    const data = await response.json();
    return data;
  }
);

export type FetchMeasurementResponse = ReturnType<typeof fetchEditMeasurement>;

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
      const errorObject = {
        code: action.error.code || "",
        message: action.error.message || "",
      };
      state.errorGetMeasurements = errorObject || requestErrorInitial;
    });
    // add
    builder.addCase(fetchAddMeasurement.pending, (state) => {
      state.checkoutAddMeasurementState = "LOADING";
    });
    builder.addCase(
      fetchAddMeasurement.fulfilled,
      (state, action: PayloadAction<Measurement>) => {
        state.checkoutAddMeasurementState = "READY";
        state.measurements = [...state.measurements, action.payload];
      }
    );
    builder.addCase(fetchAddMeasurement.rejected, (state, action) => {
      //
      state.checkoutAddMeasurementState = "ERROR";
      const errorObject = {
        code: action.error.code || "",
        message: action.error.message || "",
      };
      state.errorAddMeasurements = errorObject || requestErrorInitial;
    });
    // remove
    builder.addCase(fetchRemoveMeasurement.pending, (state) => {
      state.checkoutRemoveMeasurementState = "LOADING";
    });
    builder.addCase(
      fetchRemoveMeasurement.fulfilled,
      (state, action: PayloadAction<Measurement>) => {
        state.checkoutRemoveMeasurementState = "READY";
        const newData = state.measurements.filter(
          (item) => item.id !== action.payload.id
        );
        state.measurements = newData;
      }
    );
    builder.addCase(fetchRemoveMeasurement.rejected, (state, action) => {
      state.checkoutRemoveMeasurementState = "ERROR";
      const errorObject = {
        code: action.error.code || "",
        message: action.error.message || "",
      };
      state.errorAddMeasurements = errorObject || requestErrorInitial;
    });
    // edit
    builder.addCase(fetchEditMeasurement.pending, (state) => {
      state.checkoutEditMeasurementState = "LOADING";
    });
    builder.addCase(
      fetchEditMeasurement.fulfilled,
      (state, action: PayloadAction<Measurement>) => {
        state.checkoutEditMeasurementState = "READY";
        const index = state.measurements.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.measurements[index] = action.payload;
        }
      }
    );
    builder.addCase(fetchEditMeasurement.rejected, (state, action) => {
      state.checkoutEditMeasurementState = "ERROR";
      const errorObject = {
        code: action.error.code || "",
        message: action.error.message || "",
      };
      state.errorEditMeasurements = errorObject || requestErrorInitial;
    });
  },
});
