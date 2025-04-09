import { Measurement, TypesOfMeasurements } from "../../app/measurements";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderEditCellParams,
  GridRowModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { getDateStringFromUnix } from "../../utils/getDateStringFromUnix";
import { Paper } from "@mui/material";
import React, { useState } from "react";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { CheckoutState, MeasurementData } from "../../types/types";
import { EditAfterMeasurementModal } from "../../features/editAfterMealMeasurementModal/EditAfterMealMeasurementModa";
import {
  dataGridStylesTest,
  initialAfterMealMeasurement,
  validationRules,
} from "../../constants/constants";
import { CreatedAtEditCells } from "../CreatedAtEditCells/CreatedAtEditCells";
import {
  convertTime,
  convertTimestampToDate,
} from "../../utils/dateTimeConvert";
import dayjs from "dayjs";
import { areObjectsEqual } from "../../utils/areObjectsEqual";
import { TimeEditCells } from "../TimeEditCells/TimeEditCells";
import { CustomTableToolbar } from "../CustomTableToolbar/CustomTableToolbar";
import { CustomDateFilterField } from "../CustomDateFilterField/CustomDateFilterField";
import { CustomMeasurementTypeFilterField } from "../CustomMeasurementTypeFilterField/CustomMeasurementTypeFilterField";
import { FetchMeasurementResponse } from "../../features/shared/slices/measurementsSlice";
import { MeasurementRenderEditCells } from "../MeasrementRenderEditCells/MeasurementRenderEditCells";
import { ActionsCells } from "../ActionsCells/ActionsCells";
import { MeasurementRenderCells } from "../MeasurementRenderCells/MeasurementRenderCells";
import { TypeOfMeasurementEditCells } from "../TypeOfMeasurementEditCells/TypeOfMeasurementEditCells";
import { CustomErrorAlert } from "../CustomErrorAlert/CustomErrorAlert";

interface Table {
  rows: Measurement[];
  typesOfMeasurement: TypesOfMeasurements;
  dispatchRemoveMeasurement: (id: string) => void;
  // Тут хуета написана, нету типа никакого, решить эту проблему
  dispatchEditMeasurementSync: (
    data: MeasurementData
  ) => Promise<FetchMeasurementResponse>;
  editStatus: CheckoutState;
  removeStatus: CheckoutState;
}

export const Table = ({
  rows,
  typesOfMeasurement,
  dispatchRemoveMeasurement,
  dispatchEditMeasurementSync,
  editStatus,
  removeStatus,
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
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");

  console.log("Table");

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
      width: 90,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (param) => (
        <ActionsCells
          row={param.row}
          setIdToRemove={setIdToRemove}
          handleOpenRemoveConfirmModal={handleOpenRemoveConfirmModal}
        />
      ),
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
      width: 160,
      valueFormatter: (value) => getDateStringFromUnix(value),
      // type: "date",
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <CreatedAtEditCells
            editStatus={editStatus}
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
      width: 135,
      valueFormatter: (value) => getDateStringFromUnix(value),
      // editable: true,
    },
    {
      field: "time",
      headerName: "Time",
      width: 120,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <TimeEditCells
            editStatus={editStatus}
            initialValue={convertTime(params.value)}
            params={params}
          />
        );
      },
    },
    {
      field: "typeOfMeasurement",
      headerName: "Measurement Type",
      width: 195,
      // cellClassName: styles['padding-left'],
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
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <TypeOfMeasurementEditCells
          editStatus={editStatus}
          typesOfMeasurements={typesOfMeasurement}
          params={params}
          initialValue={params.value}
        />
      ),
    },
    {
      field: "measurement",
      headerName: "Measurement",
      width: 140,
      renderCell: (param) => <MeasurementRenderCells row={param.row} />,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <MeasurementRenderEditCells params={params} editStatus={editStatus} />
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

      console.log(newRow);

      if (areObjectsTheSame.field === "createdAt") {
        const isValid = validationRules.createdAt.validate(newRow.createdAt);

        if (isValid !== true) {
          setAlertTitle(isValid);
          setIsAlert(true);
          return;
        }
      }

      if (areObjectsTheSame.field === "time") {
        const regExp = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!regExp.test(newRow.time)) {
          setAlertTitle("Please enter time in HH:mm format");
          setIsAlert(true);
          return;
        }
      }

      if (areObjectsTheSame.field === "typeOfMeasurement") {
        if (!newRow.typeOfMeasurement) {
          setAlertTitle("Measurement type cannot be empty");
          setIsAlert(true);
          return;
        }
      }

      if (
        areObjectsTheSame.field === "measurement" &&
        newRow.typeOfMeasurement !== "2"
      ) {
        const isValid = validationRules.measurement.validate(
          newRow.measurement
        );
        if (isValid !== true) {
          setAlertTitle(isValid);
          setIsAlert(true);
          return;
        }
      }

      if (!areObjectsTheSame.result) {
        const row: MeasurementData = {
          ...(newRow as MeasurementData),
          updatedAt: dayjs().unix(),
          measurement: Number(newRow.measurement),
        };

        if (
          oldRow.typeOfMeasurement === "2" &&
          newRow.typeOfMeasurement !== "2"
        ) {
          delete row.afterMealMeasurement;
        }

        const res = await mutateRow(row as MeasurementData);

        if (res.payload) {
          return row;
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

      setAfterMealMeasurement(data);

      handleOpenEditAfterMealMeasurementModal();
      params.isEditable = false;
    }
  };

  // Асинхронно работает, не могу так вовремя поймать value
  // const handleCellEditStop = (
  //   params: GridCellEditStopParams,
  //   event: MuiEvent<MuiBaseEvent>
  // ) => {
  //   // console.log("params", params);
  //   // console.log("event", event);
  //   if (params.field === "createdAt") {
  //     console.log("params.value", params.value);
  //   }
  // };

  return (
    <>
      <Paper sx={{ margin: "0 auto", height: "83.5vh", width: "711px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          pageSizeOptions={[5]}
          // sx={dataGridStyles}
          sx={dataGridStylesTest}
          // onCellEditStop={handleCellEditStop}
          // disableRowSelectionOnClick
          // disableMultipleRowSelection={false}
          hideFooterSelectedRowCount
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
        status={removeStatus}
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
      <CustomErrorAlert
        title={alertTitle}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
      />
    </>
  );
};
