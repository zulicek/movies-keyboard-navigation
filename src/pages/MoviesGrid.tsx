import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import MoviesRow from "../components/MoviesRow";
import { LoadingOutlined } from "@ant-design/icons";
import { Swiper as SwiperType } from "swiper/types";
import {
  getGenres,
  selectGenres,
  selectGenresStatus,
  getMoviesByGenre,
  selectMoviesByGenre,
  selectActiveRowIndex,
  selectActiveSlideIndex,
  moveRight,
  moveLeft,
  moveDown,
  moveUp,
} from "../store/itemsSlice";

export default function MoviesGrid() {
  const dispatch = useAppDispatch();
  const genres = useSelector(selectGenres);
  const genresStatus = useSelector(selectGenresStatus);
  const moviesByGenre = useSelector(selectMoviesByGenre);
  const swiperRefs = useRef<(SwiperType | null)[]>([]);
  const activeRowIndex = useSelector(selectActiveRowIndex);
  const activeSlideIndex = useSelector(selectActiveSlideIndex);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [shouldShowNavigation, setShouldShowNavigation] = useState(true);

  const setSwiperRef = (index: number) => (swiper: SwiperType) => {
    swiperRefs.current[index] = swiper;
  };

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresStatus === "succeeded") {
      genres.forEach((genre) => dispatch(getMoviesByGenre(genre.id)));
    }
  }, [dispatch, genres, genresStatus]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (genres.length === 0) return;

      setShouldShowNavigation(false);

      switch (event.key) {
        case "ArrowRight":
          dispatch(moveRight());
          break;
        case "ArrowLeft":
          dispatch(moveLeft());
          break;
        case "ArrowDown":
          dispatch(moveDown());
          scrollToActiveRow(activeRowIndex + 1);
          break;
        case "ArrowUp":
          dispatch(moveUp());
          scrollToActiveRow(activeRowIndex - 1);
          break;
        default:
          break;
      }
    };

    const scrollToActiveRow = (index: number) => {
      if (index < 0 || index >= rowRefs.current.length) return;
      const row = rowRefs.current[index];
      if (!row) return;

      const rect = row.getBoundingClientRect();
      if (!(rect.top >= 0 && rect.bottom <= window.innerHeight)) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [dispatch, activeRowIndex, genres]);

  useEffect(() => {
    const handleMouseMove = () => setShouldShowNavigation(true);
    document.addEventListener("mousemove", handleMouseMove);

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="p-8">
      {genresStatus === "failed" && <div>Error loading genres</div>}
      {genresStatus === "loading" && (
        <div className="flex justify-center p-4">
          <LoadingOutlined className="text-secondary text-2xl" />
        </div>
      )}
      {genresStatus === "succeeded" && genres && Object.keys(moviesByGenre).length > 0 && (
        <>
          <h1 className="text-4xl font-bold text-center my-8">Movies by genre</h1>
          {genres.map((genre, index) => (
            <div key={genre.id} ref={(el) => { rowRefs.current[index] = el; }}>
              {moviesByGenre[genre.id].status === "loading" && (
                <div className="flex justify-center p-4">
                  <LoadingOutlined className="text-secondary text-2xl" />
                </div>
              )}
              {moviesByGenre[genre.id].status === "failed" && (
                <div>Error loading movies</div>
              )}
              {moviesByGenre[genre.id].status === "succeeded" && (
                <MoviesRow
                  index={index}
                  title={genre.name}
                  movies={moviesByGenre[genre.id]?.movies || []}
                  swiperRef={setSwiperRef(index)}
                  activeSlideIndex={activeSlideIndex}
                  isActive={activeRowIndex === index}
                  shouldShowNavigation={shouldShowNavigation}
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
