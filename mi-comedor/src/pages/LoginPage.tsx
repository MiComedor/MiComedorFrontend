import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { login } from "../services/auth.service";
import LoginForm from "../components/Auth/LoginForm";
import EventBus from "../components/common/EventBus";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false); // ✅ NUEVO

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Por favor, escribe tu nombre de usuario."),
    password: Yup.string()
      .required("Por favor, escribe tu contraseña."),
  });


  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;
    setMessage("");
    setLoading(true);
    setSuccessful(false); // reset

    login(username, password).then(
      () => {
        setSuccessful(true); // ✅ login exitoso
        setMessage("Inicio exitoso"); // ✅ mensaje para el snackbar

        EventBus.dispatch("login");
        navigate("/profile");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setSuccessful(false); // ✅ login fallido
        setMessage(resMessage || "Usuario o contraseña incorrecta");
      }
    );
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <LoginForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
      loading={loading}
      message={message}
      successful={successful} // ✅ NUEVO
      onSignUpClick={goToRegister}
    />
  );
};

export default LoginPage;
