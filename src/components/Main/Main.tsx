import { Route, Routes } from "react-router";
import { MainPage } from "../../pages/MainPage/MainPage";
import { ChartPage } from "../../pages/ChartPage/ChartPage";

export const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/graph" element={<ChartPage />} />
      </Routes>
    </main>
  );
};
