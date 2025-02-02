"use client";

import React from "react";
import { Movie } from "../types";
import { IMG_URL } from "../services/api";

interface MovieCardProps {
  movie: Movie;
  selected?: boolean;
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function MovieCard({
  movie,
  selected,
  onMouseEnter,
}: MovieCardProps) {
  return (
    <div
      data-testid="movie-card"
      className={`overflow-hidden relative tracking-normal group w-full h-full cursor-pointer ${selected ? "active" : ""}`}
      onMouseEnter={onMouseEnter}
    >
      <img
        className="w-full h-full object-cover"
        src={`${IMG_URL}${movie.poster_path}`}
        alt={movie.title}
      />
      <div
        className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-between text-white font-bold transition-opacity duration-300 p-2 text-center border border-transparent
        ${selected && "!bg-opacity-20 shadow-[0px_0px_44px_17px_rgba(255,255,255,1)] !border-white"}`}
      >
        <h4 className="text-md leading-1.15">{movie.title}</h4>
      </div>
    </div>
  );
}
