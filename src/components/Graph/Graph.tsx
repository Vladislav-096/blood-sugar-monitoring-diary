import ReactECharts from "echarts-for-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getDateStringFromUnix } from "../../utils/getDateStringFromUnix";
import { requestErrorInitial } from "../../constants/constants";
import { Box } from "@mui/material";
import { Loader } from "../Loader/Loader";
import { GetMeasurementsErrorNotification } from "../GetMeasurementsErrorNotification/GetMeasurementsErrorNotification";
import { fetchGetMeasurements } from "../../features/shared/slices/measurementsSlice";
import { recieveTypesOfMeasurements } from "../../features/measurementModal/typesOfMeasurementsSlice";
import { useEffect } from "react";

export const Graph = () => {
  // test
  const dispatch = useAppDispatch();

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

  const dispatchMeasurementsAndTypesOfMeasurements = () => {
    dispatch(fetchGetMeasurements());
    dispatch(recieveTypesOfMeasurements());
  };
  // test

  const measurements = useAppSelector(
    (state) => state.measurements.measurements
  );

  const data = [...measurements]
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((item) => {
      return {
        x: `${getDateStringFromUnix(item.createdAt)}, ${item.time}`,
        y: item.measurement,
      };
    });

  console.log(measurements);

  const option = {
    title: {
      text: "График",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      // type: "category",
      data: data.map((item) => item.x),
    },
    yAxis: {
      type: "value",
    },
    dataZoom: [
      {
        type: "slider",
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: "Measurement",
        type: "line",
        showSymbol: true,
        data: data.map((item) => item.y),
      },
    ],
  };

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
    <div style={{ width: "100%", height: "400px" }}>
      <ReactECharts option={option} style={{ height: "100%" }} />
    </div>
  );
};
