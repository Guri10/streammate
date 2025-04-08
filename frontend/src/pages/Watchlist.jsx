// ✅ Here's your updated Watchlist.jsx file with Genre column
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Watchlist = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await api.get('/watchlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load watchlist.');
      }
    };
    fetchWatchlist();
  }, [token]);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    try {
      await api.delete(`/watchlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems((prevItems) => prevItems.filter(item => item._id !== itemId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to delete item.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 text-right">
        <Link 
          to="/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Add Item
        </Link>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-4 py-2 border-b">Title</th>
            <th className="text-left px-4 py-2 border-b">Type</th>
            <th className="text-left px-4 py-2 border-b">Genres</th>
            <th className="text-left px-4 py-2 border-b">Status</th>
            <th className="text-left px-4 py-2 border-b">Rating</th>
            <th className="text-left px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{item.title}</td>
              <td className="px-4 py-2 capitalize">{item.type}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{item.genre?.join(', ') || '-'}</td>
              <td className="px-4 py-2">{item.status}</td>
              <td className="px-4 py-2">{item.rating != null ? item.rating : ''}</td>
              <td className="px-4 py-2">
                <Link 
                  to={`/edit/${item._id}`} 
                  className="text-blue-600 hover:underline mr-4"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(item._id)} 
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist;
