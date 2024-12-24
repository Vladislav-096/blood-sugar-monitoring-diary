import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="container">
      <Link to={"/"} style={{ marginRight: "22px" }}>
        main
      </Link>
      <Link to={"/daily"}>measurements</Link>
    </div>
  );
};
