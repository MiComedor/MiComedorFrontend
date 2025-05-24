import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombre: string;
};

const DeleteBeneficiariosDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  nombre,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Beneficiario</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro que deseas eliminar a <strong>{nombre}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBeneficiariosDialog;
