import { Link, useNavigate } from "react-router-dom";
import Flashlight from "../atoms/Flashlight";
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let emptyField = false;
    Object.keys(formData).forEach((key) => {
      if (formData[key] === "") {
        emptyField = true;
        return;
      }
    });

    if (emptyField) {
      setFormData({ ...formData, password: "", confirmPassword: "" });
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormData({ ...formData, password: "", confirmPassword: "" });
      setError("Passwords do not match.");
      return;
    }

    const url = `${import.meta.env.VITE_API_BASE_URL}/signup/`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });
    const json = await response.json();

    if (response.status !== 201) {
      setFormData({ ...formData, password: "", confirmPassword: "" });
      setError(json.error);
      return;
    }

    console.log("here");
    navigate("/login");
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
            <h1 className="text-blue-500 text-4xl z-4">Sign Up</h1>
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
              placeholder="Email"
              autoComplete="off"
              type="email"
              value={formData.email}
              name="email"
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
            <input
              className="w-full rounded-md p-3 border-1 border-blue-400"
              placeholder="Confirm Password"
              autoComplete="off"
              type="password"
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={handleOnChange}
            />
            <p className="h-[1em] flex items-center text-red-500">
              {error ? error : ""}
            </p>
            <button
              className="bg-gradient-to-l from-blue-500 to-blue-400 text-white py-2 rounded-md cursor-pointer"
              type="submit"
            >
              Sign Up
            </button>
            <Link
              to="/login"
              className="text-blue-500 py-2 rounded-md cursor-pointer flex justify-center hover:underline"
              type="button"
            >
              Already have an account? Login
            </Link>
          </form>
        </div>
      </Flashlight>
    </div>
  );
}
