import type { ReactElement } from "react";

type UnprotectedRouteProps = {
  children: ReactElement;
};

export default function UnprotectedRoute({ children }: UnprotectedRouteProps) {
  console.log("Unprotected route");

  return <>{children}</>;
}
