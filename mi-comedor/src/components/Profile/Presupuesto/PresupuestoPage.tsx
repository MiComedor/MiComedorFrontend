import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  TablePagination,
  Button,
  Alert, //  AGREGADO: Importar Alert para mostrar mensajes
  Snackbar, //  AGREGADO: Importar Snackbar para mostrar notificaciones
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./PresupuestoPage.css";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import BugdeCategoty from "../../../types/budgetCategory";
import { BudgetDTO } from "../../../types/budget";
import budgetService from "../../../services/budget.service";
import dayjs from "dayjs";

const PresupuestoPage: React.FC = () => {
  const [categorias, setCategorias] = useState<BugdeCategoty[]>([]);
  const [presupuestos, setPresupuestos] = useState<BudgetDTO[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // 🔹 AGREGADO: Estados para controlar el mensaje de éxito
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const initialValues: BudgetDTO = {
    idBudget: 0,
    descriptionProduct: "",
    amountBudget: 0,
    dateBudget: "",
    users: undefined,
    budgetCategory: undefined,
  };

  const validationSchema = Yup.object({
    descriptionProduct: Yup.string().required("Campo obligatorio"),
    amountBudget: Yup.number().positive("Debe ser positivo").required("Campo obligatorio"),
    dateBudget: Yup.string().required("Campo obligatorio"),
    budgetCategory: Yup.object().shape({
      idBudgetCategory: Yup.number().required("Campo obligatorio"),
    }).required("Campo obligatorio"),
  });

  const getCategorias = async () => {
    const res = await budgetService.listarCategorias();
    if (Array.isArray(res)) {
      setCategorias(res);
    }
  };

  const getPresupuestos = async () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    const data = await budgetService.listarPorUsuario(user.idUser);
    setPresupuestos(data.reverse()); // si quieres los más recientes arriba
  };

  const calcularSaldo = () => {
    let saldo = 0;
    presupuestos.forEach((p) => {
      const categoria = p.budgetCategory?.name?.toLowerCase();

      if (categoria === "ingresos" || categoria === "ingreso") {
        saldo += p.amountBudget;
      } else if (categoria === "egresos" || categoria === "egreso") {
        saldo -= p.amountBudget;
      }
    });
    return saldo;
  };

  const saldoActual = calcularSaldo();

  useEffect(() => {
    getCategorias();
    getPresupuestos();
  }, []);

  const handleSubmit = async (values: BudgetDTO, { resetForm }: any) => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    const payload = {
      ...values,
      users: { idUser: user.idUser },
    };

    try {
      await budgetService.insertar(payload);
      
      //  AGREGADO: Determinar el tipo de categoría y mostrar mensaje apropiado
      const categoria = values.budgetCategory?.name?.toLowerCase();
      if (categoria === "ingreso" || categoria === "ingresos") {
        setSnackbarMessage("Ingreso guardado satisfactoriamente");
        setSnackbarSeverity("success");
      } else if (categoria === "egreso" || categoria === "egresos") {
        setSnackbarMessage("Egreso guardado satisfactoriamente");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Registro guardado satisfactoriamente");
        setSnackbarSeverity("success");
      }
      setOpenSnackbar(true);
      
      resetForm();
      getPresupuestos();
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
      // 🔹 AGREGADO: Mensaje de error si falla
      setSnackbarMessage("Error al guardar el registro");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  //  AGREGADO: Función para cerrar el Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <div className="formulario-raciones">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                flexWrap="wrap"
                justifyContent="center"
                alignItems={{ xs: "center", sm: "flex-end" }}
                sx={{ width: "100%" }}
              >
                {/* CATEGORÍA */}
                <Stack direction="column" sx={{ width: { xs: "100%", sm: 275 } }}>
                  <label className="titulo-arriba-form">Categoría</label>
                  <Field name="budgetCategory">
                    {({ field, form, meta }: FieldProps) => (
                      <TextField
                        select
                        className="form-input"
                        fullWidth
                        value={field.value?.idBudgetCategory || ""}
                        onChange={(e) => {
                          const selected = categorias.find(
                            (c) => c.idBudgetCategory === parseInt(e.target.value)
                          );
                          form.setFieldValue("budgetCategory", selected || null);
                        }}
                        error={meta.touched && Boolean(meta.error)}
                        helperText={
                          meta.touched &&
                          (typeof meta.error === "object" && meta.error !== null
                            ? (meta.error as any).idBudgetCategory
                            : meta.error)
                        }
                      >
                        {categorias.map((cat) => (
                          <MenuItem key={cat.idBudgetCategory} value={cat.idBudgetCategory}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Field>
                </Stack>

                {/* MONTO */}
                <Stack direction="column" sx={{ width: { xs: "100%", sm: 275 } }}>
                  <label className="titulo-arriba-form">Monto</label>
                  <Field name="amountBudget">
                    {({ field, form }: FieldProps) => (
                      <TextField
                        {...field}
                        type="number"
                        className="form-input"
                        fullWidth
                        error={touched.amountBudget && Boolean(errors.amountBudget)}
                        helperText={touched.amountBudget && errors.amountBudget}
                        inputProps={{ min: 0, max: 99999, maxLength: 5 }}
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.value.length > 4) {
                            e.target.value = e.target.value.slice(0, 5);
                          }
                        }}
                        onFocus={() => {
                          if (field.value === 0) {
                            form.setFieldValue("amountBudget", "");
                          }
                        }}
                      />
                    )}
                  </Field>
                </Stack>

                {/* DESCRIPCIÓN */}
                <Stack direction="column" sx={{ width: { xs: "100%", sm: 275 } }}>
                  <label className="titulo-arriba-form">Descripción</label>
                  <Field name="descriptionProduct">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        className="form-input"
                        fullWidth
                        error={touched.descriptionProduct && Boolean(errors.descriptionProduct)}
                        helperText={touched.descriptionProduct && errors.descriptionProduct}
                      />
                    )}
                  </Field>
                </Stack>

                {/* FECHA */}
                <Stack direction="column" sx={{ width: { xs: "100%", sm: 275 } }}>
                  <label className="titulo-arriba-form">Fecha</label>
                  <Field name="dateBudget">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        type="date"
                        className="form-input"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={touched.dateBudget && Boolean(errors.dateBudget)}
                        helperText={touched.dateBudget && errors.dateBudget}
                        inputProps={{
                          min: dayjs().format("YYYY-MM-DD"),
                        }}
                      />
                    )}
                  </Field>
                </Stack>

                {/* BOTÓN */}
                <IconButton
                  className="boton-verde"
                  type="submit"
                  sx={{
                    height: 70,
                    width: 75,
                    mt: { xs: 2, sm: "25px" },
                    alignSelf: { xs: "center", sm: "flex-end" },
                    boxShadow: 2,
                    borderRadius: 1,
                  }}
                >
                  <AddIcon sx={{ fontSize: 30 }} />
                </IconButton>
              </Stack>
            </Form>
          )}
        </Formik>
      </div>

      {/* 🔹 AGREGADO: Snackbar para mostrar mensajes de éxito o error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontSize: "1rem" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          backgroundColor: saldoActual < 0 ? "#d32f2f" : "#f57c00", // rojo si negativo, naranja si positivo
          color: "white",
          fontWeight: "bold",
          fontSize: "1.2rem",
          px: 2,
          py: 1,
          display: "inline-block",
          mt: 5,
          borderRadius: 1,
        }}
      >
        {saldoActual < 0 ? "Déficit actual :" : "Saldo actual :"} &nbsp; S/{Math.abs(saldoActual).toFixed(2)}
      </Box>

      {/* Tabla responsive debajo del formulario */}
      <Box className="table-container-raciones" sx={{ mt: 5, width: "100%", overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            minWidth: { xs: "100%", sm: 1200 },
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "1.2rem" }}><em>Fecha</em></TableCell>
                <TableCell sx={{ fontSize: "1.2rem" }}><em>Categoría</em></TableCell>
                <TableCell sx={{ fontSize: "1.2rem" }}><em>Descripción</em></TableCell>
                <TableCell sx={{ fontSize: "1.2rem" }}><em>Monto (S/)</em></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presupuestos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow
                    key={item.idBudget}
                    sx={{
                      height: 70,
                      backgroundColor:
                        item.budgetCategory?.name?.toLowerCase().includes("egreso") ||
                        item.budgetCategory?.name?.toLowerCase().includes("egresos")
                          ? "#f8d7da" // rojo suave
                          : "inherit", // color por defecto
                    }}
                  >
                    <TableCell sx={{ fontSize: "1.1rem" }}>
                      {dayjs(item.dateBudget).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell sx={{ fontSize: "1.1rem" }}>
                      {item.budgetCategory?.name || "Sin categoría"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{item.descriptionProduct}</TableCell>
                    <TableCell sx={{ fontSize: "1.1rem" }}>{item.amountBudget.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={presupuestos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) =>
              `Del ${from} al ${to} de ${count !== -1 ? count : `más de ${to}`} movimientos`
            }
            sx={{
              '& .MuiTablePagination-toolbar': {
                flexDirection: { xs: 'row', sm: 'row' },
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                justifyContent: { xs: 'space-between', sm: 'flex-end' },
                alignItems: 'center',
                gap: 1,
                px: 1,
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: '0.85rem',
                marginBottom: { xs: 0.5, sm: 0 },
              },
              '& .MuiTablePagination-actions': {
                marginLeft: { xs: 0, sm: 2 },
              },
            }}
          />
        </TableContainer>
      </Box>

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
    </Box>
  );
};

export default PresupuestoPage;