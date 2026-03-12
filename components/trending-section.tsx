"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Plus, Play, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = ["All", "Action", "Drama", "Sci-Fi", "Horror", "Comedy"]

const movies = [
  { id: 1, title: "Stellar Horizon", genre: "Sci-Fi", rating: 9.1, year: 2025, poster: "/images/movie-1.jpg", rank: 1, hot: true },
  { id: 2, title: "Neon Shadows", genre: "Thriller", rating: 8.7, year: 2025, poster: "/images/movie-2.jpg", rank: 2, hot: true },
  { id: 3, title: "Ember Throne", genre: "Fantasy", rating: 8.9, year: 2024, poster: "/images/movie-3.jpg", rank: 3, hot: false },
  { id: 4, title: "City of Lights", genre: "Drama", rating: 8.2, year: 2025, poster: "/images/movie-4.jpg", rank: 4, hot: false },
  { id: 5, title: "Glass City", genre: "Action", rating: 8.5, year: 2025, poster: "/images/movie-5.jpg", rank: 5, hot: true },
  { id: 6, title: "The Hollow", genre: "Horror", rating: 7.9, year: 2024, poster: "/images/movie-6.jpg", rank: 6, hot: false },
  { id: 7, title: "Lost Map", genre: "Comedy", rating: 8.0, year: 2025, poster: "/images/movie-7.jpg", rank: 7, hot: false },
  { id: 8, title: "Dawn's Edge", genre: "Drama", rating: 8.6, year: 2024, poster: "/images/movie-8.jpg", rank: 8, hot: true },
]

function MovieCard({ movie, onSelect }: { movie: typeof movies[0]; onSelect: (m: typeof movies[0]) => void }) {
  const [inList, setInList] = useState(false)

  return (
    <article
      className="group relative cursor-pointer rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
      onClick={() => onSelect(movie)}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground ml-0.5" />
          </button>
        </div>
        {/* Rank badge */}
        <div className="absolute top-2 left-2 h-7 w-7 rounded-md bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-xs font-bold text-primary">#{movie.rank}</span>
        </div>
        {/* Hot badge */}
        {movie.hot && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5">
            <TrendingUp className="h-3 w-3 text-primary-foreground" />
            <span className="text-[10px] font-bold text-primary-foreground">HOT</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm truncate leading-tight">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-primary text-xs font-bold">{movie.rating}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">{movie.year}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setInList(!inList) }}
              className={cn(
                "h-6 w-6 rounded flex items-center justify-center transition-colors",
                inList ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"
              )}
              aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Plus className={cn("h-3.5 w-3.5 transition-transform", inList && "rotate-45")} />
            </button>
          </div>
        </div>
        <span className="mt-1 inline-block rounded text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5">{movie.genre}</span>
      </div>
    </article>
  )
}

export function TrendingSection({ onMovieSelect }: { onMovieSelect: (m: typeof movies[0]) => void }) {
  const [activeTab, setActiveTab] = useState("All")

  const filtered = activeTab === "All" ? movies : movies.filter((m) => m.genre === activeTab)

  return (
    <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">This Week</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground">Trending Films</h2>
        </div>
        {/* Genre tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {filtered.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelect={onMovieSelect} />
        ))}
      </div>
    </section>
  )
}
