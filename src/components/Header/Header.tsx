import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import styles from "./header.module.scss";
import { scrollBarStyles } from "../../constants/constants";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Box className="container">
        <Box
          sx={{
            maxWidth: "300px",
            overflowX: "auto",
            ...scrollBarStyles,
          }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Main
          </NavLink>
          <NavLink
            to="/graph"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Chart
          </NavLink>
          {/* <Link className={styles.link} to={"/"}>
            Main
          </Link>
          <Link className={styles.link} to={"/graph"}>
            Graph
          </Link> */}
        </Box>
      </Box>
    </header>
  );
};
