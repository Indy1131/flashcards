import App from "./App";
import Login from "./components/pages/Login";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import UnprotectedRoute from "./components/routing/UnprotectedRoute";

export default [
  {
    path: "/",
    element: (
      <UnprotectedRoute>
        <Login />
      </UnprotectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
];
