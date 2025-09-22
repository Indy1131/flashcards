import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { AuthProvider } from "./providers/auth/AuthProvider.tsx";
import { PopupProvider } from "./providers/popup/PopupProvider.tsx";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <PopupProvider>
        <RouterProvider router={router} />
      </PopupProvider>
    </AuthProvider>
  </StrictMode>
);
