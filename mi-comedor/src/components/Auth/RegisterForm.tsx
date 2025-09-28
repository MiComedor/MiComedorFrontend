import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import "./RegisterForm.css";
import { useNavigate } from "react-router-dom";

// ✅ NUEVO: helper para validar reglas de la contraseña
const passwordChecks = [
  { test: (pwd: string) => /.{8,}/.test(pwd), label: "Mínimo 8 caracteres" },
  { test: (pwd: string) => /[A-Z]/.test(pwd), label: "Al menos 1 mayúscula" },
  { test: (pwd: string) => /[a-z]/.test(pwd), label: "Al menos 1 minúscula" },
  { test: (pwd: string) => /\d/.test(pwd), label: "Al menos 1 número" },
  { test: (pwd: string) => /[@$!%*?&.#]/.test(pwd), label: "Al menos 1 caracter especial (@$!%*?&.#)" },
];

// ✅ NUEVO: componente visual
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  return (
    <ul className="password-checklist">
      {passwordChecks.map((rule, i) => {
        const valid = rule.test(password);
        return (
          <li key={i} className={valid ? "valid" : "invalid"}>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
};

type RegisterFormValues = {
  username: string;
  name: string;
  mail: string;
  password: string;
};

type RegisterFormProps = {
  initialValues: RegisterFormValues;
  validationSchema: Yup.ObjectSchema<RegisterFormValues>;
  onSubmit: (values: RegisterFormValues) => void;
  loading: boolean;
  successful: boolean;
  message: string;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  loading,
  successful,
  message,
}) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" className="register-stack">
      {/* Panel izquierdo */}
      <div className="register-left">
        <h2>BIENVENIDO</h2>
        <button
          className="register-left-button"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión
        </button>
      </div>

      {/* Panel derecho */}
      <div className="register-right">
        <div className="titulo-Pderecho">
          <h2>Crea tu Cuenta</h2>
        </div>
        <div className="formulario-grupo-completo">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values }) => ( // <-- ✅ para acceder a la contraseña
              <Form>
                <Stack spacing={1} className="register-form-stack">
                  <div className="form-group">
                    <label>Usuario</label>
                    <Field name="username" type="text" className="form-input-login" />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Nombre</label>
                    <Field name="name" type="text" className="form-input-login" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <Field name="mail" type="email" className="form-input-login" />
                    <ErrorMessage
                      name="mail"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contraseña</label>
                    <Field
                      name="password"
                      type="password"
                      className="form-input-login"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />

                    {/* ✅ NUEVO: reglas dinámicas */}
                    <PasswordStrength password={values.password} />
                  </div>
                </Stack>

                <button
                  type="submit"
                  className="register-submit-button"
                  disabled={loading}
                >
                  Registrarse
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
            )}
          </Formik>
        </div>
      </div>
    </Stack>
  );
};

export default RegisterForm;
