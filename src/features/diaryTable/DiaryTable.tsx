import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "@mui/material";
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

export const DiaryTable = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const dispatchFilteredMeasurements = (data: number) => {
    dispatch(recieveFilteredMeasurements(data));
    navigate("./daily");
  };

  const dispatchRemoveMeasurement = (id: string) => {
    dispatch(fetchRemoveMeasurement(id));
  };

  const dispatchEditMeasurement = (data: MeasurementData) => {
    dispatch(fetchEditMeasurement(data));
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

  const typesOfMeasurementStatus = useAppSelector(
    (state) => state.typesOfMeasurements.checkoutState
  );

  // const dispatchAfterMealMeasurement = (data: afterMealMeasurementData) => {
  //   dispatch(afterMealMeasurementSlice.actions.editAfterMealMeasurement(data));
  // };

  useEffect(() => {
    dispatch(recieveTypesOfMeasurements());
    dispatch(fetchGetMeasurements());
  }, []);

  if (
    getMeasurementsStatus === "LOADING" ||
    typesOfMeasurementStatus === "LOADING"
  ) {
    return <div style={{ color: "white" }}>Загрузочка</div>;
  }

  if (
    getMeasurementsStatus === "ERROR" ||
    typesOfMeasurementStatus === "ERROR"
  ) {
    return <div style={{ color: "white" }}>Ошибочка</div>;
  }

  return (
    <>
      <Table
        rows={measurements}
        // typesOfMeasurementStatus={typesOfMeasurementStatus}
        // getMeasurementsStatus={getMeasurementsStatus}
        typesOfMeasurement={typesOfMeasurement}
        dispatchFilteredMeasurements={dispatchFilteredMeasurements}
        dispatchRemoveMeasurement={dispatchRemoveMeasurement}
        dispatchEditMeasurement={dispatchEditMeasurement}
        // dispatchAfterMealMeasurement={dispatchAfterMealMeasurement}
      />
      <Button onClick={handleOpen} variant="contained">
        open modal
      </Button>
      <MeasurementModal open={open} handleClose={handleClose} />
    </>
  );
};
