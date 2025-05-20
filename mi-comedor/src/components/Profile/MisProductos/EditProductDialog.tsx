import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
} from "@mui/material";
import { ProductListResponse } from "../../../types/product";

interface EditProductDialogProps {
    open: boolean;
    onClose: () => void;
    producto: ProductListResponse;
    onUpdated: () => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
    open,
    onClose,
    producto,
    onUpdated,
}) => {
    const [descripcion, setDescripcion] = React.useState(producto.descriptionProduct);
    const [cantidad, setCantidad] = React.useState(producto.amountProduct);

    const handleGuardar = async () => {
        // Simula actualización
        // await ProductService.actualizar({...})
        console.log("Guardado:", { descripcion, cantidad });
        onUpdated(); // Recarga productos
        onClose();   // Cierra modal
    };

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
            <TextField
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                fullWidth
            />
            <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                fullWidth
            />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="inherit">Cancelar</Button>
            <Button onClick={handleGuardar} variant="contained">Guardar</Button>
        </DialogActions>
        </Dialog>
    );
    };

export default EditProductDialog;
