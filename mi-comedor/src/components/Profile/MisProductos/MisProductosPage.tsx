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
} from "@mui/material";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import "./MisProductosPage.css";

// Servicios y tipos
import UnitOfMeasurementService from "../../../services/unitOfMeasurement.service";
import { unitOfMeasurement } from "../../../types/unitOfMeasurement";

const initialValues = {
  fecha: "",
  tipoProducto: "",
  dni: "",
  precio: "",
  unitOfMeasurement_id: "",
};

const validationSchema = Yup.object({
  fecha: Yup.string()
    .required("Campo obligatorio")
    .test("is-valid-date", "Fecha inválida", (value) => !!value),

  tipoProducto: Yup.string()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "Solo letras")
    .required("Campo obligatorio"),

  dni: Yup.string()
    .matches(/^[0-9]{8}$/, "DNI inválido: solo 8 dígitos")
    .required("Campo obligatorio"),

  precio: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser un número positivo")
    .required("Campo obligatorio"),

  unitOfMeasurement_id: Yup.string().required("Campo obligatorio"),
});

const MisProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<(typeof initialValues)[]>([]);
  const [unidades, setUnidades] = useState<unitOfMeasurement[]>([]);

  useEffect(() => {
    UnitOfMeasurementService.listar()
      .then(setUnidades)
      .catch((error) =>
        console.error("Error al cargar unidades de medida:", error)
      );
  }, []);

  const onSubmit = (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    setProductos((prev) => [...prev, values]);
    actions.resetForm();
    actions.setSubmitting(false);
  };

  const handleDelete = (index: number) => {
    const nuevasProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevasProductos);
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
                            {Array.isArray(unidades) && unidades.length > 0 ? (
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
                      <label className="titulo-arriba-form">Tipo de producto</label>
                      <Field name="tipoProducto">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={touched.tipoProducto && Boolean(errors.tipoProducto)}
                            helperText={touched.tipoProducto && errors.tipoProducto}
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

                    <IconButton className="boton-verde">
                      <AddIcon sx={{ fontSize: 42 }} />
                    </IconButton>
                  </Stack>
                </Form>
              )}
            </Formik>
          </div>

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
                  {productos.map((productos, index) => (
                    <TableRow key={index}>
                      <TableCell>{productos.fecha}</TableCell>
                      <TableCell>{productos.tipoProductos}</TableCell>
                      <TableCell>{productos.dni}</TableCell>
                      <TableCell>S/ {productos.precio}</TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
