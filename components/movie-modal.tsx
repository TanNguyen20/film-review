"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, Play, Plus, Star, ThumbsUp, Share2, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  year: number
  poster: string
  rank: number
  hot: boolean
}

const DETAILS: Record<number, { director: string; cast: string[]; duration: string; synopsis: string }> = {
  1: { director: "Sofia Reyes", cast: ["Marcus Chen", "Ava Williams", "James Okoro"], duration: "2h 28m", synopsis: "A lone astronaut ventures beyond the known galaxy, discovering an ancient alien civilization that challenges humanity's origins and its destiny among the stars." },
  2: { director: "Luka Petrov", cast: ["Elena Voss", "David Park", "Carmen Santos"], duration: "1h 58m", synopsis: "In a rain-soaked city where secrets carry a fatal price, a detective unravels a conspiracy that reaches into the very halls of power — and points back to himself." },
  3: { director: "Aria Nakamura", cast: ["Thor Bjorn", "Isla Morgan", "Cass Adeyemi"], duration: "2h 45m", synopsis: "When an ancient dragon awakens to reclaim its stolen throne, a forgotten kingdom must choose between extinction and an impossible alliance with their greatest fear." },
  4: { director: "Leo Fontaine", cast: ["Nina Dupont", "Sam Reiter"], duration: "1h 52m", synopsis: "Two strangers meet on a Parisian rooftop under a sky full of possibility, beginning a romance that spans continents and decades." },
  5: { director: "Ray Castellano", cast: ["Jack Novak", "Zara Osei"], duration: "2h 10m", synopsis: "A master thief plans one last job in a city that never forgets. One mistake could bring the whole glass tower crashing down." },
  6: { director: "Miles Ashford", cast: ["Rosie Tran", "Owen Blake"], duration: "1h 44m", synopsis: "Something ancient lives in the hollow of the forest. Four friends about to find out why the townspeople never venture past the treeline after dark." },
  7: { director: "Priya Das", cast: ["Max Wild", "Bea Flores"], duration: "1h 32m", synopsis: "A young explorer discovers a magical map that leads deep into a jungle temple — and into a mystery that only a child could solve." },
  8: { director: "Victor Stahl", cast: ["Kane Okafor", "Elsa Novak"], duration: "2h 20m", synopsis: "At the edge of dawn, a platoon of soldiers face an impossible advance. A story of sacrifice, brotherhood, and the terrible cost of courage." },
}

export function MovieModal({ movie, onClose }: { movie: Movie | null; onClose: () => void }) {
  useEffect(() => {
    if (!movie) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [movie, onClose])

  if (!movie) return null

  const details = DETAILS[movie.id] ?? DETAILS[1]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${movie.title} details`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Hero image */}
        <div className="relative h-52 sm:h-64 shrink-0">
          <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-4">
            <h2 className="font-serif text-3xl font-bold text-foreground">{movie.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground">{movie.year}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{movie.genre}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 flex flex-col gap-5">
          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-bold text-primary">{movie.rating}</span>
              <span className="text-muted-foreground text-xs">/ 10</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              {details.duration}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              {movie.year}
            </div>
            {movie.hot && (
              <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/30 px-3 py-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Trending</span>
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Synopsis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{details.synopsis}</p>
          </div>

          {/* Crew */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Director</h3>
              <p className="text-sm text-foreground font-medium">{details.director}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Cast</h3>
              <p className="text-sm text-foreground">{details.cast.join(", ")}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Button className="flex-1 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 gap-2">
              <Play className="h-4 w-4 fill-primary-foreground" />
              Watch Now
            </Button>
            <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-muted">
              <Plus className="h-4 w-4" />
              Watchlist
            </Button>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <ThumbsUp className="h-4 w-4" />
              Like
            </Button>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
