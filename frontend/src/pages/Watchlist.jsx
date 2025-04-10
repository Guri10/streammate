import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Watchlist = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await api.get("/watchlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load watchlist.");
      }
    };
    fetchWatchlist();
  }, [token]);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this item from your watchlist?")) return;
    try {
      await api.delete(`/watchlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete item.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header & Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-accent-orange flex items-center gap-2">
            🎬 My Watchlist
          </h2>
          <Link
            to="/add"
            className="bg-accent-orange hover:bg-accent-hover text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          >
            + Add Item
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-200 text-red-800 border border-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 ? (
          <p className="text-gray-400 text-center">
            No items in your watchlist yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-[#1F1F2E] rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <div
                  className="h-60 w-full bg-cover bg-center rounded-t-xl"
                  style={{
                    backgroundImage: item.posterUrl
                      ? `url(${item.posterUrl})`
                      : "linear-gradient(to right, #7B2CBF, #9D4EDD)",
                  }}
                >
                  {!item.posterUrl && (
                    <div className="h-full w-full flex items-center justify-center text-sm text-white text-center px-4">
                      🎞️ No Poster <br /> {item.title}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {item.genre?.join(", ") || "Unknown Genre"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {item.type} | {item.status}
                  </p>
                  {item.rating != null && (
                    <p className="text-sm text-yellow-400 mt-1">
                      ⭐ {item.rating}/10
                    </p>
                  )}
                  <div className="flex justify-between mt-3 text-sm">
                    <Link
                      to={`/edit/${item._id}`}
                      className="text-accent-purple hover:text-accent-hover"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-accent-orange hover:text-accent-hover"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
