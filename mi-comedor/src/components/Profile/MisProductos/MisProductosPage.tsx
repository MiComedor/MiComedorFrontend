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
import { unitOfMeasurement } from "../../../types/unitOfMeasurement";
import unitOfMeasurementService from "../../../services/unitOfMeasurement.service";
import { ProductType } from "../../../types/product.type";
import ProductTypeService from "../../../services/productType.service";
import ProductService from "../../../services/product.service";
import { getImageForDescription } from "./ProductImages";
import { ProductListResponse } from "../../../types/product";
import DeleteProductsDialog from "./DeleteProductsDialog";
import EditProductDialog from "./EditProductDialog";
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
    .max(35, "Máximo 35 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo puede ingresar letras")
    .required("Campo obligatorio"),
  amountProduct: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser positivo")
    .test(
      "format",
      "Maximo hasta 4 digitos",
      (val, ctx) =>
        val !== undefined &&
        ctx.originalValue !== undefined &&
        /^[1-9]\d{0,1}(\.\d{1,2})?$/.test(ctx.originalValue)
    )
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
  // AGREGADO: Estado para controlar el tipo de mensaje (success o error)
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">(
    "success"
  );
  const [productoAEditar, setProductoAEditar] =
    useState<ProductListResponse | null>(null);
  const [productoAEliminar, setProductoAEliminar] =
    useState<ProductListResponse | null>(null);

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
      .catch((error: unknown) =>
        console.error("Error al cargar unidades de medida:", error)
      );

    ProductTypeService.listar()
      .then(setTiposProducto)
      .catch((error: unknown) =>
        console.error("Error al cargar tipos de producto:", error)
      );

    ProductService.listarPorUsuario(USER_ID).then((productos) => {
      const productosConIDs = productos.map((p) => ({
        ...p,
        unitOfMeasurement_id:
          unidades.find(
            (u) => u.abbreviation === p.unitOfMeasurementAbbreviation
          )?.idUnitOfMeasurement ?? p.unitOfMeasurement_id,
        productType_id:
          tiposProducto.find((t) => t.nameProductType === p.productTypeName)
            ?.idProductType ?? p.productType_id,
      }));

      const productosOrdenados = productosConIDs.sort(
        (a, b) => b.idProduct - a.idProduct
      );

      setProductos(productosOrdenados);
    });
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      // MODIFICADO: Establecer tipo de mensaje como success
      setTipoMensaje("success");
      setMensajeExito("Producto guardado exitosamente");
      actions.resetForm();
      setTipoSeleccionado("");

      const productosActualizados = await ProductService.listarPorUsuario(
        USER_ID
      );
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
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "100%" }}
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
                              onKeyDown: (e) => {
                                const value = (e.target as HTMLInputElement)
                                  .value;
                                const regex = /^[0-9]{0,4}(\.[0-9]{0,2})?$/;

                                // Permitir teclas especiales
                                if (
                                  [
                                    "Backspace",
                                    "Tab",
                                    "ArrowLeft",
                                    "ArrowRight",
                                  ].includes(e.key)
                                ) {
                                  return;
                                }

                                // Valor potencial si se agrega la tecla presionada
                                const newValue = value + e.key;

                                if (!regex.test(newValue)) {
                                  e.preventDefault(); // ❌ Bloquea el carácter
                                }
                              },
                            }}
                            size="small"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-productos">
                      <label
                        htmlFor="unitOfMeasurement_id"
                        className="titulo-arriba-form"
                      >
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
                            <MenuItem value="">
                              Seleccione una unidad...
                            </MenuItem>
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
                      <label
                        htmlFor="productType_id"
                        className="titulo-arriba-form"
                      >
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
                                style: {
                                  backgroundColor: "#f57c00",
                                  padding: "20px",
                                },
                              }}
                            >
                              <DialogTitle
                                style={{ color: "white", fontWeight: "bold" }}
                              >
                                Selecciona el tipo de producto
                              </DialogTitle>

                              <DialogContent>
                                <Stack spacing={2}>
                                  {tiposProducto.map((tipo) => (
                                    <Box
                                      key={tipo.idProductType}
                                      display="flex"
                                      alignItems="center"
                                    >
                                      <input
                                        type="radio"
                                        id={`tipo-${tipo.idProductType}`}
                                        checked={
                                          tipoSeleccionado ===
                                          tipo.nameProductType
                                        }
                                        onChange={() => {
                                          setTipoSeleccionado(
                                            tipo.nameProductType
                                          );
                                          form.setFieldValue(
                                            "productType_id",
                                            tipo.idProductType
                                          );
                                        }}
                                        style={{
                                          width: 20,
                                          height: 20,
                                          marginRight: 10,
                                        }}
                                      />
                                      <label
                                        htmlFor={`tipo-${tipo.idProductType}`}
                                        style={{
                                          color: "white",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {tipo.nameProductType.toUpperCase()}
                                      </label>
                                    </Box>
                                  ))}

                                  {tipoSeleccionado && (
                                    <Box
                                      display="flex"
                                      flexDirection="column"
                                      gap={2}
                                    >
                                      {tipoSeleccionado === "Perecible" && (
                                        <LocalizationProvider
                                          dateAdapter={AdapterDayjs}
                                          adapterLocale="es"
                                        >
                                          <StaticDatePicker
                                            value={expirationDate}
                                            onChange={(newDate) =>
                                              setexpirationDate(newDate)
                                            }
                                            displayStaticWrapperAs="desktop"
                                            slots={{ actionBar: () => null }}
                                            localeText={{
                                              cancelButtonLabel: "Cancelar",
                                              okButtonLabel: "Aceptar",
                                              toolbarTitle: "Selecciona fecha",
                                              previousMonth: "Mes anterior",
                                              nextMonth: "Mes siguiente",
                                            }}
                                            minDate={dayjs().startOf("day")}
                                          />
                                        </LocalizationProvider>
                                      )}

                                      <Box
                                        display="flex"
                                        justifyContent="flex-end"
                                      >
                                        <IconButton
                                          onClick={() => {
                                            const tipo = tiposProducto.find(
                                              (t) =>
                                                t.nameProductType ===
                                                tipoSeleccionado
                                            );
                                            if (tipo) {
                                              form.setFieldValue(
                                                "productType_id",
                                                tipo.idProductType
                                              );
                                            }
                                            if (
                                              tipoSeleccionado ===
                                                "Perecible" &&
                                              expirationDate
                                            ) {
                                              form.setFieldValue(
                                                "expirationDate",
                                                expirationDate.format(
                                                  "YYYY-MM-DD"
                                                )
                                              );
                                            } else {
                                              form.setFieldValue(
                                                "expirationDate",
                                                ""
                                              );
                                            }
                                            setOpenTipoDialog(false);
                                          }}
                                          sx={{
                                            backgroundColor: "#4caf50",
                                            color: "white",
                                            width: 60,
                                            height: 60,
                                            "&:hover": {
                                              backgroundColor: "#43a047",
                                            },
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

                    <IconButton className="boton-verde-producto" type="submit">
                      <AddIcon sx={{ fontSize: 42 }} />
                    </IconButton>
                  </Stack>
                </Form>
              )}
            </Formik>
          </div>

          {/* MODIFICADO: Alert ahora usa la prop severity dinámica según el tipo de mensaje */}
          {mensajeExito && (
            <Alert severity={tipoMensaje} sx={{ fontWeight: "bold" }}>
              {mensajeExito}
            </Alert>
          )}

          {/* Tabla */}
          <Box className="table-container-productos">
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <em>Imagen</em>
                    </TableCell>
                    <TableCell>
                      <em>Descripción</em>
                    </TableCell>
                    <TableCell>
                      <em>Cantidad</em>
                    </TableCell>
                    <TableCell>
                      <em>Fecha de vencimiento</em>
                    </TableCell>
                    <TableCell>
                      <em>Acciones</em>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((prod) => (
                      <TableRow
                        key={prod.idProduct}
                        sx={{
                          backgroundColor:
                            prod.amountProduct <= 5 ? "#f8d7da" : "transparent",
                        }}
                      >
                        <TableCell>
                          <img
                            src={getImageForDescription(
                              prod.descriptionProduct
                            )}
                            alt={prod.descriptionProduct}
                            width={80}
                            height={80}
                            style={{ objectFit: "contain" }}
                          />
                        </TableCell>
                        <TableCell>{prod.descriptionProduct}</TableCell>
                        <TableCell
                          sx={{
                            color:
                              prod.amountProduct <= 5 ? "#b71c1c" : "inherit",
                          }}
                        >
                          {`${prod.amountProduct} ${prod.unitOfMeasurementAbbreviation}`}
                        </TableCell>
                        <TableCell>
                          {prod.expirationDate
                            ? dayjs(prod.expirationDate).format("DD-MM-YYYY")
                            : "Sin fecha de vencimiento"}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "#1976D2",
                                minWidth: 0,
                                p: 1,
                              }}
                              onClick={() => setProductoAEditar(prod)}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "#D32F2F",
                                minWidth: 0,
                                p: 1,
                              }}
                              onClick={() => setProductoAEliminar(prod)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Stack>
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
                  `Del ${from} al ${to} de ${
                    count !== -1 ? count : `más de ${to}`
                  } movimientos`
                }
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    flexDirection: { xs: "row", sm: "row" },
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    justifyContent: { xs: "space-between", sm: "flex-end" },
                    alignItems: "center",
                    gap: 1,
                    px: 1,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: "0.85rem",
                      marginBottom: { xs: 0.5, sm: 0 },
                    },
                  "& .MuiTablePagination-actions": {
                    marginLeft: { xs: 0, sm: 2 },
                  },
                }}
              />
            </TableContainer>

            {productoAEditar &&
              unidades.length > 0 &&
              tiposProducto.length > 0 && (
                <EditProductDialog
                  open={true}
                  producto={productoAEditar}
                  onClose={() => setProductoAEditar(null)}
                  unidades={unidades}
                  tipos={tiposProducto}
                  onSuccess={async () => {
                    const productosActualizados =
                      await ProductService.listarPorUsuario(USER_ID);
                    setProductos(
                      productosActualizados.sort(
                        (a, b) => b.idProduct - a.idProduct
                      )
                    );
                    // MODIFICADO: Establecer tipo de mensaje como success
                    setTipoMensaje("success");
                    setMensajeExito("Producto actualizado exitosamente");
                    setProductoAEditar(null);
                  }}
                />
              )}

            {productoAEliminar && (
              <DeleteProductsDialog
                producto={productoAEliminar}
                onClose={() => setProductoAEliminar(null)}
                onDeleted={async () => {
                  const productosActualizados =
                    await ProductService.listarPorUsuario(USER_ID);
                  setProductos(
                    productosActualizados.sort(
                      (a, b) => b.idProduct - a.idProduct
                    )
                  );
                  setProductoAEliminar(null);
                  // MODIFICADO: Establecer tipo de mensaje como error para mostrar en rojo
                  setTipoMensaje("error");
                  setMensajeExito("Producto eliminado exitosamente");
                }}
              />
            )}
          </Box>

          {/* Botón de regresar */}
          <Box sx={{ pt: 4 }}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<ArrowBackIcon />}
              sx={{ fontWeight: "bold" }}
              href="/profile"
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
