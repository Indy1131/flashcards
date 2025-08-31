import App from "./App";
import Login from "./components/pages/Login";
import Singup from "./components/pages/Signup";
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
    path: "/signup",
    element: (
      <UnprotectedRoute>
        <Singup />
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
  {
    path: "*",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
];
