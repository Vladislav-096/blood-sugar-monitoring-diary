import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Button } from "@mui/material";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";
import { recieveMeasurements } from "../../components/MeasurementModal/measurementsSlice";

export const DiaryTable = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(recieveMeasurements());
  }, [dispatch]);

  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        open modal
      </Button>
      <MeasurementModal open={open} handleClose={handleClose} />
    </>
  );
};
