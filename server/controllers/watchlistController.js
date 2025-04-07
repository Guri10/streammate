const WatchItem = require('../models/WatchItem');

// GET all watch items for the user
exports.getWatchlist = async (req, res) => {
  const items = await WatchItem.find({ userId: req.user._id });
  res.json(items);
};

// POST add new item
exports.addWatchItem = async (req, res) => {
  const newItem = new WatchItem({ ...req.body, userId: req.user._id });
  const saved = await newItem.save();
  res.status(201).json(saved);
};

// PUT update item
exports.updateWatchItem = async (req, res) => {
  const updated = await WatchItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Item not found' });
  res.json(updated);
};

// DELETE item
exports.deleteWatchItem = async (req, res) => {
  const deleted = await WatchItem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) return res.status(404).json({ error: 'Item not found' });
  res.json({ message: 'Item deleted' });
};


exports.getWatchlistStats = async (req, res) => {
  const items = await WatchItem.find({ userId: req.user._id });

  if (!items.length) {
    return res.json({
      totalWatchTime: 0,
      averageRating: 0,
      topGenres: [],
      statusCounts: {}
    });
  }

  // Total watch time
  const totalWatchTime = items.reduce((sum, item) => sum + (item.runtime || 0), 0);

  // Average rating
  const ratings = items.filter(i => i.rating != null).map(i => i.rating);
  const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;

  // Top genres
  const genreCount = {};
  items.forEach(item => {
    (item.genre || []).forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // top 5
    .map(([genre, count]) => ({ genre, count }));

  // Count by status
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
};
