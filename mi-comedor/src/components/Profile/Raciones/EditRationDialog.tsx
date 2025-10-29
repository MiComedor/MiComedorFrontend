import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import Ration from "../../../types/ration.type";
import RationType from "../../../types/TypeRation";
import BeneficiaryByUserId from "../../../types/BeneficiaryByUserId";
import { useState, useMemo, useEffect } from "react";
import beneficiaryService from "../../../services/beneficiary.service";
import "./EditRacionesDialog.css";

type FormRationValues = {
  date: string;
  price: number | string;
  rationType: RationType | null;
  beneficiary: BeneficiaryByUserId | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: Ration;
  onSubmit: (values: Ration) => void | Promise<void>;
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

// === Helpers ===
const normalizeDate = (d?: string) => (d ? d.split("T")[0] : "");

const toComparable = (v: {
  date: string;
  price: number | string;
  rationType?: { idRationType?: number } | null;
  beneficiary?: { idBeneficiary?: number } | null;
}) => ({
  date: normalizeDate(v.date),
  price: Number(v.price),
  rationTypeId: v.rationType?.idRationType ?? null,
  beneficiaryId: v.beneficiary?.idBeneficiary ?? null,
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
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [snackbarOpenInactive, setSnackbarOpenInactive] = useState(false);
  const [snackbarMessageInactive, setSnackbarMessageInactive] = useState("");

  const [beneficiariosActivos, setBeneficiariosActivos] = useState<
    (BeneficiaryByUserId & { firstLetter: string; isActive: boolean })[]
  >([]);

  const selectedBeneficiary = useMemo(
    () =>
      beneficiaries.find(
        (b) => b.idBeneficiary === data.beneficiary?.idBeneficiary
      ) || null,
    [beneficiaries, data.beneficiary?.idBeneficiary]
  );

  const initialComparable = useMemo(
    () =>
      toComparable({
        date: data.date,
        price: data.price,
        rationType: data.rationType,
        beneficiary: data.beneficiary,
      }),
    [data]
  );

  const initialFormikValues: FormRationValues = useMemo(
    () => ({
      date: normalizeDate(data.date),
      price: Number(data.price),
      rationType:
        rationTypes.find(
          (r) => r.idRationType === data.rationType?.idRationType
        ) ?? null,
      beneficiary:
        beneficiaries.find(
          (b) => b.idBeneficiary === data.beneficiary?.idBeneficiary
        ) ?? null,
    }),
    [data, rationTypes, beneficiaries]
  );

  const BeneficiariosActivosLista = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    beneficiaryService.buscarBeneficiaryPorUserId(user.idUser).then((data) => {
      const beneficiariosConLetra = data.map((b: any) => ({
        ...b,
        firstLetter: String(b.fullnameBenefeciary || "")
          .charAt(0)
          .toUpperCase(),
        isActive: b.active === undefined ? true : Boolean(b.active),
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
    onClose();
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
          initialValues={initialFormikValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const isRationTypeInvalid = !values.rationType?.idRationType;
            const isBeneficiaryInvalid = !values.beneficiary?.idBeneficiary;
            const isDateInvalid = !values.date?.trim();
            const isPriceInvalid =
              values.price === undefined || isNaN(Number(values.price));

            if (
              isRationTypeInvalid ||
              isBeneficiaryInvalid ||
              isDateInvalid ||
              isPriceInvalid
            ) {
              setSnackbarMessage("❌ ¡No puede haber campos vacíos!");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
              return;
            }

            const currentComparable = toComparable(values);

            if (
              JSON.stringify(currentComparable) ===
              JSON.stringify(initialComparable)
            ) {
              setSnackbarMessage("ℹ️ No hay cambios para guardar.");
              setSnackbarSeverity("info");
              setSnackbarOpen(true);
              return;
            }

            const updatedRation: Ration = {
              ...data,
              date: currentComparable.date,
              price: currentComparable.price,
              rationType: {
                idRationType: currentComparable.rationTypeId!,
              },
              beneficiary: {
                idBeneficiary: currentComparable.beneficiaryId!,
              },
            };

            try {
              const maybePromise = onSubmit(updatedRation) as any;
              if (maybePromise?.then) {
                await maybePromise;
              }
              setSnackbarMessage("✅ ¡Ración actualizada correctamente!");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
            } catch {
              setSnackbarMessage("❌ Ocurrió un error al actualizar.");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
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
                        touched.rationType && errors.rationType
                          ? "Campo obligatorio"
                          : ""
                      }
                    />
                  )}
                />

                <label className="titulo-arriba-form-racion">Dni</label>
                <Autocomplete
                  options={[...beneficiariosActivos].sort((a, b) =>
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
                    const rawValue = e.target.value;
                    const regex = /^\d{0,4}(\.\d{0,2})?$/;
                    if (regex.test(rawValue)) {
                      setFieldValue("price", rawValue);
                    }
                  }}
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
                <Button
                  onClick={onClose}
                  sx={{
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#e53935" },
                  }}
                >
                  X
                </Button>

                {/* ✅ Botón guardar con color dinámico */}
                <Button
                  type="submit"
                  disabled={!dirty || !isValid}
                  sx={{
                    backgroundColor: !dirty || !isValid ? "#bdbdbd" : "#2196f3",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor:
                        !dirty || !isValid ? "#bdbdbd" : "#1976d2",
                      cursor: !dirty || !isValid ? "not-allowed" : "pointer",
                    },
                    transition: "background-color 0.2s ease-in-out",
                  }}
                >
                  ✔
                </Button>

              </DialogActions>

            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Snackbar principal */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 100 }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar de beneficiario inactivo */}
      <Snackbar
        open={snackbarOpenInactive}
        autoHideDuration={10000}
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
            backgroundColor: "#ff9800",
            color: "#000000ff",
            "& .MuiAlert-icon": { color: "#000000ff" },
          }}
        >
          {snackbarMessageInactive}
        </Alert>
      </Snackbar>
    </>
  );
}
