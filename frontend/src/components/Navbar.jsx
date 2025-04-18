import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Film, LayoutDashboard, Search, LogOut } from "lucide-react";

const Navbar = () => {
  const { logout, token } = useAuth();
  const location = useLocation();

  if (!token) return null;

  const links = [
    { path: "/watchlist", label: "Watchlist", icon: <Film size={18} /> },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { path: "/search", label: "Search", icon: <Search size={18} /> },
  ];

  return (
    <nav className="bg-background text-text-primary px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-10">
          <span className="text-2xl font-bold text-accent-orange tracking-wide">
            🎬 StreamMate
          </span>

          <div className="flex items-center gap-6">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1 text-sm font-medium transition duration-300 ${
                    isActive
                      ? "text-accent-orange"
                      : "text-gray-400 hover:text-accent-hover"
                  }`}
                >
                  {React.cloneElement(link.icon, {
                    className: isActive
                      ? "text-accent-orange"
                      : "text-gray-500",
                  })}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-accent-orange hover:bg-accent-hover text-background px-4 py-2 rounded-md text-sm font-semibold transition shadow"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
