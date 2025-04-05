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
import { initialAfterMealMeasurement } from "../../constants/constants";
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

interface Table {
  rows: Measurement[];
  typesOfMeasurement: TypesOfMeasurements;
  dispatchRemoveMeasurement: (id: string) => void;
  dispatchEditMeasurementSync: (
    data: MeasurementData
  ) => Promise<FetchMeasurementResponse>;
  editStatus: CheckoutState;
}

export const Table = ({
  rows,
  typesOfMeasurement,
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
      width: 100,
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
      width: 153,
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
      width: 120,
      valueFormatter: (value) => getDateStringFromUnix(value),
      // editable: true,
    },
    {
      field: "time",
      headerName: "Time",
      width: 110,
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
      width: 175,
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
