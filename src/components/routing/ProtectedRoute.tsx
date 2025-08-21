import type { ReactElement } from "react";

type ProtectedRouteProps = {
  children: ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  console.log("Protected route");

  return <>{children}</>;
}
