import type { ReactElement } from "react";
import { useAuth } from "../../providers/auth/useAuth";
import { Navigate } from "react-router-dom";

type UnprotectedRouteProps = {
  children: ReactElement;
};

export default function UnprotectedRoute({ children }: UnprotectedRouteProps) {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
