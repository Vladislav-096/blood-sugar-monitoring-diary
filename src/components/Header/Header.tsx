import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./header.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Box className="container">
        <Link to={"/"} style={{ marginRight: "22px" }}>
          Main
        </Link>
      </Box>
    </header>
  );
};
