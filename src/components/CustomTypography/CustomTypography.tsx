import { Typography } from "@mui/material";
import { ElementType } from "react";

interface CustomTypography {
  componentProp?: ElementType;
  color?: string;
  styles?: Record<string, string>;
  text: string | number;
}

export const CustomTypography = ({
  componentProp = "p",
  color = "#010409",
  styles,
  text,
}: CustomTypography) => {
  return (
    <Typography
      component={componentProp}
      sx={{ fontFamily: '"Play"', color, ...styles }}
    >
      {text}
    </Typography>
  );
};
