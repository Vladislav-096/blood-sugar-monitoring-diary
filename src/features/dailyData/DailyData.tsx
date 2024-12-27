import { useAppSelector } from "../../app/hooks";

export const DailyData = () => {
  const filteredMeasurements = useAppSelector(
    (state) => state.oneDayMeasurementsSlice.oneDayMeasurements
  );

  console.log("filteredMeasurements", filteredMeasurements);

  return (
    <>
      {filteredMeasurements.map((item, index) => (
        <div key={index}>{item.createdAt}</div>
      ))}
    </>
  );
};
