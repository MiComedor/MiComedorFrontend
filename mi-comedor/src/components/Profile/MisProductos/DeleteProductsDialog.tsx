import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

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
      onDeleted(); // Notifica al padre que el producto fue eliminado
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      // Aquí podrías mostrar un mensaje de error con Snackbar o Alert
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Eliminar producto</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar el producto{" "}
          <strong>{producto.descriptionProduct}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductsDialog;
