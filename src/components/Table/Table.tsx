import {
  Meals,
  Measurement,
  TypesOfMeasurements,
} from "../../app/measurements";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowModel,
  GridValueSetter,
  MuiBaseEvent,
  MuiEvent,
} from "@mui/x-data-grid";
import { getDateStringFromUnix } from "../../utils/getDateStringFromUnix";
import { Button, Paper, TextField, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import React, { ChangeEvent, useCallback, useState } from "react";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { EditMeasurement, PartialMeasurementData } from "../../types/types";

interface Table {
  rows: Measurement[];
  typesOfMeasurement: TypesOfMeasurements;
  dispatchFilteredMeasurements: (data: number) => void;
  dispatchRemoveMeasurement: (id: string) => void;
  dispatchEditMeasurement: (data: EditMeasurement) => void;
}

export const Table = ({
  rows,
  typesOfMeasurement,
  dispatchFilteredMeasurements,
  dispatchRemoveMeasurement,
  dispatchEditMeasurement,
}: Table) => {
  const [open, setOpen] = useState<boolean>(false);
  const [idToRemove, setIdToRemove] = useState<string>("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // type Row = (typeof rows)[number];

  // const editValue: GridValueSetter<Row> = (value, row) => {
  //   Promise.resolve().then(() => {
  //     const data = {
  //       id: row.id as string,valueSetter
  //       data: { measurement: Number(value) },
  //     };
  //     dispatchEditMeasurement(data);
  //   });

  //   return { ...row, measurement: Number(value) };
  // };

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
      // renderEditCell: (params) => {
      //   // Функция для отслеживания ввода и вывода в консоль
      //   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      //     // console.log("params.id", params.id);
      //     // console.log("params.field", params.field);

      //     params.api.setEditCellValue({
      //       id: params.id,
      //       field: params.field,
      //       value: e.target.value,
      //     });

      //     const value = e.target.value;
      //     const fieldName = params.field;
      //     const data = {
      //       id: params.id as string,
      //       data: { [fieldName]: value },
      //     };
      //     dispatchEditMeasurement(data);
      //   };

      //   // Возвращаем стандартный TextField для редактирования
      //   return (
      //     <input
      //       autoFocus
      //       defaultValue={params.value}
      //       onBlur={handleChange}
      //     />
      //   );
      // },
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
      // valueSetter: editValue,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (param) => {
        const currentRow: Measurement = param.row;
        return (
          <>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={() => handleRowClick(currentRow.createdAt)}
            >
              Go to daily
            </Button>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none", color: "red" }}
              onClick={() => {
                setIdToRemove(currentRow.id);
                handleOpen();
              }}
            >
              Remove
            </Button>
          </>
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

  const handleCellEditStop = (params: GridCellParams, event: MuiEvent) => {
    console.log(params.value);
    // console.log(params.id);
    // const fieldName = params.field;
    // const data = {
    //   id: params.id as string,
    //   data: { [fieldName]: params.value },
    // };
    // dispatchEditMeasurement(data);
  };

  const useMutation = () => {
    return React.useCallback((data: EditMeasurement) => {
      dispatchEditMeasurement(data);
    }, []);
  };

  const mutateRow = useMutation();

  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel) => {
      const row = { ...newRow, measurement: Number(newRow.measurement) };

      const data = {
        id: newRow.id as string,
        data: row,
      };

      mutateRow(data);

      return newRow;
    },

    [mutateRow]
  );

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    console.log("error", error);
  }, []);

  return (
    <>
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
          // onCellEditStop={handleCellEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
        />
      </Paper>
      <ConfirmModal
        open={open}
        idToRemove={idToRemove}
        handleClose={handleClose}
        dispatchRemoveMeasurement={dispatchRemoveMeasurement}
        title={"Are you sure you'd like to remove the measurement?"}
      />
    </>
  );
};

// onCellEditStop
// onCellEditStart
// onCellDoubleClick
// processRowUpdate
