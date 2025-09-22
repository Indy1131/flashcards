import { Link } from "react-router-dom";
import Flashlight from "../atoms/Flashlight";
import { useState } from "react";
import { useAuth } from "../../providers/auth/useAuth";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const url = `${import.meta.env.VITE_API_BASE_URL}/login/`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });
    const json = await response.json();

    setFormData({ username: "", password: "" });

    if (response.status != 200) {
      setError(json.detail);
      return;
    }

    login(json.access, json.refresh);
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-t from-blue-500 to-white overflow-hidden">
      <Flashlight
        className="card w-[700px] border-1 bg-blue-100 border-blue-400 rounded-xl z-1"
        lightClassName="rounded-xl"
        style={{
          boxShadow: "0px 10px 10px 1px #3B82F6",
        }}
      >
        <div className="flex flex-col gap-5 p-5 h-full">
          <form
            className="flex flex-col gap-3 z-4 flex-1 justify-center"
            onSubmit={handleSubmit}
          >
            <h1 className="text-blue-500 text-4xl z-4">Login</h1>
            <input
              className="w-full rounded-md p-3 border-1 border-blue-400"
              placeholder="Username"
              autoComplete="off"
              value={formData.username}
              name="username"
              onChange={handleOnChange}
            />
            <input
              className="w-full rounded-md p-3 border-1 border-blue-400"
              placeholder="Password"
              autoComplete="off"
              type="password"
              value={formData.password}
              name="password"
              onChange={handleOnChange}
            />
            <p className="h-[1em] flex items-center text-red-500">
              {error ? error : ""}
            </p>
            <button
              className="bg-gradient-to-l from-blue-500 to-blue-400 text-white py-2 rounded-md cursor-pointer"
              type="submit"
            >
              Login
            </button>
            <Link
              to="/signup"
              className="text-blue-500 py-2 rounded-md cursor-pointer flex justify-center hover:underline"
              type="button"
            >
              Don't have an account? Sign Up
            </Link>
          </form>
        </div>
      </Flashlight>
    </div>
  );
}
