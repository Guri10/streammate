import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Film } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;
        login(token, user);
        navigate("/watchlist");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3460] via-[#16213E] to-[#1A1A2E] text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-10 w-10 text-accent-orange"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 3v18" />
            <path d="M3 7.5h4" />
            <path d="M3 12h18" />
            <path d="M3 16.5h4" />
            <path d="M17 3v18" />
            <path d="M17 7.5h4" />
            <path d="M17 16.5h4" />
          </svg>
          <h2 className="mt-4 text-3xl font-bold text-white">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-300">Sign in to StreamMate</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            placeholder="Email address"
            className="w-full bg-white/10 text-sm text-white placeholder-gray-400 border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-purple"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            className="w-full bg-white/10 text-sm text-white placeholder-gray-400 border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-purple"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-accent-orange hover:bg-accent-hover text-white font-medium py-2 rounded transition duration-200"
          >
            Sign in
          </button>
          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <a href="/register" className="text-accent-orange hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
