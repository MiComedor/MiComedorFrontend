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
import ProductService from "../../../services/product.service";
import { ProductListResponse } from "../../../types/product";

interface DeleteProductsDialogProps {
  producto: ProductListResponse;
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteProductsDialog: React.FC<DeleteProductsDialogProps> = ({
  producto,
  onClose,
  onDeleted,
}) => {
  const handleDelete = async () => {
    try {
      await ProductService.eliminar(producto.idProduct);
      onDeleted(); // Notifica al padre
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#FDEBEB",
          borderRadius: 2,
          textAlign: "center",
          px: 4,
          py: 3,
        },
      }}
    >
      <DialogContent sx={{ width: 300 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="error"
          sx={{ mb: 2 }}
        >
          ¿Deseas eliminar
          <br />
          este producto?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 6 }}>
        <Button
          onClick={onClose}
          sx={{
        backgroundColor: "#9E9E9E",
        color: "white",
        width: 60,
        height: 60,
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "#757575",
        },
          }}
        >
          <CloseIcon />
        </Button>

        <Button
          onClick={handleDelete}
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

export default DeleteProductsDialog;
