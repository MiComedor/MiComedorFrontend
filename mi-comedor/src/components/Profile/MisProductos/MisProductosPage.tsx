import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Stack,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TablePagination,
  Alert,

} from "@mui/material";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import "./MisProductosPage.css";

// Servicios y tipos
import { unitOfMeasurement } from "../../../types/unitOfMeasurement";
import unitOfMeasurementService from "../../../services/unitOfMeasurement.service";
import { ProductType } from "../../../types/product.type";
import ProductTypeService from "../../../services/productType.service";
import ProductService from "../../../services/product.service";
import { getImageForDescription } from "./ProductImages";
import { ProductListResponse } from "../../../types/product";

const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;
const USER_ID = user?.idUser;

const initialValues = {
  descriptionProduct: "",
  amountProduct: "",
  productType_id: "",
  unitOfMeasurement_id: "",
  expirationDate: "",
};

const validationSchema = Yup.object({
  descriptionProduct: Yup.string()
    .max(50, "Máximo 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "Solo letras")
    .required("Campo obligatorio"),
  amountProduct: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser un número positivo")
    .required("Campo obligatorio"),
  unitOfMeasurement_id: Yup.number().required("Campo obligatorio"),
  productType_id: Yup.number().required("Campo obligatorio"),
});


const MisProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<ProductListResponse[]>([]);
  const [tiposProducto, setTiposProducto] = useState<ProductType[]>([]);
  const [unidades, setUnidades] = useState<unitOfMeasurement[]>([]);
  const [openTipoDialog, setOpenTipoDialog] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [expirationDate, setexpirationDate] = useState<Dayjs | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
  if (mensajeExito) {
    const timer = setTimeout(() => setMensajeExito(null), 5000);
    return () => clearTimeout(timer);
  }
}, [mensajeExito]);
  
  useEffect(() => {
    unitOfMeasurementService
      .listar()
      .then(setUnidades)
      .catch((error: unknown) => console.error("Error al cargar unidades de medida:", error));

    ProductTypeService
      .listar()
      .then(setTiposProducto)
      .catch((error: unknown) => console.error("Error al cargar tipos de producto:", error));

    ProductService.listar()
    .then((productos) => {
      const productosOrdenados = productos.sort(
        (a, b) => b.idProduct - a.idProduct
      );
      setProductos(productosOrdenados);
    })
    .catch((error) => console.error("❌ Error al listar productos:", error));
  }, []);

  
  const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // Reinicia la página
};

  const onSubmit = async (
  values: typeof initialValues,
  actions: FormikHelpers<typeof initialValues>
  
) => {
  try {
    const payload = {
      ...values,
      user_id: USER_ID,
      amountProduct: parseFloat(values.amountProduct.toString()),
      unitOfMeasurement_id: Number(values.unitOfMeasurement_id),
      productType_id: Number(values.productType_id),
      expirationDate: values.expirationDate || "",
    };

  
    await ProductService.insertar(payload);
      setMensajeExito("✅ Producto guardado exitosamente");
      actions.resetForm();
      setTipoSeleccionado(""); 

      const productosActualizados = await ProductService.listar();
      const productosOrdenados = productosActualizados.sort(
        (a, b) => b.idProduct - a.idProduct
      );
      setProductos(productosOrdenados);

  } catch (error) {
    console.error("Error al guardar el producto", error);
  }

};

  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 4 }}>
        <Stack spacing={5}>
          <div className="formulario-productos">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    alignItems="flex-end"
                  >

                    <div className="form-group-productos">
                      <label className="titulo-arriba-form">Descripción</label>
                      <Field name="descriptionProduct">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={
                              touched.descriptionProduct &&
                              Boolean(errors.descriptionProduct)
                            }
                            helperText={
                              touched.descriptionProduct &&
                              errors.descriptionProduct
                            }
                            inputProps={{
                              maxLength: 50,
                              onKeyDown: (e) => {
                                if (/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              },
                            }}
                            size="small"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-productos">
                      <label className="titulo-arriba-form">Cantidad</label>
                      <Field name="amountProduct">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={
                              touched.amountProduct &&
                              Boolean(errors.amountProduct)
                            }
                            helperText={
                              touched.amountProduct && errors.amountProduct
                            }
                            inputProps={{
                              maxLength: 10,
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
                            size="small"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-productos">
                      <label htmlFor="unitOfMeasurement_id" className="titulo-arriba-form">
                        Unidad de medida
                      </label>
                      <Field name="unitOfMeasurement_id">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            id="unitOfMeasurement_id"
                            select
                            fullWidth
                            className="form-input"
                            error={Boolean(meta.touched && meta.error)}
                            helperText={meta.touched && meta.error}
                            size="small"
                          >
                            <MenuItem value="">Seleccione una unidad...</MenuItem>
                            {unidades.length > 0 ? (
                              unidades.map((unidad: unitOfMeasurement) => (
                                <MenuItem
                                  key={unidad.idUnitOfMeasurement}
                                  value={unidad.idUnitOfMeasurement}
                                >
                                  {unidad.name}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="" disabled>
                                No hay unidades disponibles
                              </MenuItem>
                            )}
                          </TextField>
                        )}
                      </Field>
                    </div>
                    

                    <div className="form-group-productos">
                      <label htmlFor="productType_id" className="titulo-arriba-form">
                        Tipo de producto
                      </label>
                      <Field name="productType_id">
                        {({ field, form, meta }: FieldProps) => (
                          <>
                            <TextField
                              {...field}
                              id="productType_id"
                              fullWidth
                              className="form-input"
                              size="small"
                              onClick={() => setOpenTipoDialog(true)}
                              value={tipoSeleccionado}
                              placeholder="Seleccionar tipo"
                              InputProps={{
                                readOnly: true,
                              }}
                              error={Boolean(meta.touched && meta.error)}
                              helperText={meta.touched && meta.error}
                            />

                            <Dialog
                              open={openTipoDialog}
                              onClose={() => setOpenTipoDialog(false)}
                              PaperProps={{
                                style: { backgroundColor: "#f57c00", padding: "20px" },
                              }}
                            >
                              <DialogTitle style={{ color: "white", fontWeight: "bold" }}>
                                Selecciona el tipo de producto
                              </DialogTitle>

                              <DialogContent>
                                <Stack spacing={2}>
                                  {tiposProducto.map((tipo) => (
                                    <Box key={tipo.idProductType} display="flex" alignItems="center">
                                      <input
                                        type="radio"
                                        id={`tipo-${tipo.idProductType}`}
                                        checked={tipoSeleccionado === tipo.nameProductType}
                                        onChange={() => {
                                          setTipoSeleccionado(tipo.nameProductType);
                                          form.setFieldValue("productType_id", tipo.idProductType);
                                        }}
                                        style={{ width: 20, height: 20, marginRight: 10 }}
                                      />
                                      <label
                                        htmlFor={`tipo-${tipo.idProductType}`}
                                        style={{ color: "white", fontWeight: "bold" }}
                                      >
                                        {tipo.nameProductType.toUpperCase()}
                                      </label>
                                    </Box>  
                                  ))}

                                  {tipoSeleccionado && (
                                    <Box display="flex" flexDirection="column" gap={2}>
                                      {tipoSeleccionado === "Perecible" && (
                                        <StaticDatePicker
                                          value={expirationDate}
                                          onChange={(newDate) => setexpirationDate(newDate)}
                                          displayStaticWrapperAs="desktop"
                                          slots={{ actionBar: () => null }}
                                        />
                                      )}

                                      <Box display="flex" justifyContent="flex-end">
                                        <IconButton
                                          onClick={() => {
                                            const tipo = tiposProducto.find(t => t.nameProductType === tipoSeleccionado);
                                            if (tipo) {
                                              form.setFieldValue("productType_id", tipo.idProductType);
                                            }
                                            if (tipoSeleccionado === "Perecible" && expirationDate) {
                                              form.setFieldValue("expirationDate", expirationDate.format("YYYY-MM-DD"));
                                            } else {
                                              form.setFieldValue("expirationDate", "");
                                            }
                                            setOpenTipoDialog(false);
                                          }}
                                          sx={{
                                            backgroundColor: "#4caf50",
                                            color: "white",
                                            width: 60,
                                            height: 60,
                                            "&:hover": { backgroundColor: "#43a047" },
                                          }}
                                        >
                                          <CheckIcon sx={{ fontSize: 36 }} />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                  )}

                                </Stack>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </Field>

                    </div>

                


                    <IconButton className="boton-verde" type="submit">
                      <AddIcon sx={{ fontSize: 42 }} />
                    </IconButton>
                  </Stack>
                </Form>
              )}
            </Formik>
          </div>

          {/* Mensajes de error y éxito */}
          {mensajeExito && (
            <Alert severity="success" sx={{ fontWeight: 'bold' }}>
              {mensajeExito}
            </Alert>
          )}
          

          {/* Tabla */}
          <Box className="table-container-productos">
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><em>Imagen</em></TableCell>
                    <TableCell><em>Descripción</em></TableCell>
                    <TableCell><em>Cantidad</em></TableCell>
                    <TableCell><em>Fecha de vencimiento</em></TableCell>
                    <TableCell><em>Acciones</em></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((prod) => (
                    <TableRow key={prod.idProduct}
                    sx={{backgroundColor: prod.amountProduct <= 5 ? "#f8d7da" : "transparent",
                    }}
                    >
                      <TableCell>
                        <img
                          src={getImageForDescription(prod.descriptionProduct)}
                          alt={prod.descriptionProduct}
                          width={80}
                          height={80}
                          style={{ objectFit: "contain" }}
                        />
                      </TableCell>
                      <TableCell>{prod.descriptionProduct}</TableCell>
                      <TableCell sx={{ color: prod.amountProduct <= 5 ? "#b71c1c" : "inherit" }}>
                        {`${prod.amountProduct} ${prod.unitOfMeasurementAbbreviation}`}
                      </TableCell>
                      <TableCell>
                        {prod.expirationDate
                          ? dayjs(prod.expirationDate).format("DD-MM-YYYY")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={productos.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={({ from, to, count }) =>
                  `Mostrando del ${from} al ${to} de ${count !== -1 ? count : `más de ${to}`} productos`
                }
              />
            </TableContainer>
        
          </Box>

          {/* Botón de regresar */}
          <Box>
            <Button
              variant="contained"
              color="warning"
              startIcon={<ArrowBackIcon />}
              sx={{ fontWeight: "bold" }}
            >
              REGRESAR AL MENÚ
            </Button>
          </Box>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default MisProductosPage;