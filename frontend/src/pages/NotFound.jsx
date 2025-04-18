import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F3460] text-white px-4">
      <h1 className="text-6xl font-bold text-[#E94560] mb-4">404</h1>
      <p className="text-lg text-gray-300 mb-6">Oops! Page not found</p>
      <Link
        to="/watchlist"
        className="text-[#E94560] underline hover:text-pink-400 transition"
      >
        ← Back to Watchlist
      </Link>
    </div>
  );
};

export default NotFound;
