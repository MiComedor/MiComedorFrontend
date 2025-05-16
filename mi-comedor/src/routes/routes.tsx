import React from "react";
import {Routes, Route} from "react-router-dom";

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/mis-productos" element={<MisProductosPage />} />
      <Route path="/raciones" element={<RacionesPage />} />
      <Route path="/beneficiarios" element={<BeneficiariosPage />} />
      <Route path="/reporte" element={<ReportePage />} />
      <Route path="/presupuesto" element={<PresupuestoPage />} />
      <Route path="/tareas" element={<TareasPage />} />
    </Routes>
  );
};

export default AppRoutes;
