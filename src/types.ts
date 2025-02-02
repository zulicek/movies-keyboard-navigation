export interface Movie {
  id: number
  title: string
  overview: string
  genres: Genre[]
  runtime: number
  production_countries: Record<string, any>[]
  vote_average: number
  poster_path: string
  backdrop_path: string
  release_date: string
}

export interface CastItem {
  id: number
  name: string
  profile_path: string
  character: string
}

export interface FavouriteItem {
  id: number
  title: string
}

export interface Genre {
  id: number
  name: string
}

export interface StreamingService {
  provider_id: number
  provider_name: string
  logo_path: string
}