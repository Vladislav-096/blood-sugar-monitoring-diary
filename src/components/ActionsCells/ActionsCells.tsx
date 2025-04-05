import { Button } from "@mui/material";
import { Measurement } from "../../app/measurements";

interface ActionsCells {
  row: Measurement;
  setIdToRemove: React.Dispatch<React.SetStateAction<string>>;
  handleOpenRemoveConfirmModal: () => void;
}

export const ActionsCells = ({
  row,
  setIdToRemove,
  handleOpenRemoveConfirmModal,
}: ActionsCells) => {
  return (
    <Button
      variant="text"
      color="primary"
      sx={{ textTransform: "none", color: "red" }}
      onClick={() => {
        setIdToRemove(row.id);
        handleOpenRemoveConfirmModal();
      }}
    >
      Remove
    </Button>
  );
};
