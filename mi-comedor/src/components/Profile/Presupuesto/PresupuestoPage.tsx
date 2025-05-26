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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
    const data = await budgetService.listar();
    setPresupuestos(data.reverse());
  };

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
      resetForm();
      getPresupuestos();
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
    }
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
                inputProps={{ min: 0 }}
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
              />
            )}
          </Field>
        </Stack>

        {/* BOTÓN */}
        <IconButton
          type="submit"
          sx={{
            backgroundColor: "#00e676",
            height: 50,
            width: 50,
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
                  <TableRow key={item.idBudget} sx={{ height: 70 }}>
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
          />
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PresupuestoPage;
