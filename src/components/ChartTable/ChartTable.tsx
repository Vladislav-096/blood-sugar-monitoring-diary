import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { getDateStringFromUnix } from "../../utils/getDateTimeStringFromUnix";
import { dataGridStylesTest } from "../../constants/constants";

interface Rows {
  date: number;
  measurement: number;
}

interface ChartTable {
  rows: Rows[];
}

export const ChartTable = ({ rows }: ChartTable) => {
  const [filteredRows, setFilteredRows] = useState<Rows[]>(rows);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
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
        height: "100%",
        // marginRight: "15px",
      }}
    >
      <DataGrid
        rows={filteredRows}
        columns={columns}
        paginationModel={paginationModel}
        pageSizeOptions={[5]}
        sx={dataGridStylesTest}
        onPaginationModelChange={handlePaginationModelChange}
        hideFooterSelectedRowCount
        disableColumnMenu
        localeText={{
          noRowsLabel: "No measurements", // Ваш кастомный текст
        }}
      />
    </Paper>
  );
};
