import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps as MuiAlertProps } from "@mui/material/Alert";
import "./LoginForm.css"; // Corregido
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

const Alert = React.forwardRef<HTMLDivElement, MuiAlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginForm: React.FC<LoginFormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  loading,
  successful,
  message,
}) => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message, successful]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      className="login-stack"
      spacing={2}
    >
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={successful ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successful ? "Inicio exitoso" : "Usuario o contraseña incorrecta"}
        </Alert>
      </Snackbar>

      {/* Panel izquierdo */}
      <div className="login-left">
        <div className="login-left-title">
          <h2>INICIAR SESIÓN</h2>
        </div>
        <div className="login-form-wrapper">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <Stack spacing={1} className="login-form-stack">
                <div className="form-group">
                  <label htmlFor="username">Usuario</label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <Field
                    id="password"
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
                className={`login-submit-button ${loading ? "disabled" : ""}`}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar sesión"}
              </button>
            </Form>
          </Formik>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="login-right">
        <h2>CREA TU CUENTA</h2>
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
