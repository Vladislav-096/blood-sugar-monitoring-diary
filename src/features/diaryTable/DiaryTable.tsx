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
import { requestErrorInitial } from "../../constants/constants";

export const DiaryTable = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();

  console.log("Diary");

  const dispatchMeasurementsAndTypesOfMeasurements = () => {
    dispatch(fetchGetMeasurements());
    dispatch(recieveTypesOfMeasurements());
  };

  const dispatchRemoveMeasurement = (id: string) => {
    dispatch(fetchRemoveMeasurement(id));
  };

  // Как то бы вевысти тип из этой функции. Но я его не экспортировать не могу отсюда,
  // не передать пропсом (типы же пропросм нельзя передать?)
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

  const removeMeasurementStatus = useAppSelector(
    (state) => state.measurements.checkoutRemoveMeasurementState
  );

  const getTypesOfMeasurementStatus = useAppSelector(
    (state) => state.typesOfMeasurements.checkoutState
  );

  const editMeasurementsStatus = useAppSelector(
    (state) => state.measurements.checkoutEditMeasurementState
  );

  const getMeasurementsError = useAppSelector(
    (state) => state.measurements.errorGetMeasurements
  );

  const typesOfMeasurementsError = useAppSelector(
    (state) => state.typesOfMeasurements.error
  );

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
    let error = requestErrorInitial;
    if (
      getMeasurementsError.message === "" ||
      typesOfMeasurementsError.message === ""
    ) {
      error = getMeasurementsError.message
        ? getMeasurementsError
        : typesOfMeasurementsError;
    } else if (
      getMeasurementsError.code === "500" &&
      typesOfMeasurementsError.code === "500"
    ) {
      error = getMeasurementsError;
    } else {
      error =
        getMeasurementsError.code !== "500"
          ? getMeasurementsError
          : typesOfMeasurementsError;
    }
    return (
      <GetMeasurementsErrorNotification
        // measurementsErrorMessage={measurementsErrorMessage}
        // typesOfMeasurementsError={typesOfMeasurementsError}
        error={error}
        refetch={dispatchMeasurementsAndTypesOfMeasurements}
      />
    );
  }

  return (
    <>
      <Table
        rows={measurements}
        editStatus={editMeasurementsStatus}
        removeStatus={removeMeasurementStatus}
        // getTypesOfMeasurementStatus={getTypesOfMeasurementStatus}
        // getMeasurementsStatus={getMeasurementsStatus}
        typesOfMeasurement={typesOfMeasurement}
        dispatchRemoveMeasurement={dispatchRemoveMeasurement}
        dispatchEditMeasurementSync={dispatchEditMeasurementSync}
      />
      <Button onClick={handleOpen} variant="contained">
        add measurement
      </Button>
      <MeasurementModal open={open} handleClose={handleClose} />
    </>
  );
};
