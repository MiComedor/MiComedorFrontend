import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import BeneficiaryService from "../../../services/beneficiary.service";
import BeneficiaryByUserId from "../../../types/BeneficiaryByUserId";

const validationSchema = Yup.object({
  fullnameBenefeciary: Yup.string().required("Campo obligatorio"),
  dniBenefeciary: Yup.string().required("Campo obligatorio"),
  ageBeneficiary: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser positivo")
    .required("Campo obligatorio"),
  observationsBeneficiary: Yup.string(),
});

type FormValues = {
  fullnameBenefeciary: string;
  dniBenefeciary: string;
  ageBeneficiary: string;
  observationsBeneficiary: string;
};

const BeneficiariosPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [beneficiarios, setBeneficiarios] = useState<BeneficiaryByUserId[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);

  const loadBeneficiarios = async () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    try {
      const data = await BeneficiaryService.buscarBeneficiaryPorUserId(user.idUser);
      setBeneficiarios(data);
    } catch (err) {
      console.error("Error al cargar beneficiarios", err);
    }
  };

  useEffect(() => {
    loadBeneficiarios();
  }, []);

  const filtered = beneficiarios.filter((b) =>
    b.fullnameBenefeciary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Box sx={{ flex: 1 }}>
          <label className="titulo-arriba-form">Buscar</label>
          <TextField
            variant="outlined"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "black" }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#AEE0FF",
                borderRadius: "20px",
                border: "2px solid black",
                height: "45px",
                paddingX: 2,
              },
            }}
            sx={{
              width: "80%",
              maxWidth: 600,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: "#00C300",
            color: "#000",
            fontWeight: "bold",
            px: 3,
            border: "3px solid black",
            "&:hover": { backgroundColor: "#00a700" },
          }}
          startIcon={<AddIcon />}
        >
          Añadir beneficiario
        </Button>
      </Stack>

      {/* Modal con mismo estilo */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        scroll="body"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 400,
            mx: "auto",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "#E4FAA4",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#E4FAA4",
            fontWeight: "bold",
            fontSize: 24,
            pb: 0,
          }}
        >
          Añadir pensionista
        </DialogTitle>

        <Formik<FormValues>
          initialValues={{
            fullnameBenefeciary: "",
            dniBenefeciary: "",
            ageBeneficiary: "",
            observationsBeneficiary: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              const userStr = localStorage.getItem("user");
              const user = userStr ? JSON.parse(userStr) : null;
              if (!user) {
                alert("Usuario no autenticado");
                return;
              }

              await BeneficiaryService.insertarBeneficiary({
                fullnameBenefeciary: values.fullnameBenefeciary,
                dniBenefeciary: Number(values.dniBenefeciary),
                ageBeneficiary: Number(values.ageBeneficiary),
                observationsBeneficiary: values.observationsBeneficiary,
                users: {
                    idUser: user.idUser,
                  }, // Use 'idUser' as expected by the Beneficiary type
              });

              resetForm();
              handleClose();
              loadBeneficiarios();
            } catch (error) {
              console.error("Error al guardar beneficiario:", error);
            }
          }}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form>
              <DialogContent
                sx={{
                  backgroundColor: "#E4FAA4",
                  overflow: "visible",
                  px: 3,
                  pb: 3,
                }}
              >
                <Stack spacing={3} mt={1}>
                  <Box>
                    <label className="titulo-arriba-form">Nombre completo</label>
                    <TextField
                      name="fullnameBenefeciary"
                      variant="outlined"
                      fullWidth
                      required
                      value={values.fullnameBenefeciary}
                      onChange={handleChange}
                      error={touched.fullnameBenefeciary && Boolean(errors.fullnameBenefeciary)}
                      helperText={touched.fullnameBenefeciary && errors.fullnameBenefeciary}
                      InputProps={{
                        sx: {
                          backgroundColor: "#fff",
                          borderRadius: "15px",
                          boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                          border: "none",
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <label className="titulo-arriba-form">Edad</label>
                    <TextField
                      name="ageBeneficiary"
                      type="number"
                      variant="outlined"
                      fullWidth
                      required
                      value={values.ageBeneficiary}
                      onChange={handleChange}
                      error={touched.ageBeneficiary && Boolean(errors.ageBeneficiary)}
                      helperText={touched.ageBeneficiary && errors.ageBeneficiary}
                      InputProps={{
                        sx: {
                          backgroundColor: "#fff",
                          borderRadius: "15px",
                          boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                          border: "none",
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <label className="titulo-arriba-form">DNI</label>
                    <TextField
                      name="dniBenefeciary"
                      variant="outlined"
                      fullWidth
                      required
                      value={values.dniBenefeciary}
                      onChange={handleChange}
                      error={touched.dniBenefeciary && Boolean(errors.dniBenefeciary)}
                      helperText={touched.dniBenefeciary && errors.dniBenefeciary}
                      InputProps={{
                        sx: {
                          backgroundColor: "#fff",
                          borderRadius: "15px",
                          boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                          border: "none",
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <label className="titulo-arriba-form">Observaciones</label>
                    <TextField
                      name="observationsBeneficiary"
                      multiline
                      rows={2}
                      variant="outlined"
                      fullWidth
                      value={values.observationsBeneficiary}
                      onChange={handleChange}
                      InputProps={{
                        sx: {
                          backgroundColor: "#fff",
                          borderRadius: "15px",
                          boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                          border: "none",
                        },
                      }}
                    />
                  </Box>

                  <Stack direction="row" justifyContent="space-around" mt={2}>
                    <Button
                      type="button"
                      onClick={handleClose}
                      sx={{
                        backgroundColor: "red",
                        color: "white",
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        "&:hover": { backgroundColor: "#b71c1c" },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 36 }} />
                    </Button>

                    <Button
                      type="submit"
                      sx={{
                        backgroundColor: "#1976D2",
                        color: "white",
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        "&:hover": { backgroundColor: "#0d47a1" },
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 36 }} />
                    </Button>
                  </Stack>
                </Stack>
              </DialogContent>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default BeneficiariosPage;
