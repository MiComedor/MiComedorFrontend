import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

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
          {!successful && (
            <div>
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
                <label htmlFor="name">Name</label>
                <Field name="name" type="text" className="form-control" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mail">Email</label>
                <Field name="mail" type="email" className="form-control" />
                <ErrorMessage
                  name="mail"
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
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  Crear Cuenta
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={successful ? "alert alert-success" : "alert alert-danger"}
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
);

export default RegisterForm;
