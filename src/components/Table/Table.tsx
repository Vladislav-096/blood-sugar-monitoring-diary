import {
  Meals,
  Measurement,
  TypesOfMeasurements,
} from "../../app/measurements";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderEditCellParams,
  GridRowModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { getDateStringFromUnix } from "../../utils/getDateStringFromUnix";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import React, { useState } from "react";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { CheckoutState, MeasurementData } from "../../types/types";
import { EditAfterMeasurementModal } from "../../features/editAfterMealMeasurementModal/EditAfterMealMeasurementModa";
import { initialAfterMealMeasurement } from "../../constants/constants";
import { CustomSelectTypeOfMeasurement } from "../CustomSelectTypeOfMeasurement/CustomSelectTypeOfMeasurement";
import { CustomDatePicker } from "../CustomDatePicker/CustomDatePicker";
import {
  convertTime,
  convertTimestampToDate,
} from "../../utils/dateTimeConvert";
import dayjs from "dayjs";
import { areObjectsEqual } from "../../utils/areObjectsEqual";
import { CustomTimePicker } from "../CustomTimePicker/CustomTimePicker";
import { CustomTableToolbar } from "../CustomTableToolbar/CustomTableToolbar";
import { CustomDateFilterField } from "../CustomDateFilterField/CustomDateFilterField";
import { CustomMeasurementTypeFilterField } from "../CustomMeasurementTypeFilterField/CustomMeasurementTypeFilterField";
import { FetchMeasurementResponse } from "../../features/shared/slices/measurementsSlice";
import { Loader } from "../Loader/Loader";
import { CustomMeasurementEditField } from "../CustomMeasurementEditField";

interface Table {
  rows: Measurement[];
  typesOfMeasurement: TypesOfMeasurements;
  dispatchFilteredMeasurements: (data: number) => void;
  dispatchRemoveMeasurement: (id: string) => void;
  dispatchEditMeasurementSync: (
    data: MeasurementData
  ) => Promise<FetchMeasurementResponse>;
  editStatus: CheckoutState;
  // getMeasurementsStatus: CheckoutState;
  // typesOfMeasurementStatus: CheckoutState;
}

export const Table = ({
  rows,
  typesOfMeasurement,
  // getMeasurementsStatus,
  // typesOfMeasurementStatus,
  dispatchFilteredMeasurements,
  dispatchRemoveMeasurement,
  dispatchEditMeasurementSync,
  editStatus,
}: Table) => {
  const defaultMeasurementValue = "Just Measurement";
  const [openRemoveConfirmModal, setOpenRemoveConfirmModal] =
    useState<boolean>(false);
  const handleOpenRemoveConfirmModal = () => setOpenRemoveConfirmModal(true);
  const handleCloseRemoveConfirmCloseModal = () =>
    setOpenRemoveConfirmModal(false);
  const [
    openEditAfterMealMeasurementModal,
    setOpenEditAfterMealMeasurementModal,
  ] = useState<boolean>(false);
  const handleOpenEditAfterMealMeasurementModal = () =>
    setOpenEditAfterMealMeasurementModal(true);
  const handleCloseEditAfterMealMeasurementModal = () =>
    setOpenEditAfterMealMeasurementModal(false);
  const [idToRemove, setIdToRemove] = useState<string>("");
  const [afterMealMeasurement, setAfterMealMeasurement] =
    useState<MeasurementData>(initialAfterMealMeasurement);

  console.log("Table");

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

  // const commonRenderCell = (param: GridRenderCellParams) => {
  //   return (
  //     <HtmlTooltip title={param.value}>
  //       <span>{param.value}</span>
  //     </HtmlTooltip>
  //   );
  // };

  // type Row = (typeof rows)[number];

  // const editValue: GridValueSetter<Row> = (value, row) => {
  //   Promise.resolve().then(() => {
  //     const data = {
  //       id: row.id as string,
  //       data: { measurement: Number(value) },
  //     };
  //     dispatchEditMeasurement(data);
  //   });

  //   return { ...row, measurement: Number(value) };
  // };

  const columns: GridColDef[] = [
    // {
    //   field: "id",
    //   headerName: "ID",
    //   width: 90,
    //   renderCell: commonRenderCell,

    //   // editable: true,
    // },
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
                handleOpenRemoveConfirmModal();
              }}
            >
              Remove
            </Button>
          </>
        );
      },
      filterable: false,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      filterOperators: [
        {
          value: "contains",
          label: "contains",
          getApplyFilterFn: (filterItem) => {
            return (value) => {
              if (filterItem.value) {
                const formattedValues = dayjs(value * 1000).format(
                  "DD.MM.YYYY"
                );
                return formattedValues.includes(
                  filterItem.value.toString().toLowerCase()
                );
              } else {
                return true;
              }
            };
          },
          InputComponent: CustomDateFilterField,
        },
      ],
      width: 120,
      valueFormatter: (value) => getDateStringFromUnix(value),
      // type: "date",
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <CustomDatePicker
            initialValue={convertTimestampToDate(params.value)} // YYYY-MM-DD
            params={params}
          />
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      filterOperators: [
        {
          value: "contains",
          label: "contains",
          getApplyFilterFn: (filterItem) => {
            return (value) => {
              if (filterItem.value) {
                const formattedValues = dayjs(value * 1000).format(
                  "DD.MM.YYYY"
                );
                return formattedValues.includes(
                  filterItem.value.toString().toLowerCase()
                );
              } else {
                return true;
              }
            };
          },
          InputComponent: CustomDateFilterField,
        },
      ],
      width: 120,
      valueFormatter: (value) => getDateStringFromUnix(value),
      // editable: true,
    },
    {
      field: "time",
      headerName: "Time",
      width: 90,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <CustomTimePicker
            initialValue={convertTime(params.value)}
            params={params}
          />
        );
      },
    },
    {
      field: "typeOfMeasurement",
      headerName: "Measurement Type",
      width: 175,
      filterOperators: [
        {
          value: "contains",
          label: "contains",
          getApplyFilterFn: (filterItem) => {
            return (value) => {
              if (filterItem.value) {
                const type = typesOfMeasurement.find(
                  (item) => item.id === value
                )?.name;

                if (type) {
                  return type
                    .toLowerCase()
                    .includes(filterItem.value.toString().toLowerCase());
                } else {
                  return true;
                }
              } else {
                return true;
              }
            };
          },
          InputComponent: CustomMeasurementTypeFilterField,
        },
      ],
      valueFormatter: (value) => {
        const test = typesOfMeasurement.find((elem) => elem.id === value);
        if (test) {
          return test.name;
        }
        return defaultMeasurementValue;
      },
      // valueGetter: (value) => {
      //   const test = typesOfMeasurement.find((elem) => elem.id === value);
      //   if (test) {
      //     return test.name;
      //   }
      //   return defaultMeasurementValue;
      // },
      // valueSetter: (value) => {
      //   console.log("value", value);
      //   return typesOfMeasurement.filter((elem) => elem.id === value)[0].name;
      // },
      // valueParser: (value) => {
      //   console.log("value", value);
      //   return typesOfMeasurement.filter((elem) => elem.id === value)[0].name;
      // },
      editable: true,
      // type: "singleSelect",
      // valueOptions: typesOfMeasurement.map((item) => item.name),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <CustomSelectTypeOfMeasurement
          typesOfMeasurements={typesOfMeasurement}
          params={params}
          // dispatchEditMeasurement={dispatchEditMeasurement}
          // row={params.row}
          initialValue={params.value}
        />
      ),
    },
    {
      field: "measurement",
      headerName: "Measurement",
      width: 140,
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
        }

        return (
          <Box sx={{ paddingLeft: "25px" }}>
            <Typography component="span">{param.row.measurement}</Typography>
          </Box>
        );
      },
      // renderEditCell: (params: GridRenderEditCellParams) => (
      //   <Box sx={{ position: "relative", display: "flex" }}>
      //     <TextField defaultValue={params.row.measurement} hiddenLabel/>

      //     {/* <Typography component="span" sx={{ display: "inline-block" }}>
      //       {params.row.measurement}
      //     </Typography> */}
      //     {editStatus === "LOADING" && (
      //       <Box
      //         sx={{
      //           marginLeft: "15px",
      //           width: "22px",
      //           height: "22px",
      //         }}
      //       >
      //         <Loader lineColor={"#000"} />
      //       </Box>
      //     )}
      //   </Box>
      // ),
      // valueSetter: editValue,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <CustomMeasurementEditField params={params} editStatus={editStatus} />
      ),
      editable: true,
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

  // const handleCellEditStop = (params: GridCellParams, event: MuiEvent) => {
  // console.log(params.id);
  // const fieldName = params.field;
  // const data = {
  //   id: params.id as string,
  //   data: { [fieldName]: params.value },
  // };
  // dispatchEditMeasurement(data);
  // };

  const useEditMutation = () => {
    return React.useCallback(async (data: MeasurementData) => {
      const res = dispatchEditMeasurementSync(data);
      return res;
    }, []);
  };

  const mutateRow = useEditMutation();

  const processRowUpdate = React.useCallback(
    async (
      newRow: GridRowModel,
      oldRow: GridValidRowModel
      // params: {
      //   rowId: GridRowId;
      // }
    ) => {
      const areObjectsTheSame = areObjectsEqual(newRow, oldRow);

      if (!areObjectsTheSame) {
        const row = {
          ...newRow,
          updatedAt: dayjs().unix(),
          measurement: Number(newRow.measurement),
        };

        console.log("row", row);

        const res = await mutateRow(row as MeasurementData);

        console.log("res", res);
        if (res.payload) {
          return newRow;
        }
        return oldRow;
      } else {
        return oldRow;
      }
    },

    [mutateRow]
  );

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    console.log("error", error);
  }, []);

  const handleCellDoubleClick = (
    params: GridCellParams
    // event: MuiEvent,
    // details: GridCallbackDetails
  ) => {
    console.log("params", params);
    if (
      params.field === "measurement" &&
      params.row.typeOfMeasurement === "2"
    ) {
      // const data: afterMealMeasurementData = {
      //   afterMealMeasurementId: params.row.id,
      //   afterMealMeasurementMeasurement: params.row.measurement,
      //   afterMealMeasurementMeals: params.row.afterMealMeasurement
      //     ? params.row.afterMealMeasurement.meal
      //     : [],
      // };

      const data: MeasurementData = params.row;

      console.log("data", data);

      setAfterMealMeasurement(data);

      handleOpenEditAfterMealMeasurementModal();
      params.isEditable = false;
    }
  };

  // if (
  //   getMeasurementsStatus === "LOADING" &&
  //   typesOfMeasurementStatus === "LOADING"
  // ) {
  //   return <div style={{ color: "white" }}>Загрузочка</div>;
  // }

  // if (
  //   getMeasurementsStatus === "ERROR" ||
  //   typesOfMeasurementStatus === "ERROR"
  // ) {
  //   return <div style={{ color: "white" }}>Ошибочка</div>;
  // }

  return (
    <>
      <Paper sx={{ margin: "0 auto", height: "83.5vh", width: "711px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          pageSizeOptions={[5]}
          sx={{ border: 0 }}
          disableRowSelectionOnClick
          onPaginationModelChange={handlePaginationModelChange}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          onCellDoubleClick={handleCellDoubleClick}
          disableColumnMenu
          slots={{
            toolbar: CustomTableToolbar,
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                updatedAt: false, // Скрыть колонку по умолчанию
                // Добавьте другие колонки, которые хотите скрыть
              },
            },
          }}
        />
      </Paper>
      <ConfirmModal
        open={openRemoveConfirmModal}
        idToRemove={idToRemove}
        handleClose={handleCloseRemoveConfirmCloseModal}
        confirmFn={dispatchRemoveMeasurement}
        title={"Are you sure you'd like to remove the measurement?"}
      />
      <EditAfterMeasurementModal
        afterMealMeasurement={afterMealMeasurement}
        setAfterMealMeasurement={setAfterMealMeasurement}
        open={openEditAfterMealMeasurementModal}
        handleClose={handleCloseEditAfterMealMeasurementModal}
      />
    </>
  );
};
