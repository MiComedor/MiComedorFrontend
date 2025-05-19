import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Ration from "../../../types/ration.type";
import RationType from "../../../types/TypeRation";
import BeneficiaryByUserId from "../../../types/BeneficiaryByUserId";

type DeleteRacionesDialogProps = {
  open: boolean;
  onClose: () => void;
  data: Ration;
  onSubmit: (values: Ration) => Promise<void>;
  rationTypes: RationType[];
  beneficiaries: (BeneficiaryByUserId & { firstLetter: string })[];
};

const DeleteRacionesDialog: React.FC<DeleteRacionesDialogProps> = ({
  open,
  onClose,
  data,
  onSubmit,
}) => {
  const handleDelete = () => {
    onSubmit(data); // Llama al método deleteRaciones con los datos de la ración
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-ration-title"
      aria-describedby="delete-ration-description"
    >
      <DialogTitle id="delete-ration-title">
        {" "}
        ¿ Deseas eliminar esta ración ?{" "}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-ration-description">
          Esta acción no se puede deshacer. ¿Estás seguro que deseas eliminar la
          ración del <strong>{data?.date}</strong> para el beneficiario{" "}
          <strong>{}</strong> con precio{" "}
          <strong>S/ {data?.price?.toFixed(2)}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          autoFocus
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRacionesDialog;
