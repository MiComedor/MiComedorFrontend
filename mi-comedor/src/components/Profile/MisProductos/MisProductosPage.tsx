import React, {  useState } from "react";import {
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
  InputAdornment,
} from "@mui/material";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import "./MisProductosPage.css";

import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

const initialValues = {
  fecha: "",
  tipoRacion: "",
  dni: "",
  precio: "",
};

const validationSchema = Yup.object({
  fecha: Yup.string()
    .required("Campo obligatorio")
    .test("is-valid-date", "Fecha inválida", (value) => !!value),

  tipoRacion: Yup.string()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "Solo letras")
    .required("Campo obligatorio"),

  dni: Yup.string()
    .matches(/^[0-9]{8}$/, "DNI inválido: solo 8 dígitos")
    .required("Campo obligatorio"),

  precio: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser un número positivo")
    .required("Campo obligatorio"),
});

const MisProductosPage: React.FC = () => {
  const [raciones, setRaciones] = useState<(typeof initialValues)[]>([]);

  const onSubmit = (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    setRaciones((prev) => [...prev, values]);
    actions.resetForm();
    actions.setSubmitting(false);
  };

  const handleDelete = (index: number) => {
    const nuevasRaciones = raciones.filter((_, i) => i !== index);
    setRaciones(nuevasRaciones);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 4 }}>
        <Stack spacing={5}>
          {/* Formulario */}
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
                      <label className="titulo-arriba-form">
                        Descripción
                      </label>
                      <Field name="tipoRacion">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={
                              touched.tipoRacion && Boolean(errors.tipoRacion)
                            }
                            helperText={touched.tipoRacion && errors.tipoRacion}
                            inputProps={{
                              onKeyDown: (e) => {
                                if (/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              },
                            }}
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-productos">
                      <label className="titulo-arriba-form">
                        Cantidad
                      </label>
                      <Field name="tipoRacion">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={
                              touched.tipoRacion && Boolean(errors.tipoRacion)
                            }
                            helperText={touched.tipoRacion && errors.tipoRacion}
                            inputProps={{
                              onKeyDown: (e) => {
                                if (/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              },
                            }}
                          />
                        )}
                      </Field>
                    </div>

                  <div className="form-group-productos">
                      <label className="titulo-arriba-form">
                        Unidad de medida
                      </label>
                      <Field name="tipoRacion">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={
                              touched.tipoRacion && Boolean(errors.tipoRacion)
                            }
                            helperText={touched.tipoRacion && errors.tipoRacion}
                            inputProps={{
                              onKeyDown: (e) => {
                                if (/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              },
                            }}
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-productos">
                      <label className="titulo-arriba-form">
                        Tipo de producto
                      </label>
                      <Field name="tipoRacion">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={
                              touched.tipoRacion && Boolean(errors.tipoRacion)
                            }
                            helperText={touched.tipoRacion && errors.tipoRacion}
                            inputProps={{
                              onKeyDown: (e) => {
                                if (/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              },
                            }}
                          />
                        )}
                      </Field>
                    </div>

                    
                    <IconButton
                      className="boton-verde"
                      onClick={() => {
                        /*onAdd();*/
                      }}
                    >
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
                  {raciones.map((racion, index) => (
                    <TableRow key={index}>
                      <TableCell>{racion.fecha}</TableCell>
                      <TableCell>{racion.tipoRacion}</TableCell>
                      <TableCell>{racion.dni}</TableCell>
                      <TableCell>S/ {racion.precio}</TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(index)}
                        >
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
