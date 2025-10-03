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
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import BeneficiaryService from "../../../services/beneficiary.service";
import BeneficiaryByUserId from "../../../types/BeneficiaryByUserId";
import Beneficiary from "../../../types/beneficiaty";
import EditBeneficiariosDialog from "./EditBeneficariosDialog";
import DeleteBeneficiariosDialog from "./DeleteBeneficariosDialog";
import { Snackbar, Alert } from "@mui/material";

const validationSchema = Yup.object({
  fullnameBenefeciary: Yup.string().required("Campo obligatorio"),
  dniBenefeciary: Yup.string()
    .required("Campo obligatorio")
    .matches(/^\d{8}$/, "Debe tener exactamente 8 dígitos numéricos")
    .matches(/^[0-9]+$/, "Solo se permiten números"),
  ageBeneficiary: Yup.number()
    .typeError("Debe ser un número")
    .integer("Debe ser un número entero")
    .min(1, "La edad mínima es 1")
    .max(99, "La edad máxima es 99")
    .test("no-leading-zero", "La edad no puede empezar con 0", (val, ctx) => {
      if (val === undefined || val === null) return false;
      const raw = String(ctx.originalValue ?? "");
      return !/^0\d/.test(raw);
    })
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
  const [beneficiarioAEditar, setBeneficiarioAEditar] =
    useState<Beneficiary | null>(null);
  const [beneficiarioAEliminar, setBeneficiarioAEliminar] =
    useState<Beneficiary | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);  
  };

  const handleEditClick = (beneficiario: Beneficiary) => {
    setBeneficiarioAEditar(beneficiario);
  };

  const handleDeleteClick = (beneficiario: Beneficiary) => {
    setBeneficiarioAEliminar(beneficiario);
  };

  const loadBeneficiarios = async () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    try {
      const data = await BeneficiaryService.buscarBeneficiaryPorUserId(
        user.idUser
      );
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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <Box sx={{ p: { xs: 2, sm: 4, md: 8 }, pt: 1 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <label
            className="titulo-arriba-form"
            style={{ marginBottom: 4, marginLeft: 4 }}
          >
            Buscar
          </label>
          <TextField
            variant="outlined"
            placeholder="Buscar"
            value={search}
            onChange={(e) => {
              const soloLetras = e.target.value.replace(
                /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g,
                ""
              );
              setSearch(soloLetras);
            }}
            onKeyDown={(e) => {
              if (/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
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

      {/* MODAL AÑADIR */}
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
          Añadir beneficario
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

              const response =
                await BeneficiaryService.insertarBeneficiarySaveConfirm({
                  fullnameBenefeciary: values.fullnameBenefeciary,
                  dniBenefeciary: Number(values.dniBenefeciary),
                  ageBeneficiary: Number(values.ageBeneficiary),
                  observationsBeneficiary: values.observationsBeneficiary,
                  users: { idUser: user.idUser },
                });
              console.log("Response:", response);
              if (response.status === 400) {
                setSnackbarMessage(
                  "El beneficiario ya está registrado y activo."
                );
                setOpenSnackbar(true); // Mostrar el Snackbar
              } else {
                resetForm();
                handleClose();
                loadBeneficiarios(); // Recargar la lista de beneficiarios después de agregar uno
              }
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
                <Stack spacing={2.5}>
                  <Box>
                    <h6
                      className="titulo-arriba-form"
                      style={{ fontSize: 19, margin: 0 }}
                    >
                      Nombre completo
                    </h6>
                    <TextField
                      name="fullnameBenefeciary"
                      fullWidth
                      size="medium"
                      value={values.fullnameBenefeciary}
                      onChange={(e) => {
                        const soloLetras = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        handleChange({
                          ...e,
                          target: {
                            name: "fullnameBenefeciary",
                            value: soloLetras,
                          },
                        });
                      }}
                      error={
                        touched.fullnameBenefeciary &&
                        Boolean(errors.fullnameBenefeciary)
                      }
                      helperText={
                        touched.fullnameBenefeciary &&
                        errors.fullnameBenefeciary
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
                    <h6
                      className="titulo-arriba-form"
                      style={{ fontSize: 19, margin: 0 }}
                    >
                      Edad
                    </h6>
                    <TextField
                      name="ageBeneficiary"
                      type="number"
                      fullWidth
                      size="medium"
                      value={values.ageBeneficiary}
                      onChange={(e) => {
                        let inputValue = e.target.value;

                        if (inputValue.length > 2) {
                          inputValue = inputValue.slice(0, 2);
                        }

                        if (
                          inputValue.length > 1 &&
                          inputValue.startsWith("0")
                        ) {
                          inputValue = inputValue.replace(/^0+/, "");
                        }

                        if (inputValue === "") {
                          inputValue = "0";
                        }

                        values.ageBeneficiary = inputValue;

                        handleChange({
                          ...e,
                          target: { name: "ageBeneficiary", value: inputValue },
                        });
                      }}
                      inputProps={{
                        min: 0,
                        onKeyDown: (e) => {
                          if (["-", "e", "E", "+", "."].includes(e.key)) {
                            e.preventDefault();
                          }
                        },
                        onWheel: (e) => e.currentTarget.blur(),
                      }}
                      error={
                        touched.ageBeneficiary && Boolean(errors.ageBeneficiary)
                      }
                      helperText={
                        touched.ageBeneficiary && values.ageBeneficiary === "0"
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
                    <h6
                      className="titulo-arriba-form"
                      style={{ fontSize: 19, margin: 0 }}
                    >
                      DNI
                    </h6>
                    <TextField
                      name="dniBenefeciary"
                      fullWidth
                      size="medium"
                      value={values.dniBenefeciary}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 8);
                        handleChange({
                          target: {
                            name: "dniBenefeciary",
                            value,
                          },
                        });
                      }}
                      inputProps={{
                        maxLength: 8,
                        inputMode: "numeric",
                        pattern: "[0-9]{8}",
                      }}
                      error={
                        touched.dniBenefeciary && Boolean(errors.dniBenefeciary)
                      }
                      helperText={
                        touched.dniBenefeciary && errors.dniBenefeciary
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
                    <h6
                      className="titulo-arriba-form"
                      style={{ fontSize: 19, margin: 0 }}
                    >
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

      {/* LISTADO DE BENEFICIARIOS */}
      <Stack spacing={2} mt={4}>
        {currentItems.map((beneficiario) => (
          <Box
            key={beneficiario.idBeneficiary}
            sx={{
              border: "1px solid black",
              borderRadius: "4px",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Box sx={{ fontWeight: "bold", fontSize: 18 }}>
                {beneficiario.fullnameBenefeciary}
              </Box>
              <Box>Edad: {beneficiario.ageBeneficiary}</Box>
              <Box>DNI: {beneficiario.dniBenefeciary}</Box>
              <Box>
                Observación:{" "}
                {beneficiario.observationsBeneficiary || "Sin observaciones"}
              </Box>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#1976D2", minWidth: 0, p: 1 }}
                onClick={() =>
                  handleEditClick({
                    ...beneficiario,
                    isActive: beneficiario.active ?? true,
                  })
                }
              >
                <EditIcon />
              </Button>
              {
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#D32F2F", minWidth: 0, p: 1 }}
                  onClick={() =>
                    handleDeleteClick({
                      ...beneficiario,
                      isActive: beneficiario.active ?? true,
                    })
                  }
                >
                  <DeleteIcon />
                </Button>
              }
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* PAGINACIÓN */}
      {filtered.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            mb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPagination-ul": {
                flexWrap: "wrap",
                justifyContent: "center",
              },
              "& .MuiPaginationItem-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
                minWidth: { xs: "32px", sm: "40px" },
                height: { xs: "32px", sm: "40px" },
              },
            }}
          />
        </Box>
      )}

      {/* Mostrar mensaje si no hay resultados */}
      {filtered.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "text.secondary",
          }}
        >
          No se encontraron beneficiarios
        </Box>
      )}

      {/* Botón de regresar */}
      <Box sx={{ pt: 4 }}>
        <Button
          variant="contained"
          color="warning"
          startIcon={<ArrowBackIcon />}
          sx={{ fontWeight: "bold" }}
          href="/profile"
        >
          REGRESAR AL MENÚ
        </Button>
      </Box>

      {/* DIÁLOGOS DE EDITAR / ELIMINAR */}
      {beneficiarioAEditar && (
        <EditBeneficiariosDialog
          open={Boolean(beneficiarioAEditar)}
          onClose={() => setBeneficiarioAEditar(null)}
          initialData={beneficiarioAEditar}
          onSubmit={async (dataActualizada) => {
            await BeneficiaryService.actualizarBeneficiary(dataActualizada);
            loadBeneficiarios();
            setBeneficiarioAEditar(null);
          }}
        />
      )}

      {beneficiarioAEliminar && (
        <DeleteBeneficiariosDialog
          open={Boolean(beneficiarioAEliminar)}
          onClose={() => setBeneficiarioAEliminar(null)}
          nombre={beneficiarioAEliminar.fullnameBenefeciary}
          onConfirm={async () => {
            await BeneficiaryService.eliminarBeneficiaryActive(
              beneficiarioAEliminar.idBeneficiary
            );
            loadBeneficiarios();
            setBeneficiarioAEliminar(null);
          }}
        />
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top", 
          horizontal: "center", 
        }}
      >
        <Alert
          severity="error"
          onClose={handleCloseSnackbar}
          sx={{
            backgroundColor: "#F57C00", 
            color: "white", 
            borderRadius: "8px", 
            fontWeight: "bold",
            fontSize: "1.08rem", 
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", 
            padding: "10px 20px ",
            textAlign: "center", 
          }}
        >
          {snackbarMessage} 
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BeneficiariosPage;
