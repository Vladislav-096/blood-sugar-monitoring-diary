import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { getDateStringFromUnix } from "../../utils/getDateTimeStringFromUnix";
import { dataGridStylesTest } from "../../constants/constants";
import { DateRangeTableRow } from "../../types/types";

interface ChartTable {
  rows: DateRangeTableRow[];
}

const tablePageSize = 5;

export const ChartTable = ({ rows }: ChartTable) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: tablePageSize,
  });

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      valueFormatter: (value) => getDateStringFromUnix(value),
      width: 100,
    },
    {
      field: "measurement",
      headerName: "Measurement",
      width: 155,
    },
  ];

  const handlePaginationModelChange = (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPaginationModel(newPaginationModel);
  };

  return (
    <Paper
      sx={{
        margin: "0 auto",
        width: "260px",
        height: "calc(44.4vh - 45px)",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        pageSizeOptions={[tablePageSize]}
        sx={dataGridStylesTest}
        onPaginationModelChange={handlePaginationModelChange}
        hideFooterSelectedRowCount
        disableColumnMenu
        disableColumnSorting={true}
        localeText={{
          noRowsLabel: "No measurements",
        }}
      />
    </Paper>
  );
};
