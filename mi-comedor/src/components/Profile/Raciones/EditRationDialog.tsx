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
      }));
      setBeneficiariosActivos(beneficiariosConLetra);
    });
  };
  

  useEffect(() => {
    BeneficiariosActivosLista();
  }, []);

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
            setSnackbarOpen(true);
            setTimeout(() => {
              onClose();
            }, 1000);
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
                  onChange={(e) => setFieldValue("price", e.target.value)}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">S/</InputAdornment>
                    ),
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
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 1500 }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
