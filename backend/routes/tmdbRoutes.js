const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  try {
    const tmdbRes = await axios.get("https://api.themoviedb.org/3/search/multi", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
      },
    });

    const results = tmdbRes.data.results
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => ({
        id: item.id,
        title: item.title || item.name,
        type: item.media_type,
        posterUrl: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null,
      }));

    res.json(results);
  } catch (error) {
    console.error("TMDB Search Error:", error.message);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});

module.exports = router;
