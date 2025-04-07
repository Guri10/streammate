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
