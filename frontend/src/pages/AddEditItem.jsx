import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Film,
  Tv,
  Star,
  Loader2,
  Save,
  Trash2,
  ArrowLeft,
  Search,
  X,
} from "lucide-react";
import api from "../utils/api";

const AddEditItem = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [status, setStatus] = useState("Plan to Watch");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchItem = async () => {
        setIsLoading(true);
        try {
          const res = await api.get(`/watchlist/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const item = res.data;
          setTitle(item.title || "");
          setType(item.type || "movie");
          setStatus(item.status || "Plan to Watch");
          setRating(item.rating !== null ? String(item.rating) : "");
          setNotes(item.notes || "");
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.error || "Failed to load item.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchItem();
    }
  }, [isEditMode, id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    const itemData = {
      title,
      type,
      status,
      notes,
    };
    if (rating !== "") itemData.rating = Number(rating);

    try {
      if (isEditMode) {
        await api.put(`/watchlist/${id}`, itemData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/watchlist", itemData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/watchlist");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Failed to save item. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fetchSuggestions = async (query) => {
    setIsSearching(true);
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setSuggestions(data.results?.slice(0, 5) || []);
    } catch (err) {
      console.error("TMDB search error:", err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text-primary">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent-orange mx-auto mb-4" />
          <p className="animate-pulse">Loading your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between bg-card p-4 rounded-2xl shadow">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-text-primary hover:text-accent-hover transition p-2 rounded-xl hover:bg-accent-hover/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-accent-orange">
              {isEditMode ? "Edit Item" : "Add New Item"}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-card p-6 rounded-2xl shadow-lg"
        >
          {/* Title */}
          <div className="relative">
            <label htmlFor="title" className="block text-sm mb-1">
              Title
            </label>
            <div className="relative">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                  setSelectedId(null);
                  if (typingTimeout) clearTimeout(typingTimeout);
                  setTypingTimeout(
                    setTimeout(() => {
                      if (value.length >= 2) fetchSuggestions(value);
                    }, 300)
                  );
                }}
                required
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 bg-input text-text-primary border border-border rounded-xl focus:ring-2 focus:ring-accent-hover transition"
                placeholder="Search for a movie or TV show..."
              />
              {isSearching ? (
                <Loader2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              )}
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-card border border-border mt-2 rounded-xl shadow-xl">
                {suggestions.map((sug) => (
                  <li
                    key={sug.id}
                    onClick={() => {
                      setTitle(sug.title || sug.name);
                      setType(sug.media_type);
                      setSuggestions([]);
                      setSelectedId(sug.id);
                    }}
                    className="px-4 py-3 hover:bg-accent-hover/10 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      {sug.media_type === "movie" ? (
                        <Film className="w-5 h-5 text-accent-orange" />
                      ) : (
                        <Tv className="w-5 h-5 text-accent-orange" />
                      )}
                      <div>
                        <div className="font-medium text-text-primary">
                          {sug.title || sug.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {sug.release_date || sug.first_air_date
                            ? new Date(
                                sug.release_date || sug.first_air_date
                              ).getFullYear()
                            : "Unknown year"}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm mb-1">
                Type
              </label>
              <div className="relative">
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={selectedId !== null}
                  className="w-full pl-10 pr-4 py-3 bg-input text-text-primary border border-border rounded-xl focus:ring-2 focus:ring-accent-hover disabled:opacity-50"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
                {type === "movie" ? (
                  <Film className="absolute left-3 top-3.5 w-5 h-5 text-accent-orange" />
                ) : (
                  <Tv className="absolute left-3 top-3.5 w-5 h-5 text-accent-orange" />
                )}
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-input text-text-primary border border-border rounded-xl focus:ring-2 focus:ring-accent-hover"
              >
                <option value="Watched">Watched</option>
                <option value="Watching">Watching</option>
                <option value="Plan to Watch">Plan to Watch</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm mb-1">
              Rating
            </label>
            <div className="relative">
              <input
                id="rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full pr-10 py-3 bg-input text-text-primary border border-border rounded-xl focus:ring-2 focus:ring-accent-hover"
                placeholder="Rate from 0 to 10"
              />
              <Star className="absolute right-3 top-3.5 w-5 h-5 text-yellow-400" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 bg-input text-text-primary border border-border rounded-xl focus:ring-2 focus:ring-accent-hover resize-none"
              placeholder="Add your thoughts, reviews, or reminders..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-orange text-background px-6 py-3 rounded-xl hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isEditMode ? "Save Changes" : "Add Item"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={async () => {
                  if (
                    window.confirm("Are you sure you want to delete this item?")
                  ) {
                    setIsSaving(true);
                    try {
                      await api.delete(`/watchlist/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      navigate("/watchlist");
                    } catch (err) {
                      console.error(err);
                      setError("Failed to delete item.");
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:brightness-110 transition"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditItem;
