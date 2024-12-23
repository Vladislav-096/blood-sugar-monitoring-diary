import { Route, Routes } from "react-router";
import { MainPage } from "../../pages/MainPage/MainPage";
import { TablePage } from "../../pages/TablePage/TablePage";

export const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/measurements" element={<TablePage />} />
      </Routes>
    </main>
  );
};
