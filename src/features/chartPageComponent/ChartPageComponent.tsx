import ReactECharts from "echarts-for-react";
import { useAppSelector } from "../../app/hooks";
import {
  getDateStringFromUnix,
  getTimeStringFromUnix,
} from "../../utils/getDateTimeStringFromUnix";
import { PagesCommonProps } from "../shared/pagesCommon/PagesCommon";
import { ChartTable } from "../../components/ChartTable/ChartTable";
import { useEffect, useMemo, useState } from "react";
import styles from "./chartPageComponent.module.scss";
import { SelectDateRange } from "../../components/SelectDateRange/SelectDateRange";
import { DateRangeChart, DateRangeTableRow } from "../../types/types";
import { convertTimestampToDate } from "../../utils/dateTimeConvert";

export const ChartPageComponent = () => {
  const [dateStart, setDateStart] = useState<string>(""); // YYYY-MM-DD
  const [dateEnd, setDateEnd] = useState<string>(""); // YYYY-MM-DD
  const [tableDateRange, setTableDateRange] = useState<DateRangeTableRow[]>([]);
  const [chartDateRange, setChartDateRange] = useState<DateRangeChart[]>([]);

  const measurements = useAppSelector(
    (state) => state.measurements.measurements
  );

  const sortedMeasurementsByDate = useMemo(() => {
    return [...measurements].sort((a, b) => a.createdAt - b.createdAt);
  }, [measurements]);

  const chartData: DateRangeChart[] = useMemo(() => {
    return [...sortedMeasurementsByDate].map((item) => {
      return {
        x: `${getDateStringFromUnix(item.createdAt)}, ${getTimeStringFromUnix(
          item.createdAt
        )}`,
        y: item.measurement,
      };
    });
  }, [sortedMeasurementsByDate]);

  const option = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      data: chartDateRange.map((item) => item.x),
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
        data: chartDateRange.map((item) => item.y),
      },
    ],
  };

  const formattedMeasurements: DateRangeTableRow[] = useMemo(() => {
    return [...sortedMeasurementsByDate].map((item) => {
      return {
        id: item.id,
        date: item.createdAt,
        measurement: item.measurement,
      };
    });
  }, [sortedMeasurementsByDate]);

  const setInitialValues = () => {
    if (chartData.length > 0 && formattedMeasurements.length > 0) {
      const firstDate = sortedMeasurementsByDate[0].createdAt;
      const lastDate =
        sortedMeasurementsByDate[sortedMeasurementsByDate.length - 1].createdAt;

      setDateStart(convertTimestampToDate(firstDate));
      setDateEnd(convertTimestampToDate(lastDate));
      setTableDateRange(formattedMeasurements);
      setChartDateRange(chartData);
    }
  };

  useEffect(() => {
    setInitialValues();
  }, [chartData, formattedMeasurements]);

  return (
    <PagesCommonProps>
      <SelectDateRange
        initialMinDate={convertTimestampToDate(
          sortedMeasurementsByDate[0]?.createdAt
        )}
        initialMaxDate={convertTimestampToDate(
          sortedMeasurementsByDate[sortedMeasurementsByDate.length - 1]
            ?.createdAt
        )}
        setInitialValues={setInitialValues}
        dateStart={dateStart}
        dateEnd={dateEnd}
        tableDateRange={tableDateRange}
        setDateStart={setDateStart}
        setDateEnd={setDateEnd}
        setTableDateRange={setTableDateRange}
        setChartDateRange={setChartDateRange}
      />
      <ReactECharts option={option} className={styles.chart} />
      <ChartTable rows={tableDateRange} />
    </PagesCommonProps>
  );
};
