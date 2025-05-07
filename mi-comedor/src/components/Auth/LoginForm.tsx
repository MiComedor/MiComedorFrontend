import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import "./LoginFrom.css";
import { useNavigate } from "react-router-dom";


type LoginFormValues = {
  username: string;
  password: string;
};

type LoginFormProps = {
  initialValues: LoginFormValues;
  validationSchema: Yup.ObjectSchema<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => void;
  loading: boolean;
  successful: boolean;
  message: string;
};

const LoginForm: React.FC<LoginFormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  loading,
  successful,
  message,
}) => {
  const navigate = useNavigate();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }} // Adjust direction for smaller screens
      className="login-stack"
      spacing={2} // Add spacing between elements
    >
      {/* Panel izquierdo */}
      <div className="login-left">
        <div className="titulo-Pderecho">
          <h2>INICIAR SESIÓN</h2>
        </div>
        <div className="formulario-grupo-completo1">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <Stack spacing={1} className="login-form-stack">
                <div className="form-group">
                  <label>Usuario</label>
                  <Field name="username" type="text" className="form-input" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label>Contraseña</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>
              </Stack>

                <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                Iniciar sesión
                </button>

              {message && (
                <div className="form-group">
                  <div
                    className={successful ? "success-message" : "error-message"}
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="login-right">
        <h2>Crea tu cuenta</h2>
        <button
          className="login-right-button"
          onClick={() => navigate("/register")}
        >
          Registrar
        </button>
      </div>
    </Stack>
  );
};

export default LoginForm;



