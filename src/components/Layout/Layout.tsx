import { BrowserRouter } from "react-router";
import { Main } from "../Main/Main";

export const Layout = () => {
  return (
    <BrowserRouter>
      <div className="page">
        <Main />
      </div>
    </BrowserRouter>
  );
};
