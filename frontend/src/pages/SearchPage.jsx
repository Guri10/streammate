import React, { useState } from "react";
import api from "../utils/api";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/tmdb/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1A2E] min-h-screen text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#E94560]">
          🔍 Search Movies & TV Shows
        </h2>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Search TMDB..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#16213E] text-white border border-[#0F3460] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560] transition"
          />
          <button
            type="submit"
            className="bg-[#E94560] hover:bg-[#ff5d73] transition px-6 py-2 rounded-lg font-semibold text-white"
          >
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <li
                key={item.tmdbId}
                className="bg-[#16213E] p-3 rounded-xl shadow hover:shadow-lg transition duration-200"
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-60 object-cover rounded-md mb-3"
                />
                <p className="font-semibold text-white truncate">
                  {item.title}
                </p>
                <p className="text-sm text-gray-400 capitalize">{item.type}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
