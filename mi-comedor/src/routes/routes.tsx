import React from "react";
import {Routes, Route} from "react-router-dom";

//import WelcomePage from "../pages/WelcomePage";
import Profile from "../components/Profile/Profile";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {/* <Route path="/welcome" element={<WelcomePage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
