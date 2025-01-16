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
import { EditMeasurement } from "../../types/types";
import {
  afterMealMeasurementData,
  afterMealMeasurementSlice,
} from "./afterMealMeasurementSlice";
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

  const dispatchEditMeasurement = (data: EditMeasurement) => {
    dispatch(fetchEditMeasurement(data));
  };

  const measurements = useAppSelector(
    (state) => state.measurements.measurements
  );

  const typesOfMeasurement = useAppSelector(
    (state) => state.typesOfMeasurements.typesOfMeasurements
  );

  const dispatchAfterMealMeasurement = (data: afterMealMeasurementData) => {
    dispatch(afterMealMeasurementSlice.actions.editAfterMealMeasurement(data));
  };

  useEffect(() => {
    dispatch(recieveTypesOfMeasurements());
    dispatch(fetchGetMeasurements());
  }, []);

  return (
    <>
      <Table
        rows={measurements}
        typesOfMeasurement={typesOfMeasurement}
        dispatchFilteredMeasurements={dispatchFilteredMeasurements}
        dispatchRemoveMeasurement={dispatchRemoveMeasurement}
        dispatchEditMeasurement={dispatchEditMeasurement}
        dispatchAfterMealMeasurement={dispatchAfterMealMeasurement}
      />
      <Button onClick={handleOpen} variant="contained">
        open modal
      </Button>
      <MeasurementModal open={open} handleClose={handleClose} />
    </>
  );
};
