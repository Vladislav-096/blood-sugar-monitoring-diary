import {
  Box,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import { Meals, Measurement } from "../../app/measurements";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import styles from "./measurementRenderCells.module.scss";
import { scrollBarStyles } from "../../constants/constants";

interface MeasurementRenderCells {
  row: Measurement;
}

const afterMealMeasurementTooltipStyles = {
  padding: "20px",
  border: "1px solid #9198a1",
  borderRadius: "4px",
  backgroundColor: "#0d1117",
  color: "#f0f6fc",
};

export const MeasurementRenderCells = ({ row }: MeasurementRenderCells) => {
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      ...afterMealMeasurementTooltipStyles,
      fontSize: theme.typography.pxToRem(14),
    },
  }));

  if (row.typeOfMeasurement === "2" && row.afterMealMeasurement) {
    const meals: Meals = row.afterMealMeasurement?.meal;

    return (
      <Box>
        <Typography
          component="span"
          sx={{
            paddingRight: "5px",
            // fontSize: "14px",
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
                    <span className={styles.dish}>{`${item.dish}:`}</span>
                    <span
                      className={styles.portion}
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
