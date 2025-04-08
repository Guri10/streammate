const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  getWatchlist,
  getSingleItem,
  addWatchItem,
  updateWatchItem,
  deleteWatchItem,
  getWatchlistStats,
  fetchAndAddItem,
} = require('../controllers/watchlistController');

// Protect all routes below
router.use(protect);

// Smart TMDB-based Add
router.post('/fetch-and-add', fetchAndAddItem);

// Regular CRUD
router.get('/', getWatchlist);
router.get('/:id', getSingleItem);
router.post('/', addWatchItem);
router.put('/:id', updateWatchItem);
router.delete('/:id', deleteWatchItem);

// Stats route
router.get('/stats', getWatchlistStats);

module.exports = router;
