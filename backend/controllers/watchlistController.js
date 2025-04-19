import WatchItem from '../models/WatchItem.js';
import fetchMovieDetailsByTitle from '../utils/fetchTmdbDetails.js';
import fetchTmdbDetailsById from "../utils/fetchTmdbDetailsById.js";

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

export const addWatchItem = async (req, res) => {
  try {
    const { title, type } = req.body;
    const userId = req.user._id;

    let posterUrl = req.body.posterUrl;

    // If poster not provided, try fetching from TMDB
    if (!posterUrl && title && type) {
      const tmdbInfo = await fetchMovieDetailsByTitle(title, type);
      posterUrl = tmdbInfo?.posterUrl || null;
    }

    const item = new WatchItem({
      ...req.body,
      posterUrl,
      userId,
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error adding watch item:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
};


// Add a new watchlist item using TMDB API


export const fetchAndAddItem = async (req, res) => {
  try {
    const { title, type, tmdbId, posterUrl } = req.body;
    const userId = req.user.id;

    if (!title || !type || !tmdbId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if already exists
    const existing = await WatchItem.findOne({ tmdbId, userId });
    if (existing) {
      return res.status(400).json({ error: "Item already in watchlist" });
    }

    // ✅ Fetch full TMDB metadata
    const tmdbDetails = await fetchTmdbDetailsById(tmdbId, type);
    console.log("🎬 TMDB Details:", tmdbDetails);
    if (!tmdbDetails) {
      return res.status(500).json({ error: "Failed to fetch TMDB details" });
    }

    const newItem = new WatchItem({
      title: tmdbDetails.title || title,
      type,
      tmdbId,
      posterUrl: tmdbDetails.posterUrl || posterUrl,
      genre: tmdbDetails.genre,
      runtime: tmdbDetails.runtime,
      userId,
      status: "Plan to Watch",
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Fetch & Add failed:", err.message);
    res.status(500).json({ error: "Failed to add item" });
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
        genreCounts: {},
        typeCounts: {},
        ratingDistribution: {},
        statusCounts: {}
      });
    }

    const totalWatchTime = items.reduce((sum, i) => sum + Number(i.runtime || 0), 0);

    const rated = items.filter(i => !isNaN(Number(i.rating)));
    const averageRating = rated.length
      ? (rated.reduce((sum, i) => sum + Number(i.rating), 0) / rated.length).toFixed(1)
      : 0;

    const genreCounts = {};
    items.forEach(item => {
      (item.genre || []).forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g]) => g);

    const typeCounts = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    const ratingDistribution = {
      '0–4': 0,
      '5–6': 0,
      '7–8': 0,
      '9–10': 0
    };

    rated.forEach(item => {
      const r = Number(item.rating);
      if (r <= 4) ratingDistribution['0–4'] += 1;
      else if (r <= 6) ratingDistribution['5–6'] += 1;
      else if (r <= 8) ratingDistribution['7–8'] += 1;
      else ratingDistribution['9–10'] += 1;
    });

    const statusCounts = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalWatchTime,
      averageRating,
      topGenres,
      genreCounts,
      typeCounts,
      ratingDistribution,
      statusCounts
    });
  } catch (err) {
    console.error('💥 getWatchlistStats ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
