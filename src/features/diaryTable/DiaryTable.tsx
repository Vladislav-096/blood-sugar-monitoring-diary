import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Box, Button } from "@mui/material";
import { MeasurementModal } from "../measurementModal/MeasurementModal";
import {
  fetchEditMeasurement,
  fetchGetMeasurements,
  fetchRemoveMeasurement,
} from "../shared/slices/measurementsSlice";
import { recieveFilteredMeasurements } from "./oneDayMeasurementsSlice";
import { useNavigate } from "react-router";
import { Table } from "../../components/Table/Table";
import { MeasurementData } from "../../types/types";
import { recieveTypesOfMeasurements } from "../measurementModal/typesOfMeasurementsSlice";
import { Loader } from "../../components/Loader/Loader";
import { GetMeasurementsErrorNotification } from "../../components/GetMeasurementsErrorNotification/GetMeasurementsErrorNotification";

export const DiaryTable = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  console.log("Diary");

  const dispatchMeasurementsAndTypesOfMeasurements = () => {
    dispatch(fetchGetMeasurements());
    dispatch(recieveTypesOfMeasurements());
  };

  const dispatchFilteredMeasurements = (data: number) => {
    dispatch(recieveFilteredMeasurements(data));
    navigate("./daily");
  };

  const dispatchRemoveMeasurement = (id: string) => {
    dispatch(fetchRemoveMeasurement(id));
  };

  const dispatchEditMeasurementSync = async (data: MeasurementData) => {
    const response = await dispatch(fetchEditMeasurement(data));
    return response;
  };

  const measurements = useAppSelector(
    (state) => state.measurements.measurements
  );

  const getMeasurementsStatus = useAppSelector(
    (state) => state.measurements.checkoutGetMeasurementsState
  );

  const typesOfMeasurement = useAppSelector(
    (state) => state.typesOfMeasurements.typesOfMeasurements
  );

  const getTypesOfMeasurementStatus = useAppSelector(
    (state) => state.typesOfMeasurements.checkoutState
  );

  const editMeasurementsErrorStatus = useAppSelector(
    (state) => state.measurements.checkoutEditMeasurementState
  );

  const measurementsError = useAppSelector(
    (state) => state.measurements.errorGetMeasurementsMessage
  );

  const typesOfMeasurementsError = useAppSelector(
    (state) => state.typesOfMeasurements.errorMessage
  );

  // const dispatchAfterMealMeasurement = (data: afterMealMeasurementData) => {
  //   dispatch(afterMealMeasurementSlice.actions.editAfterMealMeasurement(data));
  // };

  useEffect(() => {
    dispatchMeasurementsAndTypesOfMeasurements();
  }, []);

  if (
    getMeasurementsStatus === "LOADING" ||
    getTypesOfMeasurementStatus === "LOADING"
  ) {
    return (
      <Box
        sx={{
          position: "absolute",
          width: "10vw",
          height: "10vh",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Loader />
      </Box>
    );
  }

  if (
    getMeasurementsStatus === "ERROR" ||
    getTypesOfMeasurementStatus === "ERROR"
  ) {
    let error = "";
    if (measurementsError === "" || typesOfMeasurementsError === "") {
      error = measurementsError ? measurementsError : typesOfMeasurementsError;
    } else if (
      measurementsError === "Server error" &&
      typesOfMeasurementsError === "Server error"
    ) {
      error = measurementsError;
    } else {
      error =
        measurementsError !== "Server error"
          ? measurementsError
          : typesOfMeasurementsError;
    }
    return (
      <GetMeasurementsErrorNotification
        // measurementsError={measurementsError}
        // typesOfMeasurementsError={typesOfMeasurementsError}
        errorMessage={error}
        refetch={dispatchMeasurementsAndTypesOfMeasurements}
      />
    );
  }

  return (
    <>
      <Table
        rows={measurements}
        editStatus={editMeasurementsErrorStatus}
        // getTypesOfMeasurementStatus={getTypesOfMeasurementStatus}
        // getMeasurementsStatus={getMeasurementsStatus}
        typesOfMeasurement={typesOfMeasurement}
        dispatchFilteredMeasurements={dispatchFilteredMeasurements}
        dispatchRemoveMeasurement={dispatchRemoveMeasurement}
        dispatchEditMeasurementSync={dispatchEditMeasurementSync}
        // dispatchAfterMealMeasurement={dispatchAfterMealMeasurement}
      />
      <Button onClick={handleOpen} variant="contained">
        add measurement
      </Button>
      <MeasurementModal open={open} handleClose={handleClose} />
    </>
  );
};
