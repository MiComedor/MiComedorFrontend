import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import TaskCoordination from "../../../types/taskCoordination";
import TypeOfTask from "../../../types/TypeTask";
import "./DeleteTareaDialog.css"

type DeleteTareasDialogProps = {
  open: boolean;
  onClose: () => void;
  data: TaskCoordination;
  onSubmit: (values: TaskCoordination) => Promise<void>;
  rationTypes: TypeOfTask[];
};

const DeleteTareasDialog: React.FC<DeleteTareasDialogProps> = ({
  open,
  onClose,
  data,
  onSubmit,
}) => {
  const handleDelete = () => onSubmit(data);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="dialog-title-tarea">
        ¿Deseas eliminar esta tarea?
      </DialogTitle>
      
      <DialogContent className="dialog-content-tarea">
        <DialogContentText className="dialog-content-tarea">
          Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>

      <DialogActions className="dialog-actions-tarea">
        <Button onClick={onClose} className="btn-cancel-tarea" variant="contained">
          ✖
        </Button>
        <Button
          onClick={handleDelete}
          className="btn-confirm-tarea"
          variant="contained"
        >
          ✔
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTareasDialog;