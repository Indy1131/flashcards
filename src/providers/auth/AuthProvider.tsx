import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access")
  );

  async function fetchWithAuth(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    const attemptRequest = async (token?: string) => {
      return fetch(input, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: token ? `Bearer ${token}` : `Bearer ${access}`,
        },
      });
    };

    let response = await attemptRequest();

    if (response.status === 401 && refresh) {
      const refreshRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        }
      );

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newAccess = data.access;
        localStorage.setItem("access", newAccess);

        response = await attemptRequest(newAccess);
      } else {
        logout();
      }
    }

    return response;
  }

  function login(access: string, refresh: string) {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setToken(access);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
  }

  async function refreshUser() {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/me/`;
      const response = await fetchWithAuth(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();

      if (response.ok) setUser(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) refreshUser();
  }, [token]);

  useEffect(() => {
    async function refreshToken() {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return;

      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/refresh/`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });

        const json = await response.json();
        login(json.access, refresh);
      } catch (error) {
        console.error("Failed to refresh token: ", error);
      }
    }

    if (!token) refreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, refreshUser, fetchWithAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
