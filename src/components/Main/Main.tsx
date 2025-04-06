import { Route, Routes } from "react-router";
import { MainPage } from "../../pages/MainPage/MainPage";

export const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </main>
  );
};
