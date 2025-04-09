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

interface MeasurementRenderCells {
  row: Measurement;
}

export const MeasurementRenderCells = ({ row }: MeasurementRenderCells) => {
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  if (row.typeOfMeasurement === "2" && row.afterMealMeasurement) {
    const meals: Meals = row.afterMealMeasurement?.meal;

    return (
      <Box>
        <Typography
          component="span"
          sx={{
            paddingRight: "25px",
            // fontSize: "14px",
          }}
        >
          {row.measurement}
        </Typography>
        <HtmlTooltip
          title={
            <>
              {meals.map((item, index) => (
                <li key={index}>
                  <span>{item.dish}</span> <span>{item.portion}</span>
                </li>
              ))}
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
