const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search query' });

  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
      params: {
        api_key: TMDB_API_KEY,
        query
      }
    });

    const results = tmdbRes.data.results.map(item => ({
      title: item.title || item.name,
      type: item.media_type,
      overview: item.overview,
      posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      tmdbId: item.id,
      genreIds: item.genre_ids
    }));

    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'TMDB API error' });
  }
});

module.exports = router;
