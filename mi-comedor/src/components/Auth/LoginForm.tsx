import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Define el tipo de valores que espera el formulario
type LoginFormValues = {
  username: string;
  password: string;
};

type LoginFormProps = {
  initialValues: LoginFormValues;
  validationSchema: Yup.ObjectSchema<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => void;
  loading: boolean;
  message: string;
  onSignUpClick: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  loading,
  message,
  onSignUpClick,
}) => (
  <div className="col-md-12">
    <div className="card card-container">
      <img
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        alt="profile-img"
        className="profile-img-card"
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Field name="username" type="text" className="form-control" />
            <ErrorMessage
              name="username"
              component="div"
              className="alert alert-danger"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" className="form-control" />
            <ErrorMessage
              name="password"
              component="div"
              className="alert alert-danger"
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
        </Form>
      </Formik>

      <div className="form-group text-center">
        <button type="button" className="btn btn-link" onClick={onSignUpClick}>
          crear cuenta
        </button>
      </div>
    </div>
  </div>
);

export default LoginForm;
