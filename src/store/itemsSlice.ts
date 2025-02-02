import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Movie, Genre } from "../types";
import { moviesCountByGenre } from "../services/api";
import * as moviesService from "../services/moviesService";

interface ItemsState {
  genres: Genre[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  moviesByGenre: {
    [genreId: number]: {
      movies: Movie[];
      status: "idle" | "loading" | "succeeded" | "failed";
    };
  };
  activeRowIndex: number;
  activeSlideIndex: number;
  slidesPerView: number;
  visibleSlidesPerRow: {
    firstVisibleSlide: number;
    lastVisibleSlide: number;
    activeSlide: number;
  }[];
}

const initialState: ItemsState = {
  genres: [],
  status: "idle",
  error: null,
  moviesByGenre: {},
  activeRowIndex: 0,
  activeSlideIndex: 0,
  slidesPerView: 10,
  visibleSlidesPerRow: [],
};

const calculateVisibleSlides = (
  movies: Movie[],
  slidesPerView: number
) => {
  const totalSlides = movies.length;
  const firstVisibleSlide = 0;
  const lastVisibleSlide = Math.min(firstVisibleSlide + slidesPerView - 1, totalSlides - 1);

  return { firstVisibleSlide, lastVisibleSlide };
};

export const getGenres = createAsyncThunk("movies/getGenres", async () => {
  return await moviesService.fetchGenres();
});

export const getMoviesByGenre = createAsyncThunk(
  "movies/getMoviesByGenre",
  async (genreId: number) => {
    const count = moviesCountByGenre[genreId] || 10; // hardcoded number of movies by genre for presentation purposes
    const { movies } = await moviesService.fetchMoviesByGenre(genreId, count);
    return { genreId, movies };
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setActiveRow: (state, action: PayloadAction<{ rowIndex: number; maxSlides: number }>) => {
      const { rowIndex, maxSlides } = action.payload;
      state.activeRowIndex = rowIndex;
      state.activeSlideIndex = Math.min(state.activeSlideIndex, maxSlides - 1);
    },

    setActiveSlide: (state, action: PayloadAction<number>) => {
      state.activeSlideIndex = action.payload;
    },

    setActiveSlideOnHover: (state, action: PayloadAction<{ rowIndex: number; slideIndex: number }>) => {
      const { rowIndex, slideIndex } = action.payload;

      if (state.activeRowIndex !== rowIndex) {
        state.activeRowIndex = rowIndex;
      }

      const visibleSlides = state.visibleSlidesPerRow[rowIndex];
      state.activeSlideIndex = slideIndex;
      visibleSlides.activeSlide = state.activeSlideIndex;
    },

    moveRight: (state) => {
      const activeRow = state.activeRowIndex;
      const genreId = state.genres[activeRow]?.id;
      const movies = state.moviesByGenre[genreId]?.movies || [];
      const maxSlides = movies.length;
      const visibleSlides = state.visibleSlidesPerRow[activeRow];

      if (visibleSlides.lastVisibleSlide === maxSlides - 1 && visibleSlides.activeSlide === maxSlides - 1) {
        state.activeSlideIndex = 0;
        visibleSlides.activeSlide = 0;
        visibleSlides.firstVisibleSlide = 0;
        visibleSlides.lastVisibleSlide = Math.min(state.slidesPerView - 1, maxSlides - 1);
      } else {
        visibleSlides.activeSlide++;
        if (visibleSlides.activeSlide > visibleSlides.lastVisibleSlide) {
          visibleSlides.firstVisibleSlide++;
          visibleSlides.lastVisibleSlide++;
        }
        state.activeSlideIndex = visibleSlides.activeSlide - visibleSlides.firstVisibleSlide;
      }
    },

    moveLeft: (state) => {
      const activeRow = state.activeRowIndex;
      const genreId = state.genres[activeRow]?.id;
      const movies = state.moviesByGenre[genreId]?.movies || [];
      const maxSlides = movies.length;
      const visibleSlides = state.visibleSlidesPerRow[activeRow];

      if (visibleSlides.firstVisibleSlide === 0 && visibleSlides.activeSlide === 0) {
        state.activeSlideIndex = maxSlides - 1;
        visibleSlides.activeSlide = state.activeSlideIndex;
        visibleSlides.lastVisibleSlide = state.activeSlideIndex;
        visibleSlides.firstVisibleSlide = Math.max(state.activeSlideIndex - state.slidesPerView + 1, 0);
      } else {
        visibleSlides.activeSlide--;
        if (visibleSlides.activeSlide < visibleSlides.firstVisibleSlide) {
          visibleSlides.firstVisibleSlide--;
          visibleSlides.lastVisibleSlide--;
        }
        state.activeSlideIndex = visibleSlides.activeSlide - visibleSlides.firstVisibleSlide;
      }
    },

    moveDown: (state) => {
      const maxRows = state.genres.length;
      const currentRow = state.activeRowIndex;
      const nextRow = Math.min(currentRow + 1, maxRows - 1);

      const visibleSlides = state.visibleSlidesPerRow[nextRow];
      visibleSlides.activeSlide = Math.min(state.activeSlideIndex + visibleSlides.firstVisibleSlide, visibleSlides.lastVisibleSlide);
      state.activeSlideIndex = visibleSlides.activeSlide - visibleSlides.firstVisibleSlide;
      state.activeRowIndex = nextRow;
    },

    moveUp: (state) => {
      const maxRows = state.genres.length;
      const currentRow = state.activeRowIndex;
      const prevRow = Math.max(currentRow - 1, 0);

      const visibleSlides = state.visibleSlidesPerRow[prevRow];
      visibleSlides.activeSlide = Math.min(state.activeSlideIndex + visibleSlides.firstVisibleSlide, visibleSlides.lastVisibleSlide);
      state.activeSlideIndex = visibleSlides.activeSlide - visibleSlides.firstVisibleSlide;
      state.activeRowIndex = prevRow;
    },

    setSlidesPerView: (state, action: PayloadAction<number>) => {
      const newSlidesPerView = action.payload;
      state.slidesPerView = newSlidesPerView;
      state.activeSlideIndex = Math.min(state.activeSlideIndex, newSlidesPerView - 1);

      state.visibleSlidesPerRow.forEach((visibleSlides, index) => {
        const rowMovies = state.moviesByGenre[state.genres[index]?.id]?.movies || [];
        const { firstVisibleSlide, lastVisibleSlide } = calculateVisibleSlides(rowMovies, newSlidesPerView);
        visibleSlides.firstVisibleSlide = firstVisibleSlide;
        visibleSlides.lastVisibleSlide = lastVisibleSlide;
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getGenres.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.genres = action.payload.genres ? action.payload.genres.slice(0, 10) : [];
      })
      .addCase(getGenres.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGenres.rejected, (state) => {
        state.status = "failed";
        state.genres = [];
        state.error = "Failed to load genres";
      })
      .addCase(getMoviesByGenre.pending, (state, action) => {
        const genreId = action.meta.arg;
        state.moviesByGenre[genreId] = { status: "loading", movies: [] };
      })
      .addCase(getMoviesByGenre.fulfilled, (state, action) => {
        const { genreId, movies } = action.payload;
        state.moviesByGenre[genreId] = { status: "succeeded", movies };

        state.visibleSlidesPerRow = state.genres.map((_, rowIndex) => {
          const rowMovies = state.moviesByGenre[state.genres[rowIndex]?.id]?.movies || [];
          const visibleSlides = calculateVisibleSlides(rowMovies, state.slidesPerView);
          return {
            ...visibleSlides,
            activeSlide: 0,
          };
        });
      })
      .addCase(getMoviesByGenre.rejected, (state, action) => {
        const genreId = action.meta.arg;
        state.moviesByGenre[genreId] = { status: "failed", movies: [] };
        state.error = action.error.message || "Failed to load movies by genre";
      });
  },
});

export const {
  setActiveRow,
  setActiveSlide,
  setActiveSlideOnHover,
  setSlidesPerView,
  moveRight,
  moveLeft,
  moveDown,
  moveUp,
} = itemsSlice.actions;

export const selectGenres = (state: RootState) => state.items.genres;
export const selectGenresStatus = (state: RootState) => state.items.status;
export const selectMoviesByGenre = (state: RootState) => state.items.moviesByGenre;
export const selectActiveRowIndex = (state: RootState) => state.items.activeRowIndex;
export const selectActiveSlideIndex = (state: RootState) => state.items.activeSlideIndex;
export const selectVisibleSlidesPerRow = (rowIndex: number) => (state: RootState) => state.items.visibleSlidesPerRow[rowIndex];

export default itemsSlice.reducer;
