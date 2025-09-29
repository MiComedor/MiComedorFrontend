import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import Ration from "../../../types/ration.type";
import RationType from "../../../types/TypeRation";
import BeneficiaryByUserId from "../../../types/BeneficiaryByUserId";
import { Snackbar, Alert } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import beneficiaryService from "../../../services/beneficiary.service";
import "./EditRacionesDialog.css";

type FormRationValues = {
  date: string;
  price: number;
  rationType: RationType | null;
  beneficiary: BeneficiaryByUserId | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: Ration;
  onSubmit: (values: Ration) => void;
  rationTypes: RationType[];
  beneficiaries: BeneficiaryByUserId[];
};

const validationSchema = Yup.object({
  date: Yup.string().required("Campo obligatorio"),
  rationType: Yup.object()
    .shape({
      idRationType: Yup.number().required("Campo obligatorio"),
    })
    .nullable()
    .required("Campo obligatorio"),
  beneficiary: Yup.object()
    .shape({
      idBeneficiary: Yup.number().required("Campo obligatorio"),
    })
    .nullable()
    .required("Campo obligatorio"),
  price: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser positivo")
    .required("Campo obligatorio"),
});

export default function EditRationDialog({
  open,
  onClose,
  data,
  onSubmit,
  rationTypes,
  beneficiaries,
}: Props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpenInactive, setSnackbarOpenInactive] = useState(false);
  const [snackbarMessageInactive, setSnackbarMessageInactive] = useState("");
  const [beneficiariosActivos, setBeneficiariosActivos] = useState<
    (BeneficiaryByUserId & { firstLetter: string })[]
  >([]);

  const selectedBeneficiary = useMemo(
    () =>
      beneficiaries.find(
        (b) => b.idBeneficiary === data.beneficiary?.idBeneficiary
      ) || null,
    [beneficiaries, data.beneficiary?.idBeneficiary]
  );

  const BeneficiariosActivosLista = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    beneficiaryService.buscarBeneficiaryPorUserId(user.idUser).then((data) => {
      const beneficiariosConLetra = data.map((b) => ({
        ...b,
        firstLetter: b.fullnameBenefeciary.charAt(0).toUpperCase(),
        isActive: b.active === undefined ? true : b.active,
      }));
      setBeneficiariosActivos(beneficiariosConLetra);
    });
  };

  useEffect(() => {
    BeneficiariosActivosLista();
    if (selectedBeneficiary && selectedBeneficiary.active === false) {
      setSnackbarMessageInactive(
        "Este beneficiario se encuentra eliminado de la lista de beneficiarios."
      );
      setSnackbarOpenInactive(true);
    } else {
      setSnackbarOpenInactive(false);
    }
  }, [open, selectedBeneficiary]);

  const handleSnackClose = (_?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    onClose(); // cierra el dialog cuando el snackbar termina
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        className="container-dialog-ration-edit"
      >
        <DialogTitle
          className="titulo-dialog-editar-ration"
          sx={{ fontWeight: "bold", fontSize: 30, textAlign: "left" }}
        >
          Editar Ración
        </DialogTitle>

        <Formik<FormRationValues>
          enableReinitialize
          initialValues={{
            date: data.date,
            price: data.price,
            rationType:
              rationTypes.find(
                (r) => r.idRationType === data.rationType?.idRationType
              ) || null,
            beneficiary: selectedBeneficiary,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const isRationTypeInvalid =
              !values.rationType || !values.rationType.idRationType;
            const isBeneficiaryInvalid =
              !values.beneficiary || !values.beneficiary.idBeneficiary;
            const isDateInvalid = !values.date || values.date.trim() === "";
            const isPriceInvalid = !values.price || isNaN(Number(values.price));

            if (
              isRationTypeInvalid ||
              isBeneficiaryInvalid ||
              isDateInvalid ||
              isPriceInvalid
            ) {
              setSnackbarMessage("❌ ¡No puede haber campos vacíos!");
              setSnackbarOpen(true);
              return;
            }

            const updatedRation: Ration = {
              ...data,
              date: values.date,
              price: Number(values.price),
              rationType: {
                idRationType: values.rationType!.idRationType,
              },
              beneficiary: {
                idBeneficiary: values.beneficiary!.idBeneficiary,
              },
            };

            onSubmit(updatedRation);
            setSnackbarMessage("✅ ¡Ración actualizada correctamente!");
            setSnackbarOpen(true); // Mostrar Snackbar
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <DialogContent className="dialog-content-ration">
                <label className="titulo-arriba-form-racion">Fecha</label>
                <TextField
                  className="textfield-ration"
                  name="date"
                  type="date"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={values.date}
                  onChange={(e) => setFieldValue("date", e.target.value)}
                  error={touched.date && Boolean(errors.date)}
                  helperText={touched.date && errors.date}
                  inputProps={{
                    min: (() => {
                      const today = new Date();
                      const minDate = new Date(today);
                      minDate.setDate(today.getDate() - 2);
                      return minDate.toISOString().split("T")[0];
                    })(),
                    max: (() => {
                      const today = new Date();
                      return today.toISOString().split("T")[0];
                    })(),
                  }}
                />
                <label className="titulo-arriba-form-racion">
                  Tipo de Ración
                </label>
                <Autocomplete
                  options={rationTypes}
                  getOptionLabel={(option) => option.nameRationType}
                  isOptionEqualToValue={(opt, val) =>
                    opt.idRationType === val?.idRationType
                  }
                  value={values.rationType}
                  onChange={(_, value) => setFieldValue("rationType", value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="textfield-ration"
                      margin="dense"
                      fullWidth
                      error={touched.rationType && Boolean(errors.rationType)}
                      helperText={
                        touched.rationType &&
                        typeof errors.rationType === "object"
                      }
                    />
                  )}
                />
                <label className="titulo-arriba-form-racion">Dni</label>
                <Autocomplete
                  options={beneficiariosActivos.sort((a, b) =>
                    a.firstLetter.localeCompare(b.firstLetter)
                  )}
                  getOptionLabel={(option) =>
                    `${option.dniBenefeciary} / ${option.fullnameBenefeciary}`
                  }
                  isOptionEqualToValue={(opt, val) =>
                    opt.idBeneficiary === val?.idBeneficiary
                  }
                  value={values.beneficiary}
                  onChange={(_, value) => setFieldValue("beneficiary", value)}
                  renderInput={(params) => (
                    <TextField
                      className="textfield-ration"
                      {...params}
                      margin="dense"
                      fullWidth
                      error={Boolean(touched.beneficiary && errors.beneficiary)}
                      helperText={
                        touched.beneficiary && errors.beneficiary
                          ? "Campo obligatorio"
                          : ""
                      }
                    />
                  )}
                />

                <label className="titulo-arriba-form-racion">
                  Precio por Ración
                </label>
                <TextField
                  className="textfield-ration"
                  name="price"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={values.price}
                  onChange={(e) => {
                    let rawValue = e.target.value;

                    // Permitir solo hasta 3 dígitos antes del punto y hasta 2 después
                    const regex = /^\d{0,4}(\.\d{0,2})?$/;

                    // Si el valor cumple con el regex, actualizamos el estado
                    if (regex.test(rawValue)) {
                      setFieldValue("price", rawValue);
                    }
                  }}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                  }}
                />

              </DialogContent>

              <DialogActions
                className="dialog-actions-ration"
                sx={{ justifyContent: "center", gap: 4 }}
              >
                <Button onClick={onClose}>X</Button>
                <Button type="submit">✔</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 100 }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackbarMessage.startsWith("❌") ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar> 

      <Snackbar
        open={snackbarOpenInactive}
        autoHideDuration={10000} // 10 segundos para el mensaje del beneficiario inactivo
        onClose={() => setSnackbarOpenInactive(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 1500 }}
      >
        <Alert
          onClose={() => setSnackbarOpenInactive(false)}
          severity="warning"
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: "#ff9800", // Naranja
            color: "#000000ff", // Color del texto
            "& .MuiAlert-icon": { color: "#000000ff" }, // Color del icono
          }}
        >
          {snackbarMessageInactive}
        </Alert>
      </Snackbar>
    </>
  );
}
