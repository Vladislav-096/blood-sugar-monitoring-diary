import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

const afterMealMeasurementTooltipStyles = {
  padding: "20px",
  border: "1px solid #9198a1",
  borderRadius: "4px",
  backgroundColor: "#0d1117",
  color: "#f0f6fc",
};

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    ...afterMealMeasurementTooltipStyles,
    fontSize: theme.typography.pxToRem(14),
  },
}));
