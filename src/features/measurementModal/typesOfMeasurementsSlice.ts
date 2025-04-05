import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getTypesOfMeasurements,
  TypesOfMeasurements,
} from "../../app/measurements";
import { CheckoutState, RequestError } from "../../types/types";
import { requestErrorInitial } from "../../constants/constants";

interface TypesOfMeasurementsState {
  typesOfMeasurements: TypesOfMeasurements;
  checkoutState: CheckoutState;
  error: RequestError;
}

const initialState: TypesOfMeasurementsState = {
  typesOfMeasurements: [],
  checkoutState: "READY",
  error: requestErrorInitial,
};

export const recieveTypesOfMeasurements = createAsyncThunk(
  "typesOfMeasurements/recieveTypesOfMeasurements",
  async () => {
    const typesOfMeasurements = await getTypesOfMeasurements();
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
        const typesOfMeasurements = action.payload;
        state.typesOfMeasurements = typesOfMeasurements;
      }
    );
    builder.addCase(recieveTypesOfMeasurements.rejected, (state, action) => {
      state.checkoutState = "ERROR";
      const errorObject = {
        code: action.error.code || "",
        message: action.error.message || "",
      };
      state.error = errorObject || requestErrorInitial;
    });
  },
});
