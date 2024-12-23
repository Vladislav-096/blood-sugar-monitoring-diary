import { useEffect } from "react";
import { recieveMeasurements } from "./diaryDataSlice";
import { useAppDispatch } from "../../app/hooks";

export const DiaryData = () => {
  console.log("render");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(recieveMeasurements());
  }, [dispatch]);

  // const stateCheck = useAppSelector((state) => {
  //   return state.measurements;
  // });

  // const handleClick = () => {
  //   console.log("stateCheck", stateCheck);
  // };

  return (
    <div>
      <button>click</button>
    </div>
  );
};
