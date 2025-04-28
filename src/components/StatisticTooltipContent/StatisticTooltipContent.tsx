import { Box } from "@mui/material";
import styles from "./statisticTooltipContent.module.scss";

interface StatisticTooltipContent {
  name: string;
  value: string | number;
}

export const StatisticTooltipContent = ({
  name,
  value,
}: StatisticTooltipContent) => {
  return (
    <Box className={styles["list-item"]}>
      <span className={styles.descr}>{`${name}:`}</span>
      <span className={styles.value}>
        {`${value} ${!["comment", "calories", "id"].includes(name) ? "g" : ""}`}
      </span>
    </Box>
  );
};
