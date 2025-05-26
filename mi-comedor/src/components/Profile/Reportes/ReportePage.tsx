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
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PieChart } from "@mui/x-charts/PieChart";
import { RationByWeek } from "../../../types/RationByWeek";
import { BugdetByWeek } from "../../../types/BudgetByWeek";
import { ProductsByWeek } from "../../../types/ProductsByWeek";
import { BarChart } from "@mui/x-charts/BarChart";
import FoodBankOutlinedIcon from "@mui/icons-material/FoodBankOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupsIcon from "@mui/icons-material/Groups";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { pieArcLabelClasses } from "@mui/x-charts/PieChart";

const ReportePage: React.FC = () => {
  const [value, setValue] = useState("diarioReportes");
  const [racionPorDia, setRacionPorDia] = useState<RationByDay | null>(null);
  const [presupuestoPorDia, setPresupuestoPorDia] =
    useState<BudgetByDay | null>(null);
  const [productosPorDia, setProductosPorDia] = useState<ProductsByDay[]>([]);
  const [productosPorSemana, setProductosPorSemana] = useState<
    ProductsByWeek[]
  >([]);
  const [beneficiariosPorDia, setBeneficiariosPorDia] = useState<
    BeneficiaryByDay[]
  >([]);

  const [beneficiariosChartData, setBeneficiariosChartData] = useState<
    { label: string; value: number }[]
  >([]);

  const [presupuestoPorSemana, setPresupuestoPorSemana] = useState<
    BugdetByWeek[]
  >([]);

  const navigate = useNavigate();

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
  interface PieData extends RationByWeek {
    id: number;
    value: number;
    label: string;
  }
  const [chartData, setChartData] = useState<PieData[]>([]);

  /*------------------DIARIO-------------------------*/
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

  /*------------------SEMANAL-------------------------*/

  const getRacionesPorSemana = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    RationService.racionesPorSemana(user.idUser)
      .then((response: RationByWeek[]) => {
        const pieData: PieData[] = response
          .filter((item) => item.totalRaciones > 0)
          .map((item, index) => ({
            ...item,
            id: index,
            value: item.totalRaciones,
            label: `${item.dia} ${item.fecha}`,
          }));

        setChartData(pieData);
        console.log("✅ Datos listos para el gráfico:", pieData);
      })
      .catch((err) => {
        console.error("Error al obtener raciones:", err);
      });
  };

  const getPresupuestoPorSemana = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    BudgetService.presupuestoPorSemana(user.idUser).then((budgetList) => {
      const listaPresupuesto = budgetList.map((r) => ({
        fecha: r.fecha,
        dia: r.dia,
        fechasDiaMes: r.fechasDiaMes,
        ingresosPorDia: r.ingresosPorDia,
        egresosPorDia: r.egresosPorDia,
        saldoPorDia: r.saldoPorDia,
      }));
      setPresupuestoPorSemana(listaPresupuesto);
    });
  };

  const getProductosPorSemana = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    ProductService.obtenerProductosAvencerSemanal(user.idUser).then(
      (productsList) => {
        const listaProductos = productsList.map((r) => ({
          descripcionProducto: r.descripcionProducto,
          diaVencimientos: r.diaVencimientos,
          fechaVencimiento: r.fechaVencimiento,
        }));
        setProductosPorSemana(listaProductos);
      }
    );
  };

  const getBeneficiariosPorSemana = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    RationService.BeneficiariosPorSemana(user.idUser).then(
      (beneficiariosPorDiaList) => {
        const chartData = beneficiariosPorDiaList
          .filter((r) => r.totalBeneficiarios > 0)
          .map((r) => ({
            label: `${r.dia} ${r.fecha}`,
            value: r.totalBeneficiarios,
          }));

        setBeneficiariosChartData(chartData);
      }
    );
  };

  /*-----------------------------------------------------*/

  useEffect(() => {
    getRacionesPorDia();
    getPresupuestoPorDia();
    getProductosPorDia();
    getBeneficiariosPorDia();
    getRacionesPorSemana();
    getPresupuestoPorSemana();
    getProductosPorSemana();
    getBeneficiariosPorSemana();
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
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{ justifyContent: "center", display: "flex" }}
          >
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
                <Card
                  sx={{
                    minWidth: 250,
                    flexGrow: 1,
                    backgroundColor: "#f9f9f9",
                    boxShadow: 3,
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    {/* Encabezado */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography
                        variant="h6"
                        className="titulo-Reportes"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <FoodBankOutlinedIcon
                          sx={{ color: "#F57C00", fontSize: 28 }}
                        />
                        Raciones
                      </Typography>
                    </Box>

                    {/* Fecha */}
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: 15,
                        textAlign: "center",
                      }}
                    >
                      Día de hoy: {diaDeHoy}
                    </Typography>

                    {/* Resultado */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        mt: 2,
                      }}
                    >
                      <FoodBankOutlinedIcon
                        sx={{ color: "#F57C00", fontSize: 60, mb: 1 }}
                      />
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          color: "#333",
                          textAlign: "center",
                        }}
                      >
                        {racionPorDia?.totalRacionPorDia ?? "Sin datos"}{" "}
                        raciones
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* PRESUPUESTO */}
                <Card
                  sx={{
                    minWidth: 250,
                    flexGrow: 1,
                    backgroundColor: "#f9f9f9",
                    boxShadow: 3,
                    borderRadius: 3,
                    p: 1,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="titulo-Reportes"
                      align="center"
                      sx={{ mb: 2 }}
                    >
                      Ingresos y egresos
                    </Typography>

                    {presupuestoPorDia ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AttachMoneyIcon
                            sx={{ color: "green", fontSize: 30, mr: 1 }}
                          />
                          <Typography fontSize={18} fontWeight="bold">
                            Ingresos: S/ {presupuestoPorDia.ingresosHoy}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <MoneyOffIcon
                            sx={{ color: "red", fontSize: 30, mr: 1 }}
                          />
                          <Typography fontSize={18} fontWeight="bold">
                            Egresos: S/ {presupuestoPorDia.egresosHoy}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccountBalanceIcon
                            sx={{ color: "#F57C00", fontSize: 30, mr: 1 }}
                          />
                          <Typography fontSize={18} fontWeight="bold">
                            Saldo final: S/ {presupuestoPorDia.saldoFinal}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" align="center">
                        No hay datos disponibles.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* PRODUCTOS */}
                <Card
                  sx={{
                    minWidth: 250,
                    flexGrow: 1,
                    backgroundColor: "#f5f5f5",
                    boxShadow: 3,
                    borderRadius: 3,
                    p: 1,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      <WarningAmberOutlinedIcon
                        sx={{ color: "#F57C00", fontSize: 28 }}
                      />
                      <Typography variant="h6" className="titulo-Reportes">
                        Productos prontos a vencer
                      </Typography>
                    </Box>

                    {productosPorDia.length > 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        {productosPorDia.map((producto, index) => (
                          <Box
                            key={index}
                            sx={{
                              backgroundColor: "#fff",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              boxShadow: 1,
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold">
                              {producto.descripcionProducto}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Vence:{" "}
                              {new Date(
                                producto.expirationDate
                              ).toLocaleDateString("es-PE")}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ mt: 2, fontStyle: "italic", color: "gray" }}
                      >
                        No hay productos por vencer.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* BENEFICIARIOS  */}
                <Card
                  sx={{
                    minWidth: 250,
                    flexGrow: 1,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 3,
                    boxShadow: 3,
                    p: 1,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      <Typography variant="h6" className="titulo-Reportes">
                        Beneficiarios atendidos
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                        padding: 3,
                      }}
                    >
                      <GroupsIcon sx={{ color: "#F57C00", fontSize: 70 }} />
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#333", fontSize: 26 }}
                      >
                        {beneficiariosPorDia.length > 0
                          ? `${beneficiariosPorDia[0].beneficiariosPorDia} beneficiarios`
                          : "Sin datos"}
                      </Typography>
                    </Box>
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
                {/********************************* Tarjetas semanales **************************/}
                <Card
                  sx={{
                    minWidth: 250,
                    flexGrow: 1,
                    bgcolor: "#f5f5f5",
                    borderRadius: 3,
                    boxShadow: 2,
                    p: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="titulo-Reportes"
                      sx={{ mb: 1 }}
                    >
                      Raciones por días
                    </Typography>

                    {chartData.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No hay datos disponibles para esta semana.
                      </Typography>
                    ) : (
                      <PieChart
                        series={[
                          {
                            data: chartData,
                            highlightScope: { highlight: "item" },
                            faded: { additionalRadius: -5, color: "gray" },
                            arcLabel: (item) => `${item.value}`,
                          },
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fill: "white", 
                            fontSize: 25,
                            fontWeight: "bold",
                          },
                        }}
                        height={300}
                        width={300}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    minWidth: 250,
                    flexGrow: 1,
                    bgcolor: "#f9f9f9",
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="titulo-Reportes"
                      sx={{ mb: 2 }}
                    >
                      Ingresos y egresos de la semana
                    </Typography>

                    {presupuestoPorSemana.filter(
                      (p) =>
                        p.ingresosPorDia !== 0 ||
                        p.egresosPorDia !== 0 ||
                        p.saldoPorDia !== 0
                    ).length > 0 ? (
                      presupuestoPorSemana
                        .filter(
                          (p) =>
                            p.ingresosPorDia !== 0 ||
                            p.egresosPorDia !== 0 ||
                            p.saldoPorDia !== 0
                        )
                        .map((p, index) => (
                          <Box
                            key={index}
                            sx={{
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              p: 2,
                              mb: 1,
                              boxShadow: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "#555", mb: 1 }}
                            >
                              {p.dia} ({p.fecha})
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{ color: "green", fontWeight: 500 }}
                            >
                              Ingresos: S/ {p.ingresosPorDia}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "red", fontWeight: 500 }}
                            >
                              Egresos: S/ {p.egresosPorDia}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#F57C00", fontWeight: "bold" }}
                            >
                              Saldo: S/ {p.saldoPorDia}
                            </Typography>
                          </Box>
                        ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No hay datos disponibles para esta semana.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    minWidth: 250,
                    flexGrow: 1,
                    bgcolor: "#f9f9f9",
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="titulo-Reportes"
                      sx={{ mb: 2 }}
                    >
                      Productos prontos a vencer
                    </Typography>

                    {productosPorSemana.length > 0 ? (
                      productosPorSemana.map((producto, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            backgroundColor: "#fff",
                            borderRadius: 2,
                            p: 2,
                            mb: 1,
                            boxShadow: 1,
                          }}
                        >
                          <WarningAmberOutlinedIcon sx={{ color: "#f57c00" }} />
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {producto.descripcionProducto}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#f57c00", fontStyle: "italic" }}
                            >
                              Vence: {producto.diaVencimientos},{" "}
                              {producto.fechaVencimiento}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No hay productos por vencer esta semana.
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    minWidth: 250,
                    flexGrow: 1,
                    bgcolor: "#f5f5f5", // Fondo gris claro
                    borderRadius: 3,
                    boxShadow: 2,
                    p: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="titulo-Reportes"
                      sx={{ mb: 1 }}
                    >
                      Beneficiarios atendidos por días
                    </Typography>

                    {beneficiariosChartData.length > 0 ? (
                      <BarChart
                        height={300}
                        xAxis={[
                          {
                            data: beneficiariosChartData.map((d) => d.label),
                            scaleType: "band",
                          },
                        ]}
                        series={[
                          {
                            data: beneficiariosChartData.map((d) => d.value),
                            label: "Beneficiarios",
                            color: "#F57C00",
                          },
                        ]}
                        barLabel="value"
                        sx={{
                          "& .MuiChartsLegend-root": {
                            fontSize: 16,
                          },
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No hay datos registrados esta semana.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </TabPanel>
        </TabContext>
        <Box sx={{ display: "flex", justifyContent: "flex-start", pl: 4 }}>
          <Button
            variant="contained"
            color="warning"
            startIcon={<ArrowBackIcon />}
            sx={{ fontWeight: "bold" }}
            onClick={() => navigate("/profile")}
          >
            REGRESAR AL MENÚ
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default ReportePage;
