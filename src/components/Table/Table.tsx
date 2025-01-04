import {
  Meals,
  Measurement,
  TypesOfMeasurements,
} from "../../app/measurements";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getDateStringFromUnix } from "../../utils/getDateStringFromUnix";
import { Button, Paper, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { useState } from "react";

interface Table {
  rows: Measurement[];
  typesOfMeasurement: TypesOfMeasurements;
  dispatchFilteredMeasurements: (data: number) => void;
}

export const Table = ({
  rows,
  typesOfMeasurement,
  dispatchFilteredMeasurements,
}: Table) => {
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

  const commonRenderCell = (param: GridRenderCellParams) => {
    return (
      <HtmlTooltip title={param.value}>
        <span>{param.value}</span>
      </HtmlTooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      renderCell: commonRenderCell,
      // editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 145,
      valueGetter: (value) => getDateStringFromUnix(value),
      // editable: true,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 145,
      valueGetter: (value) => getDateStringFromUnix(value),
      // editable: true,
    },
    {
      field: "typeOfMeasurement",
      headerName: "Measurement Type",
      width: 195,
      valueGetter: (value) =>
        typesOfMeasurement.filter((elem) => elem.id === value)[0].name,
      // editable: true,
    },
    {
      field: "measurement",
      headerName: "Measurement",
      width: 165,
      renderCell: (param) => {
        const currentRow: Measurement = param.row;
        if (
          currentRow.typeOfMeasurement === "2" &&
          currentRow.afterMealMeasurement
        ) {
          const meals: Meals = currentRow.afterMealMeasurement?.meal;

          return (
            <>
              <span>{param.row.measurement}</span>
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
            </>
          );
        } else {
          return <span>{param.row.measurement}</span>;
        }
      },
      // editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (param) => {
        const currentRow: Measurement = param.row;
        return (
          <Button
            variant="text"
            color="primary"
            sx={{ textTransform: "none" }}
            onClick={() => handleRowClick(currentRow.createdAt)}
          >
            Go to daily
          </Button>
        );
      },
    },
  ];

  // const paginationModel = { page: 0, pageSize: 5 };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handlePaginationModelChange = (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPaginationModel(newPaginationModel);
  };

  const handleRowClick = (createdAt: number) => {
    dispatchFilteredMeasurements(createdAt);
  };

  return (
    <Paper sx={{ height: "83.5vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        // initialState={{ pagination: { paginationModel } }}
        paginationModel={paginationModel}
        pageSizeOptions={[5]}
        // onRowClick={handleRowClick}
        // checkboxSelection={false}
        // disableColumnMenu
        // disableColumnResize
        disableColumnSelector
        sx={{ border: 0 }}
        // disableMultipleRowSelection
        disableRowSelectionOnClick
        onPaginationModelChange={handlePaginationModelChange}
      />
    </Paper>
  );
};
