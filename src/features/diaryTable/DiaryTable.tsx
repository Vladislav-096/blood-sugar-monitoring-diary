import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "@mui/material";
import { MeasurementModal } from "../measurementModal/MeasurementModal";
import { fetchGetMeasurements } from "../shared/slices/measurementsSlice";
import { recieveFilteredMeasurements } from "./oneDayMeasurementsSlice";
import { useNavigate } from "react-router";
import { Table } from "../../components/Table/Table";

export const DiaryTable = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchGetMeasurements());
  }, [dispatch]);

  const dispatchFilteredMeasurements = (data: number) => {
    dispatch(recieveFilteredMeasurements(data));
    navigate("./daily");
  };

  const measurements = useAppSelector(
    (state) => state.measurements.measurements
  );

  const typesOfMeasurement = useAppSelector(
    (state) => state.typesOfMeasurements.typesOfMeasurements
  );

  console.log("measurements", measurements);

  return (
    <>
      <Table
        rows={measurements}
        typesOfMeasurement={typesOfMeasurement}
        dispatchFilteredMeasurements={dispatchFilteredMeasurements}
      />
      <Button onClick={handleOpen} variant="contained">
        open modal
      </Button>
      <MeasurementModal open={open} handleClose={handleClose} />
    </>
  );
};
