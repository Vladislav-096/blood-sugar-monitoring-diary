import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

export const CustomTableToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
};
