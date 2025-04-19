import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const fetchTmdbDetailsById = async (tmdbId, type) => {
  if (!tmdbId || !type) return null;

  try {
    const url = `${TMDB_BASE_URL}/${type}/${tmdbId}`;
    const res = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    const data = res.data;
    console.log("✅ GENRES:", data.genres);
    return {
      title: data.title || data.name,
      tmdbId: data.id,
    //   genre: data.genres?.map((g) => g.name) || [],
      genre: Array.isArray(data.genres) ? data.genres.map((g) => g.name) : [],

      runtime: data.runtime || data.episode_run_time?.[0] || null,
      posterUrl: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : null,
      releaseDate: data.release_date || data.first_air_date || null,
      overview: data.overview || null,
    };
  } catch (err) {
    console.error("❌ TMDB ID fetch failed:", err.message);
    return null;
  }
};

export default fetchTmdbDetailsById;
