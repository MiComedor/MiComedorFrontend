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
import "./RacionesPage.css";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import RationByUserId from "../../../types/rationByUserId";
import RationService from "../../../services/ration.service";

const initialRationValues = {
  date: "",
  nameRationType: "",
  dniBenefeciary: "",
  price: "",
};

const validationSchema = Yup.object({
  date: Yup.string()
    .required("Campo obligatorio")
    .test("is-valid-date", "Fecha inválida", (value) => !!value),

  nameRationType: Yup.string()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "Solo letras")
    .required("Campo obligatorio"),

  dniBenefeciary: Yup.string()
    .matches(/^[0-9]{8}$/, "DNI inválido: solo 8 dígitos")
    .required("Campo obligatorio"),

  price: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser un número positivo")
    .required("Campo obligatorio"),
});

const RegistroRaciones: React.FC = () => {
  const [raciones, setRaciones] = useState<RationByUserId[]>([]);

  const getRaciones = async () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    try {
      const raciones = await RationService.buscarRacionPorUserId(user.idUser);
      setRaciones(raciones);
    } catch (error) {
      console.error("❌ Error al obtener raciones:", error);
    }
  };

  const saveRaciones = async (
    values: typeof initialRationValues,
    actions: FormikHelpers<typeof initialRationValues>
  ) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    try {
      await RationService.insertarRacion({
        date: values.date,
        price: Number(values.price),
        users: { idUser: user.idUser },
        beneficiary: {
          idBeneficiary: Number(values.dniBenefeciary), // ← Este debe ser el ID real del beneficiario
        },
        rationType: {
          idRationType: 1, // ← Aquí debes obtener el ID del tipo de ración, no el nombre
        },
      });

      actions.resetForm();
      getRaciones();
    } catch (error) {
      console.error("❌ Error al guardar ración:", error);
    }
  };

  useEffect(() => {
    getRaciones();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 4 }}>
        <Stack spacing={5}>
          {/* Formulario */}
          <div className="formulario-raciones">
            <Formik
              initialValues={initialRationValues}
              validationSchema={validationSchema}
              onSubmit={saveRaciones}
            >
              {({ errors, touched }) => (
                <Form>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    alignItems="flex-end"
                  >
                    <div className="form-group-raciones">
                      <label className="titulo-arriba-form">Fecha</label>
                      <Field name="date" className="form-input-fecha">
                        {({ field, form, meta }: FieldProps) => (
                          <MobileDatePicker
                            format="DD/MM/YYYY"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) =>
                              form.setFieldValue(
                                "date",
                                date?.format("YYYY-MM-DD")
                              )
                            }
                            slotProps={{
                              textField: {
                                className: "form-input",
                                error: meta.touched && Boolean(meta.error),
                                helperText: meta.touched && meta.error,
                              },
                            }}
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-raciones">
                      <label className="titulo-arriba-form">
                        Tipo de ración
                      </label>
                      <Field name="tipoRacion">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={
                              touched.nameRationType &&
                              Boolean(errors.nameRationType)
                            }
                            helperText={
                              touched.nameRationType && errors.nameRationType
                            }
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

                    <div className="form-group-raciones">
                      <label className="titulo-arriba-form">DNI</label>
                      <Field name="dni">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            id="dniBenefeciary"
                            className="form-input"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              maxLength: 8,
                              onKeyDown: (e) => {
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  e.key !== "Backspace" &&
                                  e.key !== "Tab"
                                ) {
                                  e.preventDefault();
                                }
                              },
                            }}
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-raciones">
                      <label className="titulo-arriba-form">
                        Precio por ración
                      </label>
                      <Field name="precio" className="boton-verde">
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            className="form-input"
                            error={touched.price && Boolean(errors.price)}
                            helperText={touched.price && errors.price}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  S/
                                </InputAdornment>
                              ),
                              inputProps: {
                                onKeyDown: (
                                  e: React.KeyboardEvent<HTMLInputElement>
                                ) => {
                                  const allowedKeys = [
                                    "Backspace",
                                    "Tab",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Delete",
                                  ];
                                  const isNumber = /^[0-9.]$/.test(e.key);

                                  if (
                                    !isNumber &&
                                    !allowedKeys.includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }

                                  if (
                                    e.key === "." &&
                                    field.value.includes(".")
                                  ) {
                                    e.preventDefault();
                                  }
                                },
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
          <Box className="table-container-raciones">
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <em>Fecha</em>
                    </TableCell>
                    <TableCell>
                      <em>Tipo de ración</em>
                    </TableCell>
                    <TableCell>
                      <em>DNI</em>
                    </TableCell>
                    <TableCell>
                      <em>Precio por ración</em>
                    </TableCell>
                    <TableCell>
                      <em>Acciones</em>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {raciones.map((racion) => (
                    <TableRow key={racion.idRation}>
                      <TableCell>
                        {dayjs(racion.date).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>{racion.nameRationType}</TableCell>
                      <TableCell>{racion.dniBenefeciary}</TableCell>
                      <TableCell>S/ {racion.price.toFixed(2)}</TableCell>
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

export default RegistroRaciones;
