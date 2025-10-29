import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
  Box,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Beneficiary from "../../../types/beneficiaty";

const validationSchema = Yup.object({
  fullnameBenefeciary: Yup.string()
    .required("Campo obligatorio")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras"),
  dniBenefeciary: Yup.string()
    .required("Campo obligatorio")
    .matches(/^\d{8}$/, "Debe tener exactamente 8 dígitos numéricos")
    .matches(/^[0-9]+$/, "Solo se permiten números"),
  ageBeneficiary: Yup.string()
    .required("Campo obligatorio")
    .matches(/^[1-9][0-9]?$/, "Debe ser un número válido entre 1 y 99"),
  observationsBeneficiary: Yup.string(),
});

type FormikHelpersLite = {
  setFieldError: (name: string, message?: string) => void;
  setSubmitting: (isSubmitting: boolean) => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Beneficiary, helpers: FormikHelpersLite) => Promise<void>;
  initialData: Beneficiary;
};

// Normaliza y crea un "shape" comparable para evitar falsos positivos/negativos
const toComparable = (v: Beneficiary) => ({
  fullnameBenefeciary: (v.fullnameBenefeciary || "").trim(),
  dniBenefeciary: String(v.dniBenefeciary || ""),
  ageBeneficiary: String(v.ageBeneficiary ?? "").trim(),
  observationsBeneficiary: (v.observationsBeneficiary || "").trim(),
  idBeneficiary: v.idBeneficiary ?? null, // por si lo necesitas arriba
});

const EditBeneficiariosDialog: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  // Snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const initialComparable = useMemo(() => toComparable(initialData), [initialData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{
        sx: {
          backgroundColor: "#E4FAA4",
          borderRadius: 2,
          overflow: "visible",
          maxWidth: 420,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 22, py: 2 }}>
        Editar beneficiario
      </DialogTitle>

      <Formik
        initialValues={initialData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          // Comparación adicional por seguridad: si no hay cambios, no enviamos
          const currentComparable = toComparable(values);
          if (
            JSON.stringify(currentComparable) === JSON.stringify(initialComparable)
          ) {
            setSnackMsg("No hay cambios para guardar.");
            setSnackSeverity("info");
            setSnackOpen(true);
            helpers.setSubmitting(false);
            return;
          }

          // 👉 PASA helpers AL PADRE
          await onSubmit(values, {
            setFieldError: helpers.setFieldError,
            setSubmitting: helpers.setSubmitting,
          });
        }}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isSubmitting,
          dirty,
          isValid,
        }) => (
          <Form>
            <DialogContent sx={{ px: 3, pb: 2 }}>
              <Stack spacing={2.5}>
                <Box>
                  <h6 className="titulo-arriba-form" style={{ fontSize: 19, margin: 0 }}>
                    Nombre completo
                  </h6>
                  <TextField
                    name="fullnameBenefeciary"
                    fullWidth
                    size="medium"
                    value={values.fullnameBenefeciary}
                    onChange={handleChange}
                    error={
                      touched.fullnameBenefeciary && Boolean(errors.fullnameBenefeciary)
                    }
                    helperText={touched.fullnameBenefeciary && errors.fullnameBenefeciary}
                    InputProps={{
                      sx: {
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow: "1px 1px 4px rgba(0,0,0,0.10)",
                        border: "none",
                        fontSize: 17,
                        height: 48,
                      },
                      onKeyDown: (e) => {
                        if (
                          !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]$/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                      },
                    }}
                  />
                </Box>

                <Box>
                  <h6 className="titulo-arriba-form" style={{ fontSize: 19, margin: 0 }}>
                    Edad
                  </h6>
                  <TextField
                    name="ageBeneficiary"
                    type="number"
                    fullWidth
                    size="medium"
                    value={values.ageBeneficiary}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (/^\d{0,2}$/.test(inputValue)) {
                        if (inputValue.length === 1 && inputValue === "0") {
                          setFieldValue("ageBeneficiary", "");
                        } else {
                          setFieldValue("ageBeneficiary", inputValue);
                        }
                      }
                    }}
                    inputProps={{
                      maxLength: 2,
                      onKeyDown: (e) => {
                        if (["-", "e", "E", "+", ".", ","].includes(e.key)) {
                          e.preventDefault();
                        }
                      },
                      onWheel: (e) => e.currentTarget.blur(),
                    }}
                    error={touched.ageBeneficiary && Boolean(errors.ageBeneficiary)}
                    helperText={
                      touched.ageBeneficiary && values.ageBeneficiary === 0
                        ? "La edad debe ser mayor a 0."
                        : touched.ageBeneficiary && errors.ageBeneficiary
                        ? "Por favor ingrese una edad válida (mayor a 0)."
                        : ""
                    }
                    InputProps={{
                      sx: {
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow: "1px 1px 4px rgba(0,0,0,0.10)",
                        border: "none",
                        fontSize: 17,
                        height: 48,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <h6 className="titulo-arriba-form" style={{ fontSize: 19, margin: 0 }}>
                    DNI
                  </h6>
                  <TextField
                    name="dniBenefeciary"
                    fullWidth
                    size="medium"
                    value={values.dniBenefeciary}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 8) val = val.slice(0, 8);
                      if (val.length > 0 && val[0] === "0") {
                        val = val.replace(/^0+/, "");
                      }
                      setFieldValue("dniBenefeciary", val);
                    }}
                    inputProps={{
                      maxLength: 8,
                      onKeyDown: (e) => {
                        if (["-", "e", "E", "+", ".", ","].includes(e.key)) {
                          e.preventDefault();
                        }
                      },
                      inputMode: "numeric",
                    }}
                    error={touched.dniBenefeciary && Boolean(errors.dniBenefeciary)}
                    helperText={touched.dniBenefeciary && errors.dniBenefeciary}
                    InputProps={{
                      sx: {
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow: "1px 1px 4px rgba(0,0,0,0.10)",
                        border: "none",
                        fontSize: 17,
                        height: 48,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <h6 className="titulo-arriba-form" style={{ fontSize: 19, margin: 0 }}>
                    Observaciones
                  </h6>
                  <TextField
                    name="observationsBeneficiary"
                    fullWidth
                    multiline
                    rows={3}
                    size="medium"
                    value={values.observationsBeneficiary}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow: "1px 1px 4px rgba(0,0,0,0.10)",
                        border: "none",
                        fontSize: 17,
                        minHeight: 48,
                      },
                    }}
                  />
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="space-around" mt={3}>
                <Button
                  type="button"
                  onClick={onClose}
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    minWidth: 60,
                    height: 60,
                    borderRadius: 2.5,
                    "&:hover": { backgroundColor: "#b71c1c" },
                  }}
                  disabled={isSubmitting}
                >
                  <CloseIcon sx={{ fontSize: 34 }} />
                </Button>

                {/* ✔ Gris cuando !dirty || !isValid, color normal cuando se edita y es válido */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !dirty || !isValid}
                  sx={{
                    backgroundColor:
                      isSubmitting || !dirty || !isValid ? "#bdbdbd" : "#1976D2",
                    color: "white",
                    minWidth: 60,
                    height: 60,
                    borderRadius: 2.5,
                    "&:hover": {
                      backgroundColor:
                        isSubmitting || !dirty || !isValid ? "#bdbdbd" : "#0d47a1",
                      cursor:
                        isSubmitting || !dirty || !isValid
                          ? "not-allowed"
                          : "pointer",
                    },
                    transition: "background-color 0.2s ease-in-out",
                  }}
                >
                  <CheckIcon sx={{ fontSize: 34 }} />
                </Button>
              </Stack>
            </DialogContent>
          </Form>
        )}
      </Formik>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditBeneficiariosDialog;
