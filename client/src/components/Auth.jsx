import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/constants";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";

export default function Auth({setAuth}) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignup
      ? `${baseUrl}/register`
      : `${baseUrl}/login`;

      const payload = isSignup
      ? formData
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");

        return;
      }

      console.log("Success:", data);

      if(!isSignup) {
        if(data.token) {
          localStorage.setItem("token", data.token);
          setAuth(true);
          navigate("/dashboard");
        }
      } else{
        alert("Registration successful! Please log in.");
        setIsSignup(false);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="relative w-[56rem] h-[34rem] bg-white rounded-2xl shadow-2xl overflow-hidden">

      {/* Login */}
      <form
        onSubmit={handleSubmit}
        className={`absolute top-0 left-0 w-[40rem] h-full p-12 transition-all duration-1000
        ${isSignup ? "translate-x-[40rem] opacity-0 pointer-events-none" : ""}`}
      >
        <h2 className="text-3xl font-semibold text-center mb-8">
          Welcome Back
        </h2>

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-6 border-b py-2 text-center outline-none"
        />

        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-8 border-b py-2 text-center outline-none"
        />
        <span
          className="absolute right-20 top-49 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </span>

        <button
          type="submit"
          className="mx-auto block w-64 h-10 bg-purple-600 text-white rounded-full"
        >
          Login
        </button>
        <p className="top-60px">Forgot Password? <Link to="/forgot-password" className="text-blue-600">Click</Link></p>

        <div>
            Don&apos;t have an account?{" "}
            <Link href="/" className="ext-blue-600">
              Register
            </Link>
          </div>
      </form>

      {/* Register */}
      <form
        onSubmit={handleSubmit}
        className={`absolute inset-0 p-12 transition-all duration-700
        ${isSignup ? "opacity-100 translate-x-6" : "opacity-0 pointer-events-none"}`}
      >
        <h2 className="text-3xl font-semibold text-center mb-8">
          Create Account
        </h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-6 border-b py-2 text-center outline-none"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-6 border-b py-2 text-center outline-none"
        />

        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-8 border-b py-2 text-center outline-none"
        />
        <span
          className="absolute right-20 top-62 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </span>

        <button
          type="submit"
          className="mx-auto block w-64 h-10 bg-purple-600 text-white rounded-full"
        >
          Register
        </button>
      </form>

      {/* PURPLE PANEL */}
      <div
        className={`absolute top-0 right-0 w-64 h-full bg-gradient-to-br from-purple-600 to-purple-800
        text-white flex flex-col items-center justify-center transition-transform duration-1000
        ${isSignup ? "-translate-x-[40rem]" : ""}`}
      >
        <h3 className="text-xl font-semibold mb-2">
          {isSignup ? "Welcome Back!" : "Hello, Friend!"}
        </h3>

        <p className="text-sm text-center opacity-80 mb-6 px-4">
          {isSignup
            ? "Login to continue"
            : "Create an account to get started"}
        </p>

        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="w-32 h-9 border border-white rounded-full uppercase text-sm"
        >
          {isSignup ? "Login" : "Register"}
        </button>
      </div>

    </div>
  </div>
);

}