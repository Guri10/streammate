import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const fetchMovieDetailsByTitle = async (title) => {
  const searchUrl = `${TMDB_BASE_URL}/search/multi`;
  const searchRes = await axios.get(searchUrl, {
    params: { api_key: TMDB_API_KEY, query: title }
  });

  const match = searchRes.data.results?.find(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  );
  if (!match) return null;

  const detailUrl =
    match.media_type === 'movie'
      ? `${TMDB_BASE_URL}/movie/${match.id}`
      : `${TMDB_BASE_URL}/tv/${match.id}`;

  const detailRes = await axios.get(detailUrl, {
    params: { api_key: TMDB_API_KEY }
  });

  const details = detailRes.data;

  return {
    title: details.title || details.name,
    tmdbId: details.id,
    genre: (details.genres || []).map((g) => g.name),
    runtime: details.runtime || details.episode_run_time?.[0] || null,
    posterUrl: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
    type: match.media_type // 👈 "movie" or "tv"
  };
};


export default fetchMovieDetailsByTitle;
