import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Box, Button } from "@mui/material";
import { MeasurementModal } from "../measurementModal/MeasurementModal";
import {
  fetchEditMeasurement,
  // fetchGetMeasurements,
  fetchRemoveMeasurement,
} from "../shared/slices/measurementsSlice";
import { MeasurementsTable } from "../../components/MeasurementsTable/MeasurementsTable";
import { MeasurementData } from "../../types/types";
// import { recieveTypesOfMeasurements } from "../measurementModal/typesOfMeasurementsSlice";
// import { Loader } from "../../components/Loader/Loader";
// import { GetMeasurementsErrorNotification } from "../../components/GetMeasurementsErrorNotification/GetMeasurementsErrorNotification";
// import { requestErrorInitial } from "../../constants/constants";
import { getTimeStringFromUnix } from "../../utils/getDateTimeStringFromUnix";
import { PagesCommonProps } from "../shared/pagesCommon/PagesCommon";

export const MainPageComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useAppDispatch();

  console.log("MainPageComponent");

  // const dispatchMeasurementsAndTypesOfMeasurements = () => {
  //   dispatch(fetchGetMeasurements());
  //   dispatch(recieveTypesOfMeasurements());
  // };

  // 2
  const dispatchRemoveMeasurement = (id: string) => {
    dispatch(fetchRemoveMeasurement(id));
  };

  // 3
  // Как то бы вевысти тип из этой функции. Но я его не экспортировать не могу отсюда,
  // не передать пропсом (типы же пропросм нельзя передать?)
  const dispatchEditMeasurementSync = async (data: MeasurementData) => {
    const response = await dispatch(fetchEditMeasurement(data));
    return response;
  };

  const measurements = useAppSelector(
    (state) => state.measurements.measurements
  );

  // const getMeasurementsStatus = useAppSelector(
  //   (state) => state.measurements.checkoutGetMeasurementsState
  // );

  // 4
  const typesOfMeasurement = useAppSelector(
    (state) => state.typesOfMeasurements.typesOfMeasurements
  );

  // 5
  const removeMeasurementStatus = useAppSelector(
    (state) => state.measurements.checkoutRemoveMeasurementState
  );

  // const getTypesOfMeasurementStatus = useAppSelector(
  //   (state) => state.typesOfMeasurements.checkoutState
  // );

  // 6
  const editMeasurementsStatus = useAppSelector(
    (state) => state.measurements.checkoutEditMeasurementState
  );

  // const getMeasurementsError = useAppSelector(
  //   (state) => state.measurements.errorGetMeasurements
  // );

  // const typesOfMeasurementsError = useAppSelector(
  //   (state) => state.typesOfMeasurements.error
  // );

  // useEffect(() => {
  //   dispatchMeasurementsAndTypesOfMeasurements();
  // }, []);

  // if (
  //   getMeasurementsStatus === "LOADING" ||
  //   getTypesOfMeasurementStatus === "LOADING"
  // ) {
  //   return (
  //     <Box
  //       sx={{
  //         position: "absolute",
  //         width: "10vw",
  //         height: "10vh",
  //         top: "50%",
  //         left: "50%",
  //         transform: "translate(-50%, -50%)",
  //       }}
  //     >
  //       <Loader />
  //     </Box>
  //   );
  // }

  // if (
  //   getMeasurementsStatus === "ERROR" ||
  //   getTypesOfMeasurementStatus === "ERROR"
  // ) {
  //   let error = requestErrorInitial;
  //   if (
  //     getMeasurementsError.message === "" ||
  //     typesOfMeasurementsError.message === ""
  //   ) {
  //     error = getMeasurementsError.message
  //       ? getMeasurementsError
  //       : typesOfMeasurementsError;
  //   } else if (
  //     getMeasurementsError.code === "500" &&
  //     typesOfMeasurementsError.code === "500"
  //   ) {
  //     error = getMeasurementsError;
  //   } else {
  //     error =
  //       getMeasurementsError.code !== "500"
  //         ? getMeasurementsError
  //         : typesOfMeasurementsError;
  //   }
  //   return (
  //     <GetMeasurementsErrorNotification
  //       // measurementsErrorMessage={measurementsErrorMessage}
  //       // typesOfMeasurementsError={typesOfMeasurementsError}
  //       error={error}
  //       refetch={dispatchMeasurementsAndTypesOfMeasurements}
  //     />
  //   );
  // }

  const formattedMeasurements = [...measurements].map((item) => {
    return { ...item, time: getTimeStringFromUnix(item.createdAt) };
  });

  return (
    <PagesCommonProps>
      <MeasurementsTable
        rows={formattedMeasurements}
        editStatus={editMeasurementsStatus}
        removeStatus={removeMeasurementStatus}
        // getTypesOfMeasurementStatus={getTypesOfMeasurementStatus}
        // getMeasurementsStatus={getMeasurementsStatus}
        typesOfMeasurement={typesOfMeasurement}
        dispatchRemoveMeasurement={dispatchRemoveMeasurement}
        dispatchEditMeasurementSync={dispatchEditMeasurementSync}
      />
      <Box sx={{ marginTop: "15px", textAlign: "center" }}>
        <Button onClick={handleOpen} variant="contained">
          add measurement
        </Button>
      </Box>
      <MeasurementModal open={open} handleClose={handleClose} />
    </PagesCommonProps>
  );
};
