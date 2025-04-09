import { Route, Routes } from "react-router";
import { MainPage } from "../../pages/MainPage/MainPage";
import { GraphPage } from "../../pages/GraphPage/GraphPage";

export const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/graph" element={<GraphPage />} />
      </Routes>
    </main>
  );
};
