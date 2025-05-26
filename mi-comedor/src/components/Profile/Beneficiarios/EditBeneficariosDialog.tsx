import React, { useState } from "react";
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
  fullnameBenefeciary: Yup.string().required("Campo obligatorio"),
  dniBenefeciary: Yup.string().required("Campo obligatorio"),
  ageBeneficiary: Yup.number().required("Campo obligatorio").positive(),
  observationsBeneficiary: Yup.string(),
});

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Beneficiary) => void;
  initialData: Beneficiary;
};

const EditBeneficiariosDialog: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (values: Beneficiary) => {
    onSubmit(values);
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
    }, 1500);
  };

  

  function setFieldValue(arg0: string, safeValue: string | number) {
  throw new Error("Function not implemented.");
}

  return (
    <>
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
          maxWidth: 420, // aumentado de 380 a 420
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: 22, py: 2 }}>
        Editar beneficiario
      </DialogTitle>

      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <DialogContent sx={{ px: 3, pb: 2 }}>
              <Stack spacing={2.5}>
                <Box>
                  <h6 className="titulo-arriba-form" style={{ fontSize: 19, margin: 0 }}>Nombre completo</h6>
                  <TextField
                    name="fullnameBenefeciary"
                    fullWidth
                    size="medium"
                    value={values.fullnameBenefeciary}
                    onChange={handleChange}
                    error={touched.fullnameBenefeciary && Boolean(errors.fullnameBenefeciary)}
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
                    }}
                  />
                </Box>

                <Box>
                  <h6 className="titulo-arriba-form" style={{ fontSize: 19, margin: 0 }}>Edad</h6>
                  <TextField
                    name="ageBeneficiary"
                    type="number"
                    fullWidth
                    size="medium"
                    value={values.ageBeneficiary}
                    onChange={(e) => {
                      const inputValue = parseInt(e.target.value, 10);

                      if (isNaN(inputValue)) {
                        values.ageBeneficiary = 0; // evita "NaN"
                      } else if (inputValue < 0) {
                        values.ageBeneficiary = 0; // trunca en 0
                      } else {
                        values.ageBeneficiary = inputValue;
                      }

                      handleChange(e);
                    }}
                    inputProps={{
                      min: 0,
                      onKeyDown: (e) => {
                        if (["-", "e", "E", "+", "."].includes(e.key)) {
                          e.preventDefault(); // bloquea caracteres no deseados
                        }
                      },
                      onWheel: (e) => e.currentTarget.blur(), // evita scroll con el mouse
                    }}
                    error={touched.ageBeneficiary && Boolean(errors.ageBeneficiary)}
                    helperText={touched.ageBeneficiary && errors.ageBeneficiary}
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
                  <h6 className="titulo-arriba-form" style={{ fontSize: 19, margin: 0 }}>DNI</h6>
                  <TextField
                    name="dniBenefeciary"
                    fullWidth
                    size="medium"
                    value={values.dniBenefeciary}
                    onChange={handleChange}
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
                  <h6 className="titulo-arriba-form" style={{ fontSize: 19, margin: 0 }}>Observaciones</h6>
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
                >
                  <CloseIcon sx={{ fontSize: 34 }} />
                </Button>
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "white",
                    minWidth: 60,
                    height: 60,
                    borderRadius: 2.5,
                    "&:hover": { backgroundColor: "#0d47a1" },
                  }}
                >
                  <CheckIcon sx={{ fontSize: 34 }} />
                </Button>
              </Stack>
            </DialogContent>
          </Form>
        )}
      </Formik>
    </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Beneficiario actualizado correctamente.
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditBeneficiariosDialog;
