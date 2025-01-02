import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="container">
      <Link to={"/"} style={{ marginRight: "22px" }}>
        Main
      </Link>
      <Link to={"/daily"}>Daily</Link>
    </div>
  );
};
