import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

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
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#FDEBEB",
          borderRadius: 2,
          textAlign: "center",
          px: 8,
          py: 5,
        },
      }}
    >
    <DialogContent sx={{ width: 250 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="error"
        sx={{ mb: 4 }}
      >
        ¿Deseas eliminar
        <br />
        al pensionista?
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center" }}>
      <Button
        onClick={onClose}
        sx={{
        backgroundColor: "#9E9E9E",
        color: "white",
        width: 60,
        height: 60,
        borderRadius: 1,
        mr: 8, // Espacio a la derecha
        "&:hover": {
          backgroundColor: "#757575",
        },
        }}
      >
        <CloseIcon />
      </Button>
      <Button
        onClick={onConfirm}
        sx={{
        backgroundColor: "#D32F2F",
        color: "white",
        width: 60,
        height: 60,
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "#B71C1C",
        },
        }}
      >
        <CheckIcon />
      </Button>
    </DialogActions>
    </Dialog>
  );
};

export default DeleteBeneficiariosDialog;
