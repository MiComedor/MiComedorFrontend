import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const user = localStorage.getItem("user");
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default RequireAuth;
