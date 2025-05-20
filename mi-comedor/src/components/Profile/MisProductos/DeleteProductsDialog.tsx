import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    DialogContent,
    Typography,
} from "@mui/material";
import { ProductListResponse } from "../../../types/product";

interface DeleteProductDialogProps {
    open: boolean;
    onClose: () => void;
    producto: ProductListResponse;
    onDeleted: () => void;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
    open,
    onClose,
    producto,
    onDeleted,
}) => {
    const handleDelete = async () => {
        // Simula eliminación
        // await ProductService.eliminar(producto.idProduct);
        console.log("Eliminado:", producto.idProduct);
        onDeleted(); // Recarga productos
        onClose();   // Cierra modal
    };

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Eliminar Producto</DialogTitle>
        <DialogContent>
            <Typography>
            ¿Estás seguro que deseas eliminar <strong>{producto.descriptionProduct}</strong>?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="inherit">Cancelar</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default DeleteProductDialog;
