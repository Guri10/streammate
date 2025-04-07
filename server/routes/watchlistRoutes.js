const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getWatchlist,
  addWatchItem,
  updateWatchItem,
  deleteWatchItem
} = require('../controllers/watchlistController');

router.use(protect);

router.get('/', getWatchlist);
router.post('/', addWatchItem);
router.put('/:id', updateWatchItem);
router.delete('/:id', deleteWatchItem);


const { getWatchlistStats } = require('../controllers/watchlistController');
router.get('/stats', getWatchlistStats);



module.exports = router;
