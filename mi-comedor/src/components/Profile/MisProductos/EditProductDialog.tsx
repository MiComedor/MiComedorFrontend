import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ProductListResponse } from "../../../types/product";
import { unitOfMeasurement } from "../../../types/unitOfMeasurement";
import { ProductType } from "../../../types/product.type";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import ProductService from "../../../services/product.service";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "./EditProductDialog.css";





type FormProductoValues = {
  descriptionProduct: string;
  amountProduct: string;
  unitOfMeasurement: unitOfMeasurement | null;
  productType: ProductType | null;
  expirationDate: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  producto: ProductListResponse;
  unidades: unitOfMeasurement[];
  tipos: ProductType[];
  onSuccess: () => void;
};

const validationSchema = Yup.object({
  descriptionProduct: Yup.string().required("Campo obligatorio"),
  amountProduct: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser positivo")
    .required("Campo obligatorio"),
  unitOfMeasurement: Yup.object().nullable().required("Campo obligatorio"),
  productType: Yup.object().nullable().required("Campo obligatorio"),
});

export default function EditProductDialog({
  open,
  onClose,
  producto,
  unidades,
  tipos,
  onSuccess,
}: Props) {
  const unidadSeleccionada = unidades.find(
  (u) => u.idUnitOfMeasurement === Number(producto.unitOfMeasurement_id)
);

const tipoSeleccionado = tipos.find(
  (t) => t.idProductType === Number(producto.productType_id)
);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { backgroundColor: "#E4FAA4" } }}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 20, py: 1.5 }}>
      Editar Producto
      </DialogTitle>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Formik<FormProductoValues>
        enableReinitialize
        initialValues={{
        descriptionProduct: producto.descriptionProduct,
        amountProduct: producto.amountProduct.toString(),
        unitOfMeasurement: unidadSeleccionada ?? null,
        productType: tipoSeleccionado ?? null,
        expirationDate: producto.expirationDate || "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
        const payload = {
          ...producto,
          descriptionProduct: values.descriptionProduct,
          amountProduct: parseFloat(values.amountProduct),
          unitOfMeasurement_id: values.unitOfMeasurement!.idUnitOfMeasurement,
          productType_id: values.productType!.idProductType,
          expirationDate: values.expirationDate,
        };

        await ProductService.actualizar(payload.idProduct, payload);
        onSuccess();
        onClose();
        }}
      >
        {({ values, touched, errors, setFieldValue }) => (
        <Form>
            <DialogContent
            sx={{
            backgroundColor: "#E4FAA4",
            px: 2,
            pt: 0.5,
            pb: 2,
            }}
            >
            {/* Descripción */}
            <Box sx={{ mt: 0.5 }}>
            <label className="titulo-arriba-form" style={{ fontSize: 13 }}>Descripción</label>
            <TextField
            name="descriptionProduct"
            fullWidth
            margin="dense"
            size="small"
            value={values.descriptionProduct}
            onChange={(e) => setFieldValue("descriptionProduct", e.target.value)}
            error={touched.descriptionProduct && Boolean(errors.descriptionProduct)}
            helperText={touched.descriptionProduct && errors.descriptionProduct}
            InputProps={{
              sx: {
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "1px 1px 3px rgba(0,0,0,0.08)",
              border: "none",
              fontSize: 14,
              height: 36,
              },
            }}
            />
            </Box>

            {/* Cantidad */}
            <Box sx={{ mt: 1 }}>
            <label className="titulo-arriba-form" style={{ fontSize: 13 }}>Cantidad</label>
            <TextField
            name="amountProduct"
            fullWidth
            margin="dense"
            size="small"
            value={values.amountProduct}
            onChange={(e) => setFieldValue("amountProduct", e.target.value)}
            error={touched.amountProduct && Boolean(errors.amountProduct)}
            helperText={touched.amountProduct && errors.amountProduct}
            InputProps={{
              sx: {
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "1px 1px 3px rgba(0,0,0,0.08)",
              border: "none",
              fontSize: 14,
              height: 36,
              },
            }}
            />
            </Box>

            {/* Unidad de medida */}
            <Box sx={{ mt: 1 }}>
            <label className="titulo-arriba-form" style={{ fontSize: 13 }}>Unidad de medida</label>
            <Autocomplete
            options={unidades}
            getOptionLabel={(opt) => opt.name}
            isOptionEqualToValue={(opt, val) =>
              opt.idUnitOfMeasurement === val?.idUnitOfMeasurement
            }
            value={values.unitOfMeasurement}
            onChange={(_, value) => setFieldValue("unitOfMeasurement", value)}
            size="small"
            renderInput={(params) => (
              <TextField
              {...params}
              margin="dense"
              fullWidth
              size="small"
              error={touched.unitOfMeasurement && Boolean(errors.unitOfMeasurement)}
              helperText={
                touched.unitOfMeasurement && typeof errors.unitOfMeasurement === "string"
                ? errors.unitOfMeasurement
                : ""
              }
              InputProps={{
                ...params.InputProps,
                sx: {
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "1px 1px 3px rgba(0,0,0,0.08)",
                border: "none",
                fontSize: 14,
                height: 36,
                },
              }}
              />
            )}
            />
          </Box>

          {/* Tipo de producto */}
          <Box sx={{ mt: 1 }}>
            <label className="titulo-arriba-form" style={{ fontSize: 13 }}>Tipo de producto</label>
            <Autocomplete
            options={tipos}
            getOptionLabel={(opt) => opt.nameProductType}
            isOptionEqualToValue={(opt, val) =>
              opt.idProductType === val?.idProductType
            }
            value={values.productType}
            onChange={(_, value) => setFieldValue("productType", value)}
            size="small"
            renderInput={(params) => (
              <TextField
              {...params}
              margin="dense"
              fullWidth
              size="small"
              error={touched.productType && Boolean(errors.productType)}
              helperText={
              touched.productType && typeof errors.productType === "string"
              ? errors.productType
              : ""
              }
              InputProps={{
              ...params.InputProps,
              sx: {
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "1px 1px 3px rgba(0,0,0,0.08)",
              border: "none",
              fontSize: 14,
              height: 36,
              },
              }}
              />
            )}
            />
            </Box>

            {/* Fecha de vencimiento */}
            {values.productType?.nameProductType.toLowerCase() === "perecible" && (
            <Box sx={{ mt: 1 }}>
            <label className="titulo-arriba-form" style={{ fontSize: 13 }}>Fecha de vencimiento</label>
            <MobileDatePicker
              value={values.expirationDate ? dayjs(values.expirationDate) : null}
              onChange={(newDate) =>
              setFieldValue("expirationDate", newDate ? newDate.format("YYYY-MM-DD") : "")
              }
              minDate={dayjs()} // Solo permite seleccionar desde hoy en adelante
              slotProps={{
              textField: {
                margin: "dense",
                fullWidth: true,
                size: "small",
                InputProps: {
                sx: {
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "1px 1px 3px rgba(0,0,0,0.08)",
                  border: "none",
                  fontSize: 14,
                  height: 36,
                },
                },
              },
              }}
              // El idioma español ya está configurado por adapterLocale="es" en LocalizationProvider
            />
            </Box>
            )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", gap: 4, mt: 1, pb: 3 }}>
              <Button
              onClick={onClose}
              sx={{
              backgroundColor: "red",
              color: "white",
              minWidth: 48,
              width: 48,
              height: 48,
              borderRadius: 1,
              mx: 1.5,
              "&:hover": { backgroundColor: "#b71c1c" },
              }}
              >
              <ClearIcon sx={{ fontSize: 32 }} />
              </Button>
              <Button
              type="submit"
              sx={{
              backgroundColor: "#1976D2",
              color: "white",
              minWidth: 48,
              width: 48,
              height: 48,
              borderRadius: 1,
              mx: 1.5,
              "&:hover": { backgroundColor: "#0d47a1" },
              }}
              >
              <CheckIcon sx={{ fontSize: 32 }} />
              </Button>
            </DialogActions>
        </Form>
        )}
      </Formik>
      </LocalizationProvider>
    </Dialog>
  );
}
