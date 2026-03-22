"use client"

import { useState } from "react"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { TrendingUp, Star, Play, Plus, Filter, SortAsc, Flame, Clock, Film, Heart, Video } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MovieModal } from "@/components/movie-modal"
import { Button } from "@/components/ui/button"
import { MOVIES, GENRES, type Movie } from "@/lib/movies"
import { cn } from "@/lib/utils"

const SORT_OPTIONS = ["Trending", "Highest Rated", "Newest", "Most Reviews"] as const
type SortOption = (typeof SORT_OPTIONS)[number]

function sortMovies(movies: Movie[], sort: SortOption): Movie[] {
  switch (sort) {
    case "Highest Rated":
      return [...movies].sort((a, b) => b.rating - a.rating)
    case "Newest":
      return [...movies].sort((a, b) => b.year - a.year)
    case "Most Reviews":
      return [...movies].sort((a, b) => a.id - b.id)
    default:
      return [...movies].sort((a, b) => a.rank - b.rank)
  }
}

interface TikTokVideo {
  id: string
  title: string
  genre: string
  likes_count: number
  comments_count: number
}

function TopVideoRow({ video, index }: { video: TikTokVideo; index: number }) {
  return (
    <article className="flex items-center gap-4 rounded-xl bg-card border border-border p-4 hover:border-primary/50 transition-all">
      <span className="font-serif text-3xl font-bold text-muted-foreground/30 w-8 shrink-0 text-center leading-none">
        {index + 1}
      </span>
      <div className="relative h-16 w-11 rounded-md overflow-hidden shrink-0 bg-muted flex items-center justify-center">
        <Video className="h-5 w-5 text-muted-foreground/50" />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/films?q=${encodeURIComponent(video.title || "")}`}>
          <h3 className="font-semibold text-foreground text-sm truncate hover:text-primary transition-colors">
            {video.title || "Untitled"}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{video.genre || "-"}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
        <span className="text-primary text-sm font-bold">{video.likes_count || 0}</span>
      </div>
    </article>
  )
}

function MovieCard({ movie, onSelect }: { movie: Movie; onSelect: (m: Movie) => void }) {
  const [inList, setInList] = useState(false)

  return (
    <article
      className="group relative cursor-pointer rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onSelect(movie)}
            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            aria-label={`Watch ${movie.title}`}
          >
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground ml-0.5" />
          </button>
          <Link
            href={`/movies/${movie.id}`}
            className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            aria-label={`View details for ${movie.title}`}
          >
            <Star className="h-4 w-4 text-primary" />
          </Link>
        </div>
        {/* Rank */}
        <div className="absolute top-2 left-2 h-7 w-7 rounded-md bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-xs font-bold text-primary">#{movie.rank}</span>
        </div>
        {/* Hot badge */}
        {movie.hot && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5">
            <Flame className="h-3 w-3 text-primary-foreground" />
            <span className="text-[10px] font-bold text-primary-foreground">HOT</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <Link href={`/movies/${movie.id}`}>
          <h3 className="font-semibold text-foreground text-sm truncate leading-tight hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-primary text-xs font-bold">{movie.rating}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />{movie.year}
            </span>
            <button
              onClick={() => setInList(!inList)}
              className={cn(
                "h-6 w-6 rounded flex items-center justify-center transition-colors",
                inList
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"
              )}
              aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Plus className={cn("h-3.5 w-3.5 transition-transform", inList && "rotate-45")} />
            </button>
          </div>
        </div>
        <span className="mt-1.5 inline-block rounded text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5">
          {movie.genre}
        </span>
      </div>
    </article>
  )
}

function TopMovieRow({ movie, index, onSelect }: { movie: Movie; index: number; onSelect: (m: Movie) => void }) {
  return (
    <article className="flex items-center gap-4 rounded-xl bg-card border border-border p-4 hover:border-primary/50 transition-all">
      <span className="font-serif text-3xl font-bold text-muted-foreground/30 w-8 shrink-0 text-center leading-none">
        {index + 1}
      </span>
      <div className="relative h-16 w-11 rounded-md overflow-hidden shrink-0">
        <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/movies/${movie.id}`}>
          <h3 className="font-semibold text-foreground text-sm truncate hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{movie.genre}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{movie.year}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
        <span className="text-primary text-sm font-bold">{movie.rating}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="shrink-0 h-8 px-3 text-muted-foreground hover:text-foreground"
        onClick={() => onSelect(movie)}
      >
        <Play className="h-3.5 w-3.5" />
      </Button>
    </article>
  )
}

export default function TrendingPage() {
  const [activeGenre, setActiveGenre] = useState("All")
  const [activeSort, setActiveSort] = useState<SortOption>("Trending")
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [topRatedVideos, setTopRatedVideos] = useState<TikTokVideo[]>([])

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        if (data.videos) {
          const sorted = [...data.videos].sort(
            (a, b) => (b.likes_count || 0) - (a.likes_count || 0)
          )
          setTopRatedVideos(sorted.slice(0, 5))
        }
      })
      .catch((err) => console.error("Failed to fetch top rated:", err))
  }, [])

  const filtered = activeGenre === "All" ? MOVIES : MOVIES.filter((m) => m.genreList?.includes(activeGenre))
  const sorted = sortMovies(filtered, activeSort)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Page header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">This Week</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Trending Films
            </h1>
            <p className="text-muted-foreground mt-3 text-pretty max-w-lg">
              The most-watched and talked-about films right now — curated by our community and updated weekly.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main grid */}
            <div className="flex-1">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {/* Genre filter */}
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setActiveGenre(genre)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                        activeGenre === genre
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                {/* Sort */}
                <div className="flex items-center gap-2 shrink-0">
                  <SortAsc className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={activeSort}
                    onChange={(e) => setActiveSort(e.target.value as SortOption)}
                    className="bg-muted border border-border text-foreground text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results count */}
              <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                {sorted.length} film{sorted.length !== 1 ? "s" : ""} found
              </p>

              {sorted.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {sorted.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Film className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">No films in this genre yet.</p>
                  <button
                    onClick={() => setActiveGenre("All")}
                    className="mt-3 text-xs text-primary hover:underline"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar — Top 5 */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-lg font-bold text-foreground">Top Rated</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {topRatedVideos.length > 0 ? (
                    topRatedVideos.map((video, i) => (
                      <TopVideoRow key={video.id} video={video} index={i} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                      Loading top rated films...
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-8 rounded-xl bg-primary/10 border border-primary/20 p-5">
                  <h3 className="font-serif text-base font-bold text-foreground mb-1">Share Your Opinion</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Watched something great? Let the community know what you think.
                  </p>
                  <Link href="/reviews">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm">
                      Write a Review
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  )
}
