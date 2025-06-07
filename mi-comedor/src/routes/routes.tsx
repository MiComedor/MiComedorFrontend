import React from "react";
import { Routes, Route } from "react-router-dom";
import GuestOnly from "../routes/guards/GuestOnly";
import RequireAuth from "../routes/guards/RequireAuth";

import WelcomePage from "../pages/WelcomePage";
import Profile from "../components/Profile/Profile";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MisProductosPage from "../components/Profile/MisProductos/MisProductosPage";
import RacionesPage from "../components/Profile/Raciones/Raciones";
import BeneficiariosPage from "../components/Profile/Beneficiarios/BeneficiariosPage";
import ReportePage from "../components/Profile/Reportes/ReportePage";
import PresupuestoPage from "../components/Profile/Presupuesto/PresupuestoPage";
import TareasPage from "../components/Profile/Tareas/TareasPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/welcome" element={<WelcomePage />} />

      <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/mis-productos" element={<RequireAuth><MisProductosPage /></RequireAuth>} />
      <Route path="/raciones" element={<RequireAuth><RacionesPage /></RequireAuth>} />
      <Route path="/beneficiarios" element={<RequireAuth><BeneficiariosPage /></RequireAuth>} />
      <Route path="/reporte" element={<RequireAuth><ReportePage /></RequireAuth>} />
      <Route path="/presupuesto" element={<RequireAuth><PresupuestoPage /></RequireAuth>} />
      <Route path="/tareas" element={<RequireAuth><TareasPage /></RequireAuth>} />
    </Routes>
  );
};

export default AppRoutes;
