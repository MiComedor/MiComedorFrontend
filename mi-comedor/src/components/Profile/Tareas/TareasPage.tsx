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
} from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
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

const initialTaskCoordinationValues: TaskCoordination = {
  fullname: "",
  typeOfTask: undefined,
  dateTask: "",
  timeTask: "",
};
const today = dayjs();
const todayStartOfTheDay = today.startOf("day");

const validationSchema = Yup.object({
  date: Yup.string().required("Campo obligatorio"),
  rationType: Yup.object()
    .shape({
      idRationType: Yup.number().required("Campo obligatorio"),
    })
    .required("Campo obligatorio"),
  beneficiary: Yup.object()
    .shape({
      idBeneficiary: Yup.number().required("Campo obligatorio"),
    })
    .required("Campo obligatorio"),
  price: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser un número positivo")
    .required("Campo obligatorio"),
});

const RegistroTareas: React.FC = () => {
  const [tareas, setTareas] = useState<TaskCoordinationByUserId[]>([]);
  const [tipoTarea, setTipoTarea] = useState<TypeOfTask[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              onSubmit={() => {}}
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
                      <Field name="fullname" className="boton-verde">
                        {({ field }: FieldProps) => (
                          <TextField
                          fullWidth
                            {...field}
                            className="form-input"
                            error={touched.fullname && Boolean(errors.fullname)}
                            helperText={touched.fullname && errors.fullname}
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
                                helperText={meta.touched && meta.error}
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
                          <MobileDatePicker
                            format="DD/MM/YYYY"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) =>
                              form.setFieldValue(
                                "dateTask",
                                date?.format("YYYY-MM-DD")
                              )
                            }
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
                        )}
                      </Field>
                    </div>

                    <div className="form-group-tareas">
                      <label className="titulo-arriba-form">Hora</label>
                      <Field name="timeTask">
                        {({ form, field, meta }: FieldProps) => (
                          <TimePicker
                            enableAccessibleFieldDOMStructure={false}
                            value={field.value || todayStartOfTheDay}
                            onChange={(newValue) => {
                              form.setFieldValue(field.name, newValue);
                            }}
                            disablePast
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

          {/* Tabla */}
          {isMobile ? (
            <Stack spacing={2}>
              {tareas.map((tarea) => (
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

                  <Stack direction="row" spacing={1} mt={1}>
                    <IconButton color="primary" onClick={() => {}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => {}}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
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
                    {tareas.map((tarea) => (
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
                            <EditIcon onClick={() => {}} />
                          </IconButton>
                          <IconButton color="error" onClick={() => {}}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
            >
              REGRESAR AL MENÚ
            </Button>
          </Box>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default RegistroTareas;
