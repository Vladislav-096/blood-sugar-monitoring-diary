import { Box, Typography } from "@mui/material";
import { Meals, Measurement } from "../../app/measurements";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import styles from "./measurementRenderCells.module.scss";
import { scrollBarStyles } from "../../constants/constants";
import { HtmlTooltip } from "../HtmlTooltip/HtmlTooltip";
import InfoIcon from "@mui/icons-material/Info";

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
                    <Box className={styles.descr}>
                      {item.statistic && (
                        <Box sx={{ display: "inline-block" }}>
                          <HtmlTooltip
                            title={
                              <Box
                                sx={scrollBarStyles}
                                className={`${styles.list} list-reset`}
                              >
                                {Object.entries(item.statistic).map(
                                  ([key, value], fieldIndex) =>
                                    key !== "id" && (
                                      <Box
                                        key={fieldIndex}
                                        className={styles["list-item"]}
                                      >
                                        <span className={styles.descr}>
                                          {`${key}:`}
                                        </span>
                                        <span className={styles.value}>
                                          {`${value} ${
                                            ![
                                              "comment",
                                              "calories",
                                              "id",
                                            ].includes(key)
                                              ? "g"
                                              : ""
                                          }`}
                                        </span>
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
