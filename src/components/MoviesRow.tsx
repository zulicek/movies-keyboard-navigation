"use client";

import React, { useEffect, useRef } from "react";
import MoviesCard from "./MovieCard";
import { Movie } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { breakpoints, useSlidesPerView } from "../hooks/useSlidesPerView";
import { useAppDispatch } from "../store/store";
import { moveLeft, moveRight } from "../store/itemsSlice";
import { useSelector } from "react-redux";
import {
  setActiveRow,
  selectVisibleSlidesPerRow,
  setActiveSlideOnHover,
} from "../store/itemsSlice";

interface MoviesRowProps {
  index: number;
  title: string;
  movies: Movie[];
  swiperRef: (swiper: SwiperType) => void;
  activeSlideIndex: number;
  isActive: boolean;
  shouldShowNavigation: boolean;
}

export default function MoviesRow({
  index,
  title,
  movies,
  swiperRef,
  activeSlideIndex,
  isActive,
  shouldShowNavigation,
}: MoviesRowProps) {
  const dispatch = useAppDispatch();
  const slidesPerView = useSlidesPerView();
  const swiperInstance = useRef<SwiperType | null>(null);
  const visibleSlidesPerRow = useSelector(selectVisibleSlidesPerRow(index));

  useEffect(() => {
    if (!isActive || !swiperInstance.current) return;

    const swiper = swiperInstance.current;
    const visibleSlide = visibleSlidesPerRow;

    if (
      visibleSlide.firstVisibleSlide !== undefined &&
      visibleSlide.lastVisibleSlide !== undefined
    ) {
      swiper.slideTo(visibleSlide.firstVisibleSlide, 300);
    }
  }, [activeSlideIndex, visibleSlidesPerRow, isActive]);

  return (
    <div className="flex md:flex-row flex-col lg:space-x-8">
      <div className="w-full md:w-[20%] lg:w-[10%] mb-8">
        {title && <h2 className="text-lg font-bold mb-5">{title}</h2>}
      </div>

      <Swiper
        breakpoints={breakpoints}
        slidesPerGroup={1}
        spaceBetween={10}
        initialSlide={visibleSlidesPerRow.activeSlide}
        onSwiper={(swiper) => {
          swiperInstance.current = swiper;
          swiperRef(swiper);
        }}
        className="w-full mb-8 mx-[-80px]"
      >
        {movies.map((movie, i) => (
          <SwiperSlide
            key={movie.id}
            className="flex tracking-[-5px] h-full items-end w-full h-full"
          >
            <MoviesCard
              movie={movie}
              selected={
                isActive && movie.id === movies[visibleSlidesPerRow.activeSlide]?.id
              }
              onMouseEnter={() =>
                dispatch(setActiveSlideOnHover({ rowIndex: index, slideIndex: i }))
              }
            />
          </SwiperSlide>
        ))}
        {movies.length > slidesPerView && shouldShowNavigation && (
          <>
            <button
              className="swiper-button-prev"
              onClick={() => {
                dispatch(setActiveRow({ rowIndex: index, maxSlides: movies.length }));
                dispatch(moveLeft());
              }}
            ></button>
            <button
              className="swiper-button-next"
              onClick={() => {
                dispatch(setActiveRow({ rowIndex: index, maxSlides: movies.length }));
                dispatch(moveRight());
              }}
            ></button>
          </>
        )}
      </Swiper>
    </div>
  );
}
