import { Route, Routes } from "react-router";
import { MainPage } from "../../pages/MainPage/MainPage";
import { DailyPage } from "../../pages/DailyPage/DailyPage";

export const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/daily" element={<DailyPage />} />
      </Routes>
    </main>
  );
};
