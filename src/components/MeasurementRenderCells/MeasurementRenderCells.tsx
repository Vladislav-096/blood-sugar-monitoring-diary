import { Box, Typography } from "@mui/material";
import { Meals, Measurement } from "../../app/measurements";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import styles from "./measurementRenderCells.module.scss";
import { scrollBarStyles } from "../../constants/constants";
import { HtmlTooltip } from "../HtmlTooltip/HtmlTooltip";

interface MeasurementRenderCells {
  row: Measurement;
}

export const MeasurementRenderCells = ({ row }: MeasurementRenderCells) => {
  if (row.typeOfMeasurement === "2" && row.afterMealMeasurement) {
    const meals: Meals = row.afterMealMeasurement?.meal;

    return (
      <Box>
        <Typography
          component="span"
          sx={{
            paddingRight: "5px",
          }}
        >
          {row.measurement}
        </Typography>
        <HtmlTooltip
          title={
            <>
              <Box sx={scrollBarStyles} className={`${styles.list} list-reset`}>
                {meals.map((item, index) => (
                  <Box key={index} className={styles["list-item"]}>
                    <span className={styles.descr}>{`${item.dish}:`}</span>
                    <span
                      className={styles.value}
                    >{`${item.portion} g`}</span>
                  </Box>
                ))}
              </Box>
            </>
          }
        >
          <AnnouncementIcon />
        </HtmlTooltip>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        component="span"
        sx={{
          paddingRight: "25px",
          fontSize: "15px",
        }}
      >
        {row.measurement}
      </Typography>
    </Box>
  );
};
