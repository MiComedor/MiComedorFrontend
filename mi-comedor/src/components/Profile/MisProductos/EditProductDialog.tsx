import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ProductListResponse } from "../../../types/product";
import { unitOfMeasurement } from "../../../types/unitOfMeasurement";
import { ProductType } from "../../../types/product.type";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/es";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ProductService from "../../../services/product.service";

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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 22, backgroundColor: "#E4FAA4" }}>
        Editar producto
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
              <DialogContent sx={{ backgroundColor: "#E4FAA4", pb: 1 }}>
                <TextField
                  label="Descripción"
                  name="descriptionProduct"
                  fullWidth
                  margin="dense"
                  value={values.descriptionProduct}
                  onChange={(e) => setFieldValue("descriptionProduct", e.target.value)}
                  error={touched.descriptionProduct && Boolean(errors.descriptionProduct)}
                  helperText={touched.descriptionProduct && errors.descriptionProduct}
                  sx={{ borderRadius: 3, backgroundColor: "white" }}
                  InputProps={{ style: { borderRadius: 15 } }}
                />

                <TextField
                  label="Cantidad"
                  name="amountProduct"
                  fullWidth
                  margin="dense"
                  value={values.amountProduct}
                  onChange={(e) => setFieldValue("amountProduct", e.target.value)}
                  error={touched.amountProduct && Boolean(errors.amountProduct)}
                  helperText={touched.amountProduct && errors.amountProduct}
                  sx={{ borderRadius: 3, backgroundColor: "white" }}
                  InputProps={{ style: { borderRadius: 15 } }}
                />

                <Autocomplete
                  options={tipos}
                  getOptionLabel={(opt) => opt.nameProductType}
                  isOptionEqualToValue={(opt, val) =>
                    opt.idProductType === val?.idProductType
                  }
                  value={values.productType}
                  onChange={(_, value) => setFieldValue("productType", value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de producto"
                      margin="dense"
                      fullWidth
                      error={touched.productType && Boolean(errors.productType)}
                      helperText={touched.productType && errors.productType}
                      sx={{ backgroundColor: "white" }}
                      InputProps={{
                        ...params.InputProps,
                        style: { borderRadius: 15 },
                      }}
                    />
                  )}
                />

                {values.productType?.nameProductType.toLowerCase() === "perecible" && (
                  <MobileDatePicker
                    label="Fecha de vencimiento"
                    value={values.expirationDate ? dayjs(values.expirationDate) : null}
                    onChange={(newDate) =>
                      setFieldValue(
                        "expirationDate",
                        newDate ? newDate.format("YYYY-MM-DD") : ""
                      )
                    }
                    slotProps={{
                      textField: {
                        margin: "dense",
                        fullWidth: true,
                        sx: { backgroundColor: "white" },
                        InputProps: { style: { borderRadius: 15 } },
                      },
                    }}
                  />
                )}
              </DialogContent>

              <DialogActions
                sx={{
                  backgroundColor: "#E4FAA4",
                  justifyContent: "center",
                  gap: 4,
                  pb: 2,
                }}
              >
                <Button
                  onClick={onClose}
                  variant="contained"
                  sx={{
                    backgroundColor: "#FF0000",
                    color: "white",
                    width: 60,
                    height: 60,
                    minWidth: "unset",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "#cc0000",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 36 }} />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "white",
                    width: 60,
                    height: 60,
                    minWidth: "unset",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "#155a9c",
                    },
                  }}
                >
                  <CheckIcon sx={{ fontSize: 36 }} />
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </LocalizationProvider>
    </Dialog>
  );
}
