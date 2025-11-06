import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useIdleLogout } from "../guards/useIdleLogout";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const user = localStorage.getItem("user");
 useIdleLogout({ idleLimitMs: 60000 });
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default RequireAuth;
