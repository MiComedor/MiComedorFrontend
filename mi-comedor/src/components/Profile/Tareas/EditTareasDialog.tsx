import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import TypeOfTask from "../../../types/TypeTask";
import TaskCoordination from "../../../types/taskCoordination";
import { MobileDatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import "./EditTareasDialog.css";

type FormTareasValues = {
  fullname: string;
  typeOfTask: TypeOfTask | null;
  dateTask: string;
  timeTask: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: TaskCoordination;
  onSubmit: (values: TaskCoordination) => void;
  typesTasks: TypeOfTask[];
};

const validationSchema = Yup.object({
  fullname: Yup.string().required("Campo obligatorio"),
  typeOfTask: Yup.object()
    .shape({
      idTypeOfTask: Yup.number().required(),
    })
    .nullable()
    .required("Campo obligatorio"),
  dateTask: Yup.string().required("Campo obligatorio"),
  timeTask: Yup.string().required("Campo obligatorio"),
});

export default function EditTareasDialog({
  open,
  onClose,
  data,
  onSubmit,
  typesTasks,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      className="container-dialog-ration-edit"
    >
      <DialogTitle
        className="titulo-dialog-editar-tarea"
        sx={{ fontWeight: "bold", fontSize: 30, textAlign: "left" }}
      >
        Editar Tarea
      </DialogTitle>

      <Formik<FormTareasValues>
        enableReinitialize
        initialValues={{
          fullname: data.fullname,
          typeOfTask:
            typesTasks.find(
              (r) => r.idTypeOfTask === data.typeOfTask?.idTypeOfTask
            ) || null,
          dateTask: data.dateTask,
          timeTask: data.timeTask,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const updatedTask: TaskCoordination = {
            ...data,
            fullname: values.fullname,
            dateTask: values.dateTask,
            timeTask: values.timeTask,
            typeOfTask: {
              idTypeOfTask: values.typeOfTask!.idTypeOfTask ?? 0,
            },
          };
          onSubmit(updatedTask);
          onClose();
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <DialogContent className="dialog-edit-content-tarea">
              <label className="titulo-arriba-form-tarea">Responsable</label>
              <TextField
                className="textfield-tarea-edit"
                name="fullname"
                fullWidth
                margin="dense"
                value={values.fullname}
                onChange={(e) => setFieldValue("fullname", e.target.value)}
                error={touched.fullname && Boolean(errors.fullname)}
                helperText={touched.fullname && errors.fullname}
              />

              <label className="titulo-arriba-form-tarea">Tipo de Tarea</label>
              <Autocomplete
                options={typesTasks}
                getOptionLabel={(option) => option.nameTypeTask}
                isOptionEqualToValue={(opt, val) =>
                  opt.idTypeOfTask === val?.idTypeOfTask
                }
                value={values.typeOfTask}
                onChange={(_, value) => setFieldValue("typeOfTask", value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="textfield-tarea-edit"
                    margin="dense"
                    fullWidth
                    error={touched.typeOfTask && Boolean(errors.typeOfTask)}
                    helperText={
                      touched.typeOfTask &&
                      typeof errors.typeOfTask === "object"
                    }
                  />
                )}
              />

              <label className="titulo-arriba-form-tarea">Fecha</label>
              <MobileDatePicker
                format="YYYY-MM-DD"
                value={values.dateTask ? dayjs(values.dateTask) : null}
                onChange={(newDate) =>
                  setFieldValue(
                    "dateTask",
                    newDate ? newDate.format("YYYY-MM-DD") : ""
                  )
                }
                slotProps={{
                  textField: {
                    className: "textfield-tarea-edit",
                    fullWidth: true,
                    margin: "dense",
                    error: touched.dateTask && Boolean(errors.dateTask),
                    helperText: touched.dateTask && errors.dateTask,
                    sx: {
                      border: "2.45px solid black",
                    },
                  },
                }}
              />

              <label className="titulo-arriba-form-tarea">Hora</label>
              <TimePicker
                ampm={false}
                value={
                  values.timeTask &&
                  dayjs(values.timeTask, "HH:mm:ss").isValid()
                    ? dayjs(values.timeTask, "HH:mm:ss")
                    : null
                }
                onChange={(newTime) => {
                  if (newTime) {
                    setFieldValue(
                      "timeTask",
                      dayjs(newTime).format("HH:mm:ss")
                    );
                  }
                }}
                slotProps={{
                  textField: {
                    className: "textfield-tarea-edit",
                    fullWidth: true,
                    margin: "dense",
                    error: touched.timeTask && Boolean(errors.timeTask),
                    helperText: touched.timeTask && errors.timeTask,
                    sx: {
                      border: "2.45px solid black",
                    },
                  },
                }}
              />
            </DialogContent>

            <DialogActions
              className="dialog-edit-actions-tarea"
              sx={{ justifyContent: "center", gap: 4 }}
            >
              <Button onClick={onClose}>X</Button>
              <Button type="submit">✔</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
