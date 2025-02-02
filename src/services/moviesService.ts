import api from "./api";

export const fetchGenres = async () => {
  const response = await api.get("/genre/movie/list?language=en-US");
  return response.data;
};

// limit is used for presentation purposes only
export const fetchMoviesByGenre = async (genreId: number, limit: number = 10) => {
  const response = await api.get(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`
  );

  const limitedMovies = response.data.results.slice(0, limit);

  return { genreId: genreId, movies: limitedMovies };
};

