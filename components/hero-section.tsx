"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Plus, Star, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const featured = [
  {
    id: 1,
    title: "Stellar Horizon",
    genre: "Sci-Fi · Adventure",
    year: 2025,
    rating: 9.1,
    votes: "142K",
    description:
      "A lone astronaut ventures beyond the known galaxy, only to discover an ancient alien civilization that challenges everything humanity believed about its origins.",
    poster: "/images/movie-1.jpg",
    badge: "Editor's Pick",
  },
  {
    id: 2,
    title: "Neon Shadows",
    genre: "Thriller · Noir",
    year: 2025,
    rating: 8.7,
    votes: "98K",
    description:
      "In a rain-soaked city where every secret has a price, a detective unravels a conspiracy that reaches into the very halls of power — and points back to himself.",
    poster: "/images/movie-2.jpg",
    badge: "Trending",
  },
  {
    id: 3,
    title: "Ember Throne",
    genre: "Fantasy · Epic",
    year: 2024,
    rating: 8.9,
    votes: "215K",
    description:
      "When an ancient dragon awakens to reclaim its stolen throne, a forgotten kingdom must choose between extinction and an impossible alliance.",
    poster: "/images/movie-3.jpg",
    badge: "Fan Favorite",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating / 2 >= i
        const half = !filled && rating / 2 >= i - 0.5
        return (
          <Star
            key={i}
            className={cn("h-4 w-4", filled || half ? "fill-primary text-primary" : "text-muted-foreground")}
          />
        )
      })}
      <span className="text-primary font-bold ml-1">{rating}</span>
      <span className="text-muted-foreground text-sm">/ 10</span>
    </div>
  )
}

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const film = featured[current]

  const prev = () => setCurrent((c) => (c - 1 + featured.length) % featured.length)
  const next = () => setCurrent((c) => (c + 1) % featured.length)

  return (
    <section className="relative h-[90vh] min-h-[560px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {featured.map((f, i) => (
          <Image
            key={f.id}
            src={f.poster}
            alt={f.title}
            fill
            className={cn(
              "object-cover transition-opacity duration-700",
              i === current ? "opacity-100" : "opacity-0"
            )}
            priority={i === 0}
          />
        ))}
        {/* Overlays */}
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">{film.badge}</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground leading-tight text-balance mb-2">
            {film.title}
          </h1>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-muted-foreground">{film.year}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{film.genre}</span>
          </div>

          <StarRating rating={film.rating} />
          <p className="text-xs text-muted-foreground mt-1 mb-4">{film.votes} ratings</p>

          <p className="text-muted-foreground leading-relaxed text-pretty mb-6 text-sm sm:text-base">
            {film.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2">
              <Play className="h-4 w-4 fill-primary-foreground" />
              Watch Now
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted gap-2">
              <Plus className="h-4 w-4" />
              Watchlist
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2">
              <Info className="h-4 w-4" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/60 border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        aria-label="Previous film"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/60 border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        aria-label="Next film"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
