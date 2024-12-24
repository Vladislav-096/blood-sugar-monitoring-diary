import { useEffect, useState } from "react";
import { recieveMeasurements } from "./diaryTableSlice";
import { useAppDispatch } from "../../app/hooks";
import { Button } from "@mui/material";
import { CreateMeasurementModal } from "../../components/CreateMeasurementModal/CreateMeasurementModal";

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
      <CreateMeasurementModal open={open} handleClose={handleClose} />
    </>
  );
};
