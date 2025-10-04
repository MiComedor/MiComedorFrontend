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
  activar: boolean;
};

const ActivateBeneficiariosDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  activar, 
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#F5F5F5",
          borderRadius: 2,
          textAlign: "center",
          px: 8,
          py: 5,
        },
      }}
    >
      <DialogContent sx={{ width: 250 }}>
        <Typography variant="h5" fontWeight="bold" color="black" sx={{ mb: 4 }}>
          {activar 
            ? "¿Deseas activar el beneficiario? ya lo tenías registrado"
            : "¿Deseas continuar con esta acción?"
          }
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#F57C00",
            color: "white",
            width: 60,
            height: 60,
            borderRadius: 1,
            mr: 8,
            "&:hover": {
              backgroundColor: "#87490bff",
            },
          }}
        >
          <CloseIcon />
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            backgroundColor: "#2E7D32",
            color: "white",
            width: 60,
            height: 60,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "#09450dff",
            },
          }}
        >
          <CheckIcon />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivateBeneficiariosDialog;