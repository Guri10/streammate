import React, { useState } from 'react';
import api from '../utils/api';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/tmdb/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Movies & TV Shows</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search TMDB..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((item) => (
            <li key={item.tmdbId} className="bg-white p-4 rounded shadow">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500 capitalize">{item.type}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
