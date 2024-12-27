import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "@mui/material";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";
import { recieveMeasurements } from "./measurementsSlice";
import { recieveFilteredMeasurements } from "./oneDayMeasurementsSlice";
import { useNavigate } from "react-router";

export const DiaryTable = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(recieveMeasurements());
  }, [dispatch]);

  const dispatchFilteredMeasurements = (data: number) => {
    dispatch(recieveFilteredMeasurements(data));
    navigate("./daily");
  };

  const measurements = useAppSelector(
    (state) => state.measurements.measurements
  );

  return (
    <>
      <div>
        {measurements.map((item, index) => (
          <div
            key={index}
            onClick={() => dispatchFilteredMeasurements(item.createdAt || 0)}
          >
            {item.id}
          </div>
        ))}
      </div>
      <Button onClick={handleOpen} variant="contained">
        open modal
      </Button>
      <MeasurementModal open={open} handleClose={handleClose} />
    </>
  );
};
