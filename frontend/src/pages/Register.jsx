import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Film } from "lucide-react";
import api from "../utils/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      if (res.status === 201) {
        setSuccess("Account created! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3460] via-[#16213E] to-[#1A1A2E] text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <Film className="mx-auto h-10 w-10 text-accent-orange" />
          <h2 className="mt-4 text-3xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-gray-300">Join StreamMate today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-400 text-red-300 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-400 text-green-300 px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-white/10 text-sm text-white placeholder-gray-400 border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/10 text-sm text-white placeholder-gray-400 border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/10 text-sm text-white placeholder-gray-400 border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-white/10 text-sm text-white placeholder-gray-400 border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <button
            type="submit"
            className="w-full bg-accent-orange hover:bg-accent-hover text-white font-medium py-2 rounded transition duration-200"
          >
            Sign up
          </button>
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-orange hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
