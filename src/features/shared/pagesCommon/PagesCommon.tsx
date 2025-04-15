import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { GetMeasurementsErrorNotification } from "../../../components/GetMeasurementsErrorNotification/GetMeasurementsErrorNotification";
import { requestErrorInitial } from "../../../constants/constants";
import { Box } from "@mui/material";
import { fetchGetMeasurements } from "../slices/measurementsSlice";
import { recieveTypesOfMeasurements } from "../../measurementModal/typesOfMeasurementsSlice";
import { Loader } from "../../../components/Loader/Loader";

interface PagesCommonProps {
  children: React.ReactNode;
}

export const PagesCommonProps = ({ children }: PagesCommonProps) => {
  const dispatch = useAppDispatch();

  const dispatchMeasurementsAndTypesOfMeasurements = () => {
    dispatch(fetchGetMeasurements());
    dispatch(recieveTypesOfMeasurements());
  };

  const getMeasurementsStatus = useAppSelector(
    (state) => state.measurements.checkoutGetMeasurementsState
  );

  const getTypesOfMeasurementStatus = useAppSelector(
    (state) => state.typesOfMeasurements.checkoutState
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

  return <>{children}</>;
};
