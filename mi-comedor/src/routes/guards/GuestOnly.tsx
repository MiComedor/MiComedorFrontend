import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const GuestOnly = ({ children }: { children: ReactNode }) => {
  const user = localStorage.getItem("user");
  return !user ? <>{children}</> : <Navigate to="/profile" replace />;
};

export default GuestOnly;
