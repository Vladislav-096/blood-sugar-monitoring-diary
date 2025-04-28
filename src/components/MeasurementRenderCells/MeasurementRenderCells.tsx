import { Box, Typography } from "@mui/material";
import { Meals, Measurement } from "../../app/measurements";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import styles from "./measurementRenderCells.module.scss";
import { statisticContentStyles } from "../../constants/constants";
import { HtmlTooltip } from "../HtmlTooltip/HtmlTooltip";
import InfoIcon from "@mui/icons-material/Info";
import { StatisticTooltipContent } from "../StatisticTooltipContent/StatisticTooltipContent";

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
              <Box sx={statisticContentStyles} className="list-reset">
                {meals.map((item, index) => (
                  <Box key={index} className={styles["list-item"]}>
                    <Box className={styles.descr}>
                      {item.statistic && (
                        <Box sx={{ display: "inline-block" }}>
                          <HtmlTooltip
                            title={
                              <Box
                                sx={statisticContentStyles}
                                className="list-reset"
                              >
                                {Object.entries(item.statistic).map(
                                  ([key, value], fieldIndex) =>
                                    key !== "id" && (
                                      <Box key={fieldIndex}>
                                        <StatisticTooltipContent
                                          name={key}
                                          value={value}
                                        />
                                      </Box>
                                    )
                                )}
                              </Box>
                            }
                          >
                            <InfoIcon
                              fontSize="small"
                              sx={{ marginRight: "3px" }}
                            />
                          </HtmlTooltip>
                        </Box>
                      )}

                      <Box
                        sx={{ display: "inline-block" }}
                      >{`${item.dish}:`}</Box>
                    </Box>
                    <Box className={styles.value}>{`${item.portion} g`}</Box>
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
