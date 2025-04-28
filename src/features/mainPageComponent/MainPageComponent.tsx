import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Box, Button } from "@mui/material";
import {
  fetchEditMeasurement,
  fetchRemoveMeasurement,
} from "../shared/slices/measurementsSlice";
import { MeasurementsTable } from "../../components/MeasurementsTable/MeasurementsTable";
import { getTimeStringFromUnix } from "../../utils/getDateTimeStringFromUnix";
import { PagesCommonProps } from "../shared/pagesCommon/PagesCommon";
import { Measurement } from "../../app/measurements";
import { AddMeasurementModal } from "../addMeasurementModal/AddMeasurementModal";

export const MainPageComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useAppDispatch();

  const dispatchRemoveMeasurement = (id: string) => {
    dispatch(fetchRemoveMeasurement(id));
  };

  const dispatchEditMeasurementSync = async (data: Measurement) => {
    const response = await dispatch(fetchEditMeasurement(data));
    return response;
  };

  const measurements = useAppSelector(
    (state) => state.measurements.measurements
  );
  const typesOfMeasurement = useAppSelector(
    (state) => state.typesOfMeasurements.typesOfMeasurements
  );

  const removeMeasurementStatus = useAppSelector(
    (state) => state.measurements.checkoutRemoveMeasurementState
  );

  const editMeasurementsStatus = useAppSelector(
    (state) => state.measurements.checkoutEditMeasurementState
  );

  const formattedMeasurements = useMemo(() => {
    return measurements.map((item) => ({
      ...item,
      time: getTimeStringFromUnix(item.createdAt),
    }));
  }, [measurements]);

  return (
    <PagesCommonProps>
      <MeasurementsTable
        rows={formattedMeasurements}
        editStatus={editMeasurementsStatus}
        removeStatus={removeMeasurementStatus}
        typesOfMeasurement={typesOfMeasurement}
        dispatchRemoveMeasurement={dispatchRemoveMeasurement}
        dispatchEditMeasurementSync={dispatchEditMeasurementSync}
      />
      <Box sx={{ marginTop: "15px", textAlign: "center" }}>
        <Button onClick={handleOpen} variant="contained">
          add measurement
        </Button>
      </Box>
      <AddMeasurementModal open={open} handleClose={handleClose} />
    </PagesCommonProps>
  );
};
