import WatchItem from '../models/WatchItem.js';
import fetchMovieDetailsByTitle from '../utils/fetchTmdbDetails.js';

// Get all watchlist items for the logged-in user
export const getWatchlist = async (req, res) => {
  try {
    const items = await WatchItem.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single watchlist item by ID
export const getSingleItem = async (req, res) => {
  try {
    const item = await WatchItem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new watchlist item manually (used in /watchlist)
export const addWatchItem = async (req, res) => {
  try {
    const item = new WatchItem({
      ...req.body,
      userId: req.user._id
    });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
};

// Add a new watchlist item using TMDB API
export const fetchAndAddItem = async (req, res) => {
  const { title, status, rating, comment } = req.body;

  console.log('▶️ Received request body:', req.body);

  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const metadata = await fetchMovieDetailsByTitle(title);
    console.log('📦 TMDB metadata:', metadata);

    if (!metadata) return res.status(404).json({ error: 'Movie not found in TMDB' });

    const item = new WatchItem({
      ...metadata,
      status,
      rating,
      comment,
      userId: req.user._id
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('🔥 ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch and add item' });
  }
};


// Update an existing item
export const updateWatchItem = async (req, res) => {
  try {
    const updated = await WatchItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// Delete an item
export const deleteWatchItem = async (req, res) => {
  try {
    const deleted = await WatchItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

// Stats: total watch time, average rating, top genres, status counts
export const getWatchlistStats = async (req, res) => {
  try {
    const items = await WatchItem.find({ userId: req.user._id });

    if (!items.length) {
      return res.json({
        totalWatchTime: 0,
        averageRating: 0,
        topGenres: [],
        statusCounts: {}
      });
    }

    const totalWatchTime = items.reduce((sum, i) => sum + (i.runtime || 0), 0);
    const rated = items.filter(i => typeof i.rating === 'number');
    const averageRating = rated.length
      ? (rated.reduce((sum, i) => sum + i.rating, 0) / rated.length).toFixed(1)
      : 0;

    const genreCount = {};
    items.forEach(item => {
      (item.genre || []).forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g]) => g);

    const statusCounts = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalWatchTime,
      averageRating,
      topGenres,
      statusCounts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
};
