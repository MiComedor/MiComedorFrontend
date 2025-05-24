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
      onClose(); // Cerramos después del feedback
      setShowSuccess(false);
    }, 1500);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", fontSize: 24 }}>
          Editar Beneficiario
        </DialogTitle>

        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form>
              <DialogContent sx={{ px: 3, pb: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <label className="titulo-arriba-form">Nombre completo</label>
                    <TextField
                      name="fullnameBenefeciary"
                      fullWidth
                      value={values.fullnameBenefeciary}
                      onChange={handleChange}
                      error={touched.fullnameBenefeciary && Boolean(errors.fullnameBenefeciary)}
                      helperText={touched.fullnameBenefeciary && errors.fullnameBenefeciary}
                    />
                  </Box>

                  <Box>
                    <label className="titulo-arriba-form">Edad</label>
                    <TextField
                      name="ageBeneficiary"
                      type="number"
                      fullWidth
                      value={values.ageBeneficiary}
                      onChange={handleChange}
                      error={touched.ageBeneficiary && Boolean(errors.ageBeneficiary)}
                      helperText={touched.ageBeneficiary && errors.ageBeneficiary}
                    />
                  </Box>

                  <Box>
                    <label className="titulo-arriba-form">DNI</label>
                    <TextField
                      name="dniBenefeciary"
                      fullWidth
                      value={values.dniBenefeciary}
                      onChange={handleChange}
                      error={touched.dniBenefeciary && Boolean(errors.dniBenefeciary)}
                      helperText={touched.dniBenefeciary && errors.dniBenefeciary}
                    />
                  </Box>

                  <Box>
                    <label className="titulo-arriba-form">Observaciones</label>
                    <TextField
                      name="observationsBeneficiary"
                      fullWidth
                      multiline
                      rows={2}
                      value={values.observationsBeneficiary}
                      onChange={handleChange}
                    />
                  </Box>
                </Stack>
              </DialogContent>

              <Stack direction="row" justifyContent="space-around" sx={{ mb: 3 }}>
                <Button
                  type="button"
                  onClick={onClose}
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                  }}
                >
                  <CloseIcon />
                </Button>
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "white",
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                  }}
                >
                  <CheckIcon />
                </Button>
              </Stack>
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
