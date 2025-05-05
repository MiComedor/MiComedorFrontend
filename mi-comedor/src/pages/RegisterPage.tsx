import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { register, login } from "../services/auth.service";  // ✅ importar login
import RegisterForm from "../components/Auth/RegisterForm";

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
      .min(3, "The username must be at least 3 characters.")
      .max(20, "The username must be at most 20 characters.")
      .required("This field is required!"),
    name: Yup.string().required("This field is required!"),
    mail: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .min(6, "The password must be at least 6 characters.")
      .max(40, "The password must be at most 40 characters.")
      .required("This field is required!"),
  });

  const handleRegister = (formValue: typeof initialValues) => {
    const { username, name, mail, password } = formValue;
    setMessage("");
    setLoading(true);

    register(username, name, mail, password, true).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        setLoading(false);

        // ✅ LOGIN AUTOMÁTICO después de registro
        login(username, password).then(
          () => {
            navigate("/profile");
            window.location.reload();
          },
          (error) => {
            const resMessage =
              (error.response?.data?.message) ||
              error.message ||
              error.toString();
            setMessage(resMessage);
            setLoading(false);
          }
        );
      },
      (error) => {
        const resMessage =
          error.response?.data?.message || error.message || error.toString();

        setMessage(resMessage);
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
