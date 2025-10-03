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
  TablePagination,
  Snackbar, // AGREGADO: Importar Snackbar para notificaciones
  Alert, // AGREGADO: Importar Alert para el diseño del mensaje
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
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TaskCoordinationByUserId from "../../../types/taskCoordinationByUserId";
import TypeOfTask from "../../../types/TypeTask";
import TaskOfCoordinatioService from "../../../services/TaskOfCoordinatio.service";
import TypeTaskService from "../../../services/TypeTask.service";
import TaskCoordination from "../../../types/taskCoordination";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import EditTareasDialog from "./EditTareasDialog";
import "./Tareas.css";
import DeleteTareasDialog from "./DeleteTareasDialog";
import { useNavigate } from "react-router-dom";
import "dayjs/locale/es";
dayjs.locale("es");

const initialTaskCoordinationValues: TaskCoordination = {
  fullname: "",
  typeOfTask: undefined,
  dateTask: "",
  timeTask: "",
};

const validationSchema = Yup.object({
  fullname: Yup.string()
    .trim()
    .matches(/^[A-Za-z\s]+$/, "Solo se permiten letras y espacios")
    .min(2, "Mínimo 2 caracteres")
    .max(60, "Máximo 60 caracteres")
    .required("Campo obligatorio"),
  typeOfTask: Yup.object()
    .shape({
      idTypeOfTask: Yup.number().required(),
    })
    .nullable()
    .required("Campo obligatorio"),
  dateTask: Yup.string().required("Campo obligatorio"),
  timeTask: Yup.string().required("Campo obligatorio"),
});

const RegistroTareas: React.FC = () => {
  const [tareas, setTareas] = useState<TaskCoordinationByUserId[]>([]);
  const [tipoTarea, setTipoTarea] = useState<TypeOfTask[]>([]);
  const [dialogOpenEdit, setDialogOpenEdit] = useState(false);
  const [editing, setEditing] = useState<TaskCoordination | null>(null);
  const [dialogOpenDelete, setDialogOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState<TaskCoordination | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const startOfWeek = dayjs().startOf("week").add(1, "day"); // lunes
  const endOfWeek = dayjs().endOf("week").add(1, "day"); // domingo

  // AGREGADO: Estados para controlar la notificación
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEdit = (tarea: TaskCoordinationByUserId) => {
    const tipoSeleccionado = tipoTarea.find(
      (t) => t.nameTypeTask === tarea.nameTypeTask
    );
    const fullTarea: TaskCoordination = {
      idTaskCoordination: tarea.idTaskCoordination,
      fullname: tarea.fullname,
      dateTask: tarea.dateTask,
      timeTask: tarea.timeTask,
      typeOfTask: tipoSeleccionado?.idTypeOfTask
        ? { idTypeOfTask: tipoSeleccionado.idTypeOfTask }
        : undefined,
    };

    setEditing(fullTarea);
    setDialogOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setDialogOpenEdit(false);
    setEditing(null);
  };

  const handleCloseDelete = () => {
    setDialogOpenDelete(false);
    setDeleting(null);
  };

  const handleOpenDelete = (tarea: TaskCoordinationByUserId) => {
    const fullTarea: TaskCoordination = {
      idTaskCoordination: tarea.idTaskCoordination,
      fullname: tarea.fullname,
      dateTask: tarea.dateTask,
      timeTask: tarea.timeTask,
    };

    setDeleting(fullTarea);
    setDialogOpenDelete(true);
  };

  // AGREGADO: Función para cerrar el Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const editTareas = async (values: typeof initialTaskCoordinationValues) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user || !values.typeOfTask) return;

    try {
      await TaskOfCoordinatioService.actualizarTarea({
        idTaskCoordination: values.idTaskCoordination,
        fullname: values.fullname,
        dateTask: values.dateTask,
        timeTask: values.timeTask,
        users: { idUser: user.idUser },
        typeOfTask: { idTypeOfTask: values.typeOfTask.idTypeOfTask },
      });

      getTareas();
      handleCloseEdit();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };
  const getTareas = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    TaskOfCoordinatioService.buscarTareaPorUserId(user.idUser).then(
      (tareaList) => {
        const listaTareas = tareaList
          .map((r) => ({
            idTaskCoordination: r.idTaskCoordination,
            fullname: r.fullname,
            dateTask: r.dateTask,
            timeTask: r.timeTask,
            nameTypeTask: r.nameTypeTask,
          }))
          .reverse();
        setTareas(listaTareas);
      }
    );

    TypeTaskService.listarTipoDeTarea().then((tipoTarea) => {
      const listaTareas = tipoTarea.map((r) => ({
        idTypeOfTask: r.idTypeOfTask,
        nameTypeTask: r.nameTypeTask,
      }));
      setTipoTarea(listaTareas);
    });
  };

  const saveTarea = async (
    values: typeof initialTaskCoordinationValues,
    actions: FormikHelpers<typeof initialTaskCoordinationValues>
  ) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    try {
      await TaskOfCoordinatioService.insertarTarea({
        fullname: values.fullname,
        dateTask: values.dateTask,
        timeTask: values.timeTask,
        users: {
          idUser: user.idUser,
        },
        typeOfTask: {
          idTypeOfTask: values.typeOfTask!.idTypeOfTask,
        },
      });

      // AGREGADO: Mostrar notificación de éxito
      setSnackbarMessage("Tarea guardada exitosamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      actions.resetForm();
      getTareas();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      // AGREGADO: Mostrar notificación de error
      setSnackbarMessage("Error al guardar la tarea");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const deleteTareas = async (values: TaskCoordination) => {
    try {
      if (!values.idTaskCoordination) return;

      await TaskOfCoordinatioService.eliminarTarea(values.idTaskCoordination);

      getTareas();
      handleCloseDelete();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  useEffect(() => {
    getTareas();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 4 }}>
        <Stack spacing={5}>
          {/* Formulario */}
          <div className="formulario-tareas">
            <Formik
              initialValues={initialTaskCoordinationValues}
              validationSchema={validationSchema}
              onSubmit={saveTarea}
            >
              {({ errors, touched }) => (
                <Form>
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={2}
                    justifyContent="center"
                    alignItems={isMobile ? "center" : "flex-end"}
                    sx={{ width: "100%" }}
                    flexWrap={isMobile ? "wrap" : "nowrap"}
                  >
                    <div className="form-group-tareas">
                      <label className="titulo-arriba-form">Responsable</label>
                      <Field name="fullname">
                        {({ field, form }: FieldProps) => (
                          <TextField
                            fullWidth
                            {...field}
                            className="form-input"
                            error={touched.fullname && Boolean(errors.fullname)}
                            helperText={touched.fullname && errors.fullname}
                            onChange={(e) => {
                              let value = e.target.value.replace(
                                /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g,
                                ""
                              );

                              if (value.length > 30) {
                                value = value.slice(0, 30);
                              }

                              form.setFieldValue("fullname", value);
                            }}
                            inputProps={{
                              maxLength: 30,
                              onKeyDown: (e) => {
                                if (
                                  !/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]$/.test(e.key) &&
                                  e.key.length === 1
                                ) {
                                  e.preventDefault();
                                }
                              },
                            }}
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-tareas">
                      <label className="titulo-arriba-form">
                        Tipo de Tarea
                      </label>
                      <Field name="typeOfTask" className="form-input-tarea">
                        {({ form, field, meta }: FieldProps) => (
                          <Autocomplete
                            disablePortal
                            options={tipoTarea}
                            getOptionLabel={(option) => option.nameTypeTask}
                            isOptionEqualToValue={(option, value) =>
                              option.idTypeOfTask === value?.idTypeOfTask
                            }
                            value={field.value || null}
                            onChange={(_, newValue) => {
                              form.setFieldValue("typeOfTask", newValue);
                            }}
                            onClose={() => {
                              if (
                                document.activeElement instanceof HTMLElement
                              ) {
                                document.activeElement.blur();
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                className="form-input"
                                error={meta.touched && Boolean(meta.error)}
                                helperText={
                                  meta.touched
                                    ? typeof meta.error === "string"
                                      ? meta.error
                                      : meta.error &&
                                        typeof meta.error === "object"
                                      ? String(Object.values(meta.error)[0])
                                      : ""
                                    : ""
                                }
                              />
                            )}
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group-tareas">
                      <label className="titulo-arriba-form">Fecha</label>
                      <Field name="dateTask" className="form-input-tarea">
                        {({ field, form, meta }: FieldProps) => (
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="es"
                          >
                            <MobileDatePicker
                              format="DD/MM/YYYY"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) =>
                                form.setFieldValue(
                                  "dateTask",
                                  date ? date.format("YYYY-MM-DD") : ""
                                )
                              }
                              minDate={startOfWeek}
                              maxDate={endOfWeek}
                              slotProps={{
                                textField: {
                                  className: "form-input",
                                  error: meta.touched && Boolean(meta.error),
                                  helperText: meta.touched && meta.error,
                                  sx: {
                                    border: "2.5px solid black",
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      </Field>
                    </div>

                    <div className="form-group-tareas">
                      <label className="titulo-arriba-form">Hora</label>
                      <Field name="timeTask">
                        {({ field, form, meta }: FieldProps) => (
                          <TimePicker
                            name="startTime"
                            enableAccessibleFieldDOMStructure={false}
                            value={
                              field.value &&
                              dayjs(field.value, "HH:mm:ss").isValid()
                                ? dayjs(field.value, "HH:mm:ss")
                                : null
                            }
                            onChange={(newValue) => {
                              if (newValue) {
                                form.setFieldValue(
                                  field.name,
                                  dayjs(newValue).format("HH:mm:ss")
                                );
                              }
                            }}
                            slots={{ textField: TextField }}
                            slotProps={{
                              textField: {
                                error: meta.touched && Boolean(meta.error),
                                helperText: meta.touched && meta.error,
                                className: "form-input",
                              },
                            }}
                          />
                        )}
                      </Field>
                    </div>

                    <IconButton
                      type="submit"
                      className="boton-verde"
                      sx={{
                        width: isMobile ? 255 : 60,
                        height: isMobile ? 60 : 60,
                        alignSelf: isMobile ? "center" : "flex-end",
                        mt: isMobile ? 1 : 0,
                        borderRadius: 2,
                      }}
                    >
                      <AddIcon sx={{ fontSize: 42 }} />
                    </IconButton>
                  </Stack>
                </Form>
              )}
            </Formik>
          </div>

          {/* AGREGADO: Snackbar para mostrar notificaciones en la esquina inferior derecha */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "100%", fontSize: "1rem" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Tabla */}
          {isMobile ? (
            <>
              <Stack spacing={2}>
                {tareas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((tarea) => (
                    <Paper
                      key={tarea.idTaskCoordination}
                      elevation={3}
                      sx={{ padding: 2, borderRadius: 2 }}
                    >
                      <div>
                        <strong>Responsable: </strong>
                        {tarea.fullname}
                      </div>

                      <div>
                        <strong>Tipo:</strong> {tarea.nameTypeTask}
                      </div>

                      <div>
                        <strong>Fecha:</strong>{" "}
                        {dayjs(tarea.dateTask).format("DD/MM/YYYY")}
                      </div>

                      <div>
                        <strong>Hora:</strong>{" "}
                        {dayjs(tarea.timeTask, "HH:mm:ss").format("HH:mm")}
                      </div>

                      <Box
                        mt={2}
                        display="flex"
                        justifyContent="center"
                        gap={2}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenEdit(tarea)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOpenDelete(tarea)}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </Paper>
                  ))}
              </Stack>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={tareas.length}
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
                    flexDirection: "column",
                    alignItems: "flex-start",
                    px: 1,
                    gap: 1,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: "0.85rem",
                    },
                  "& .MuiTablePagination-actions": {
                    alignSelf: "flex-end",
                  },
                }}
              />
            </>
          ) : (
            <Box className="table-container-tareas">
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <em>Responsable</em>
                      </TableCell>
                      <TableCell>
                        <em>Tipo de tarea</em>
                      </TableCell>
                      <TableCell>
                        <em>Fecha</em>
                      </TableCell>
                      <TableCell>
                        <em>Hora</em>
                      </TableCell>
                      <TableCell>
                        <em>Acciones</em>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tareas
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((tarea) => (
                        <TableRow key={tarea.idTaskCoordination}>
                          <TableCell>{tarea.fullname}</TableCell>
                          <TableCell>{tarea.nameTypeTask}</TableCell>
                          <TableCell>
                            {dayjs(tarea.dateTask).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell>
                            {dayjs(tarea.timeTask, "HH:mm:ss").format("HH:mm")}
                          </TableCell>
                          <TableCell>
                            <IconButton color="primary">
                              <EditIcon onClick={() => handleOpenEdit(tarea)} />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDelete(tarea)}
                            >
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
                  count={tareas.length}
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
            </Box>
          )}
          {/* Botón de regresar */}
          <Box>
            <Button
              variant="contained"
              color="warning"
              startIcon={<ArrowBackIcon />}
              sx={{ fontWeight: "bold" }}
              onClick={() => navigate("/profile")}
            >
              REGRESAR AL MENÚ
            </Button>
          </Box>
          {editing && (
            <EditTareasDialog
              open={dialogOpenEdit}
              onClose={handleCloseEdit}
              data={editing}
              onSubmit={editTareas}
              typesTasks={tipoTarea}
            />
          )}
          {deleting && (
            <DeleteTareasDialog
              open={dialogOpenDelete}
              onClose={handleCloseDelete}
              data={deleting}
              onSubmit={deleteTareas}
              rationTypes={tipoTarea}
            />
          )}
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default RegistroTareas;