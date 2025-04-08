const mongoose = require('mongoose');

const watchItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  type: { type: String, enum: ['movie', 'tv'], required: true },
  status: { type: String, enum: ['Watched', 'Watching', 'Plan to Watch'], required: true },
  rating: { type: Number, default: null },
  notes: { type: String, default: '' },
  tags: [String],
  runtime: { type: Number },
  genre: [String],
  posterUrl: { type: String },
  tmdbId: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('WatchItem', watchItemSchema);
