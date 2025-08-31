import type { ReactElement } from "react";
import { useAuth } from "../../providers/auth/useAuth";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
