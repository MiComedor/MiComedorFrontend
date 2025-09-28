import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { register, login } from "../services/auth.service";
import RegisterForm from "../components/Auth/RegisterForm";
import EventBus from "../components/common/EventBus";

const RegisterPage: React.FC = () => {
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const initialValues = {
    username: "",
    name: "",
    mail: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "El nombre de usuario debe tener al menos 3 letras.")
      .max(20, "El nombre de usuario no puede tener más de 20 letras.")
      .required("Por favor, escribe un nombre de usuario."),
    name: Yup.string()
      .min(3, "El nombre  debe tener al menos 3 letras.")
      .required("Por favor, escribe tu nombre."),
    mail: Yup.string()
      .email("El correo no es válido. Revisa que esté bien escrito (ejemplo: nombre@gmail.com).")
      .required("Por favor, escribe tu correo electrónico."),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres.")
      .required("Por favor, escribe una contraseña."),
  });

  const handleRegister = (formValue: typeof initialValues) => {
    const { username, name, mail, password } = formValue;
    setMessage("");
    setLoading(true);

    register(username, name, mail, password, true).then(
      () => {
        setMessage("Tu cuenta fue creada con éxito ✅");
        setSuccessful(true);
        setLoading(false);

        login(username, password).then(
          () => {
            EventBus.dispatch("login");
            navigate("/profile");
            window.location.reload();
          },
          () => {
            setMessage("Tu cuenta se creó, pero no pudimos iniciar sesión automáticamente. Intenta iniciar sesión manualmente.");
            setLoading(false);
          }
        );
      },
      () => {
        setMessage("No pudimos crear tu cuenta. Verifica los datos e inténtalo otra vez.");
        setSuccessful(false);
        setLoading(false);
      }
    );
  };

  return (
    <RegisterForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleRegister}
      loading={loading}
      successful={successful}
      message={message}
    />
  );
};

export default RegisterPage;
