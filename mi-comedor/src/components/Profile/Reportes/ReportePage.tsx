import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./Reportes.css";
import RationService from "../../../services/ration.service";
import BudgetService from "../../../services/budget.service";
import { RationByDay } from "../../../types/RationByDay";
import BudgetByDay from "../../../types/BudgetByDay";
import ProductsByDay from "../../../types/ProductsByDay";
import ProductService from "../../../services/product.service";
import BeneficiaryByDay from "../../../types/BeneficiaryByDay";

const ReportePage: React.FC = () => {
  const [value, setValue] = useState("diarioReportes");
  const [racionPorDia, setRacionPorDia] = useState<RationByDay | null>(null);
  const [presupuestoPorDia, setPresupuestoPorDia] =
    useState<BudgetByDay | null>(null);
  const [productosPorDia, setProductosPorDia] = useState<ProductsByDay[]>([]);
  const [beneficiariosPorDia, setBeneficiariosPorDia] = useState<
    BeneficiaryByDay[]
  >([]);

  const today = new Date();
  const diaDeHoy = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(today);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getRacionesPorDia = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    RationService.racionesPorDia(user.idUser)
      .then((respuesta) => {
        if (respuesta && typeof respuesta.totalRacionPorDia === "number") {
          setRacionPorDia({ totalRacionPorDia: respuesta.totalRacionPorDia });
        } else {
          console.warn("Respuesta inesperada del backend:", respuesta);
          setRacionPorDia(null);
        }
      })
      .catch((error) => {
        console.error("Error al obtener raciones:", error);
        setRacionPorDia(null);
      });
  };

  const getPresupuestoPorDia = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    BudgetService.presupuestoPorDia(user.idUser)
      .then((response) => {
        if (Array.isArray(response) && response.length > 0) {
          setPresupuestoPorDia(response[0]);
        } else {
          console.warn("Respuesta vacía o no válida:", response);
          setPresupuestoPorDia(null);
        }
      })
      .catch((error) => {
        console.error("Error al obtener presupuesto:", error);
        setPresupuestoPorDia(null);
      });
  };

  const getProductosPorDia = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    ProductService.obtenerProductosAvencerDiario(user.idUser).then(
      (productsList) => {
        const listaProductos = productsList.map((r) => ({
          descripcionProducto: r.descripcionProducto,
          expirationDate: r.expirationDate,
        }));
        setProductosPorDia(listaProductos);
      }
    );
  };

  const getBeneficiariosPorDia = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    RationService.BeneficiariosPorDia(user.idUser).then(
      (beneficiariosPorDiaList) => {
        const listaBeneficiarios = beneficiariosPorDiaList.map((r) => ({
          beneficiariosPorDia: r.beneficiariosPorDia,
        }));
        setBeneficiariosPorDia(listaBeneficiarios);
      }
    );
  };

  useEffect(() => {
    getRacionesPorDia();
    getPresupuestoPorDia();
    getProductosPorDia();
    getBeneficiariosPorDia();
  }, []);

  return (
    <Stack
      spacing={{ xs: 1, sm: 2 }}
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap" }}
    >
      <Box sx={{ width: "100%" }}>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              value="diarioReportes"
              label="Diario"
              className="custom-tabs-reportes"
            />
            <Tab
              value="semanalReportes"
              label="Semanal"
              className="custom-tabs-reportes"
            />
          </TabList>

          <TabPanel value="diarioReportes">
            <Box sx={{ width: "100%" }}>
              <Stack
                spacing={2}
                direction="row"
                useFlexGap
                sx={{ flexWrap: "wrap" }}
              >
                {/* RACIONES */}
                <Card sx={{ minWidth: 200, flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" className="titulo-Reportes">
                      Raciones
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, fontWeight: "bold" }}
                    >
                      Día de hoy: {diaDeHoy}
                    </Typography>
                    <Typography variant="body2">
                      Total: {racionPorDia?.totalRacionPorDia ?? "Sin datos"}
                    </Typography>
                  </CardContent>
                </Card>

                {/* PRESUPUESTO */}
                <Card sx={{ minWidth: 200, flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" className="titulo-Reportes">
                      Ingresos y egresos
                    </Typography>
                    {presupuestoPorDia ? (
                      <>
                        <Typography variant="body2">
                          Ingresos: {presupuestoPorDia.ingresosHoy}
                        </Typography>
                        <Typography variant="body2">
                          Egresos: {presupuestoPorDia.egresosHoy}
                        </Typography>
                        <Typography variant="body2">
                          Saldo final: {presupuestoPorDia.saldoFinal}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2">
                        No hay datos disponibles.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* PRODUCTOS */}
                <Card sx={{ minWidth: 200, flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" className="titulo-Reportes">
                      Productos prontos a vencer
                    </Typography>
                    {productosPorDia.length > 0 ? (
                      productosPorDia.map((producto, index) => (
                        <Typography variant="body2" key={index}>
                          {producto.descripcionProducto} - vence el{" "}
                          {new Date(
                            producto.expirationDate
                          ).toLocaleDateString()}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2">
                        No hay productos por vencer.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* BENEFICIARIOS  */}
                <Card sx={{ minWidth: 200, flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" className="titulo-Reportes">
                      Beneficiarios atendidos
                    </Typography>
                    {beneficiariosPorDia.length > 0 ? (
                      beneficiariosPorDia.map((b, index) => (
                        <Typography variant="body2" key={index}>
                          Total atendidos: {b.beneficiariosPorDia}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2">
                        No hay beneficiarios registrados hoy.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value="semanalReportes">
            <Box sx={{ width: "100%" }}>
              <Stack
                spacing={2}
                direction="row"
                useFlexGap
                sx={{ flexWrap: "wrap" }}
              >
                {/* Tarjetas semanales */}
                <Card sx={{ minWidth: 200, flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" className="titulo-Reportes">
                      Raciones por días
                    </Typography>
                    <Typography variant="body2">
                      Descripción del contenido
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ minWidth: 200, flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" className="titulo-Reportes">
                      Ingresos y egresos de la semana
                    </Typography>
                    <Typography variant="body2">
                      Descripción del contenido
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ minWidth: 200, flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" className="titulo-Reportes">
                      Productos prontos a vencer
                    </Typography>
                    <Typography variant="body2">
                      Descripción del contenido
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ minWidth: 200, flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" className="titulo-Reportes">
                      Beneficiarios atendidos por días
                    </Typography>
                    <Typography variant="body2">
                      Descripción del contenido
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
};

export default ReportePage;
