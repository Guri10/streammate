import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AddEditItem = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Form state for watchlist item fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [status, setStatus] = useState('Plan to Watch');
  const [rating, setRating] = useState('');   // string to allow empty (no rating)
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Fetch item data in edit mode to pre-fill the form
  useEffect(() => {
    if (isEditMode) {
      const fetchItem = async () => {
        try {
          const res = await api.get(`/watchlist/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const item = res.data;
          // Populate state with fetched item fields
          setTitle(item.title || '');
          setType(item.type || 'movie');
          setStatus(item.status || 'Plan to Watch');
          setRating(item.rating !== null && item.rating !== undefined ? String(item.rating) : '');
          setNotes(item.notes || '');
        } catch (err) {
          console.error(err);
          // Handle fetch error (e.g., item not found or auth error)
          setError(err.response?.data?.error || 'Failed to load item.');
        }
      };
      fetchItem();
    } else {
      // Ensure form is cleared in add mode
      setTitle('');
      setType('movie');
      setStatus('Plan to Watch');
      setRating('');
      setNotes('');
    }
  }, [isEditMode, id, token]);

  // Handle form submission for add or edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Prepare request body
    const itemData = {
      title,
      type,
      status,
      notes
    };
    if (rating !== '') {
      itemData.rating = Number(rating);  // include rating if provided
    }

    try {
      if (isEditMode) {
        // Update existing item
        await api.put(`/watchlist/${id}`, itemData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Add new item
        await api.post('/watchlist/fetch-and-add', itemData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      // On success, navigate back to watchlist
      navigate('/watchlist');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save item. Please try again.');
    }
  };

  // Handle delete action (only available in edit mode)
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/watchlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // After deletion, go back to watchlist
      navigate('/watchlist');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to delete item.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? 'Edit Watchlist Item' : 'Add Watchlist Item'}
      </h2>

      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Watchlist item form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input 
            id="title" 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select 
            id="type" 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            required 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select 
            id="status" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            required 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="Watched">Watched</option>
            <option value="Watching">Watching</option>
            <option value="Plan to Watch">Plan to Watch</option>
          </select>
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <input 
            id="rating" 
            type="number" 
            min="0" max="10" step="0.1"
            value={rating} 
            onChange={(e) => setRating(e.target.value)} 
            placeholder="(optional)" 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea 
            id="notes" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            rows="4" 
            placeholder="(optional)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Form actions: submit and delete (if editing) */}
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            {isEditMode ? 'Save Changes' : 'Add Item'}
          </button>
          {isEditMode && (
            <button 
              type="button" 
              onClick={handleDelete} 
              className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEditItem;
