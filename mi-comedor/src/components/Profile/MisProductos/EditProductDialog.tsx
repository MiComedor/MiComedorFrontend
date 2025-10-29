import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Snackbar,
  Alert,
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
import { useState } from "react";

type FormProductoValues = {
  descriptionProduct: string;
  amountProduct: string; // lo mantenemos como string en el form
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
  descriptionProduct: Yup.string()
    .max(35, "Máximo 35 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo puede ingresar letras")
    .required("Campo obligatorio"),
  amountProduct: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser positivo")
    .test(
      "format",
      "Formato inválido: use ##.## (ej: 1.50 o 10.5) y no empiece con 0",
      (val, ctx) =>
        val !== undefined &&
        /^[1-9]\d{0,1}(\.\d{1,2})?$/.test(String(ctx.originalValue))
    )
    .required("Campo obligatorio"),
  unitOfMeasurement: Yup.object().nullable().required("Campo obligatorio"),
  productType: Yup.object().nullable().required("Campo obligatorio"),
});

// Helpers de comparación/normalización
const normalizeDate = (d?: string) => (d ? d.split("T")[0] : "");
const toComparable = (v: {
  descriptionProduct: string;
  amountProduct: string | number;
  unitOfMeasurement: unitOfMeasurement | null | { idUnitOfMeasurement?: number };
  productType: ProductType | null | { idProductType?: number };
  expirationDate: string;
}) => ({
  descriptionProduct: (v.descriptionProduct || "").trim(),
  amountProduct: Number(v.amountProduct),
  unitOfMeasurementId:
    (v.unitOfMeasurement as any)?.idUnitOfMeasurement ?? null,
  productTypeId: (v.productType as any)?.idProductType ?? null,
  expirationDate: normalizeDate(v.expirationDate || ""),
});

export default function EditProductDialog({
  open,
  onClose,
  producto,
  unidades,
  tipos,
  onSuccess,
}: Props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const unidadSeleccionada = unidades.find(
    (u) => u.idUnitOfMeasurement === Number(producto.unitOfMeasurement_id)
  );
  const tipoSeleccionado = tipos.find(
    (t) => t.idProductType === Number(producto.productType_id)
  );

  // Shape comparable inicial (desde props.producto)
  const initialComparable = toComparable({
    descriptionProduct: producto.descriptionProduct,
    amountProduct: producto.amountProduct,
    unitOfMeasurement: { idUnitOfMeasurement: Number(producto.unitOfMeasurement_id) } as any,
    productType: { idProductType: Number(producto.productType_id) } as any,
    expirationDate: producto.expirationDate || "",
  });

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { backgroundColor: "#E4FAA4" } }}
    >
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
            // Comparación segura por si llegara a ejecutarse estando deshabilitado el botón
            const currentComparable = toComparable(values);
            if (
              JSON.stringify(currentComparable) ===
              JSON.stringify(initialComparable)
            ) {
              setSnackbarMsg("No hay cambios para guardar.");
              setSnackbarSeverity("info");
              setSnackbarOpen(true);
              return;
            }

            try {
              const payload = {
                ...producto,
                descriptionProduct: values.descriptionProduct.trim(),
                amountProduct: parseFloat(values.amountProduct),
                unitOfMeasurement_id:
                  values.unitOfMeasurement!.idUnitOfMeasurement,
                productType_id: values.productType!.idProductType,
                expirationDate: values.expirationDate,
              };

              await ProductService.actualizar(payload.idProduct, payload);
              setSnackbarMsg("¡Producto actualizado correctamente!");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
              onSuccess();
              onClose();
            } catch (e) {
              setSnackbarMsg("Ocurrió un error al actualizar.");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          }}
        >
          {({ values, touched, errors, setFieldValue, dirty, isValid }) => {
            const isPerishable =
              values.productType?.nameProductType?.toLowerCase() ===
              "perecible";

            return (
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
                    <label className="titulo-arriba-form" style={{ fontSize: 13 }}>
                      Descripción
                    </label>
                    <TextField
                      name="descriptionProduct"
                      fullWidth
                      margin="dense"
                      size="small"
                      value={values.descriptionProduct}
                      onChange={(e) =>
                        setFieldValue("descriptionProduct", e.target.value)
                      }
                      error={
                        touched.descriptionProduct &&
                        Boolean(errors.descriptionProduct)
                      }
                      helperText={
                        touched.descriptionProduct && errors.descriptionProduct
                      }
                      InputProps={{
                        sx: {
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          boxShadow: "1px 1px 3px rgba(0,0,0,0.08)",
                          border: "none",
                          fontSize: 14,
                          height: 36,
                        },
                        onKeyDown: (e) => {
                          if (/[0-9]/.test(e.key)) e.preventDefault();
                        },
                      }}
                    />
                  </Box>

                  {/* Cantidad */}
                  <Box sx={{ mt: 1 }}>
                    <label className="titulo-arriba-form" style={{ fontSize: 13 }}>
                      Cantidad
                    </label>
                    <TextField
                      name="amountProduct"
                      fullWidth
                      margin="dense"
                      size="small"
                      value={values.amountProduct}
                      onChange={(e) =>
                        setFieldValue("amountProduct", e.target.value)
                      }
                      error={
                        touched.amountProduct && Boolean(errors.amountProduct)
                      }
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
                        onKeyDown: (e) => {
                          if (
                            !/[0-9.]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        },
                      }}
                    />
                  </Box>

                  {/* Unidad de medida */}
                  <Box sx={{ mt: 1 }}>
                    <label className="titulo-arriba-form" style={{ fontSize: 13 }}>
                      Unidad de medida
                    </label>
                    <Autocomplete
                      options={unidades}
                      getOptionLabel={(opt) => opt.name}
                      isOptionEqualToValue={(opt, val) =>
                        opt.idUnitOfMeasurement === val?.idUnitOfMeasurement
                      }
                      value={values.unitOfMeasurement}
                      onChange={(_, value) =>
                        setFieldValue("unitOfMeasurement", value)
                      }
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="dense"
                          fullWidth
                          size="small"
                          error={
                            touched.unitOfMeasurement &&
                            Boolean(errors.unitOfMeasurement)
                          }
                          helperText={
                            touched.unitOfMeasurement &&
                            typeof errors.unitOfMeasurement === "string"
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
                    <label className="titulo-arriba-form" style={{ fontSize: 13 }}>
                      Tipo de producto
                    </label>
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
                          error={
                            touched.productType && Boolean(errors.productType)
                          }
                          helperText={
                            touched.productType &&
                            typeof errors.productType === "string"
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

                  {/* Fecha de vencimiento (solo perecible) */}
                  {isPerishable && (
                    <Box sx={{ mt: 1 }}>
                      <label className="titulo-arriba-form" style={{ fontSize: 13 }}>
                        Fecha de vencimiento
                      </label>
                      <MobileDatePicker
                        value={
                          values.expirationDate
                            ? dayjs(values.expirationDate)
                            : null
                        }
                        onChange={(newDate) =>
                          setFieldValue(
                            "expirationDate",
                            newDate ? newDate.format("YYYY-MM-DD") : ""
                          )
                        }
                        minDate={dayjs()}
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
                      />
                    </Box>
                  )}
                </DialogContent>

                <DialogActions
                  sx={{ justifyContent: "center", gap: 4, mt: 1, pb: 3 }}
                >
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

                  {/* Botón ✔ con color dinámico y deshabilitado si no hay cambios o el form es inválido */}
                  <Button
                    type="submit"
                    disabled={!dirty || !isValid}
                    sx={{
                      backgroundColor: !dirty || !isValid ? "#bdbdbd" : "#1976D2",
                      color: "white",
                      minWidth: 48,
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      mx: 1.5,
                      "&:hover": {
                        backgroundColor:
                          !dirty || !isValid ? "#bdbdbd" : "#0d47a1",
                        cursor: !dirty || !isValid ? "not-allowed" : "pointer",
                      },
                      transition: "background-color 0.2s ease-in-out",
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 32 }} />
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </LocalizationProvider>

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
