"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MessageCircle,
  Star,
  ThumbsUp,
  Share2,
  Send,
  Filter,
  ChevronDown,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MOVIES } from "@/lib/movies"
import { cn } from "@/lib/utils"

const INITIAL_REVIEWS = [
  {
    id: 1,
    user: "Alex M.",
    avatar: "AM",
    avatarColor: "bg-primary/30 text-primary",
    movieId: 1,
    rating: 9,
    date: "2 days ago",
    content:
      "An absolute masterpiece of modern science fiction. The world-building is breathtaking and the emotional core of the story hits you right in the chest. I haven't felt this way since Interstellar. The cinematography alone deserves every award this season.",
    likes: 284,
    comments: 47,
    liked: false,
  },
  {
    id: 2,
    user: "Priya K.",
    avatar: "PK",
    avatarColor: "bg-rose-500/20 text-rose-400",
    movieId: 2,
    rating: 8,
    date: "5 days ago",
    content:
      "Neon Shadows nails the neo-noir aesthetic perfectly. Every frame feels like a painting. The lead performance is magnetic — you can't look away. The third act loses a bit of steam, but the ride there is absolutely exhilarating.",
    likes: 196,
    comments: 31,
    liked: false,
  },
  {
    id: 3,
    user: "Jordan T.",
    avatar: "JT",
    avatarColor: "bg-sky-500/20 text-sky-400",
    movieId: 3,
    rating: 10,
    date: "1 week ago",
    content:
      "I've never been so emotionally devastated and uplifted at the same time. Ember Throne transcends the fantasy genre entirely. The dragon sequences are practical-effects magic. My film of the decade. Period.",
    likes: 523,
    comments: 89,
    liked: true,
  },
  {
    id: 4,
    user: "Sam R.",
    avatar: "SR",
    avatarColor: "bg-emerald-500/20 text-emerald-400",
    movieId: 5,
    rating: 8,
    date: "3 days ago",
    content:
      "Glass City is a sleek, stylish heist thriller that keeps you guessing until the last frame. The set pieces are inventive and the chemistry between the leads is electric. Not quite a classic, but an excellent ride.",
    likes: 142,
    comments: 22,
    liked: false,
  },
  {
    id: 5,
    user: "Mei L.",
    avatar: "ML",
    avatarColor: "bg-amber-500/20 text-amber-400",
    movieId: 8,
    rating: 9,
    date: "6 days ago",
    content:
      "Dawn's Edge doesn't glorify war — it humanizes it. Every soldier feels real. The final battle sequence is one of the most harrowing things I have ever seen on screen. A film that needs to be seen and remembered.",
    likes: 319,
    comments: 54,
    liked: false,
  },
  {
    id: 6,
    user: "Theo W.",
    avatar: "TW",
    avatarColor: "bg-indigo-500/20 text-indigo-400",
    movieId: 4,
    rating: 7,
    date: "2 weeks ago",
    content:
      "City of Lights is lovely, if a little conventional. The Paris cinematography is stunning and the two leads have real chemistry. It's a film that asks nothing of you and delivers a perfectly pleasant experience — which isn't always a bad thing.",
    likes: 98,
    comments: 15,
    liked: false,
  },
]

type ReviewData = (typeof INITIAL_REVIEWS)[0]

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5" role="group" aria-label="Rating picker">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${i} out of 10`}
        >
          <Star
            className={cn(
              "h-5 w-5 transition-colors",
              (hover || value) >= i ? "fill-primary text-primary" : "text-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review, movie }: { review: ReviewData; movie: ReturnType<typeof MOVIES.find> }) {
  const [likes, setLikes] = useState(review.likes)
  const [liked, setLiked] = useState(review.liked)

  return (
    <article className="rounded-xl bg-card border border-border p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
              review.avatarColor
            )}
            aria-hidden="true"
          >
            {review.avatar}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{review.user}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 rounded-full bg-muted px-2.5 py-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-xs font-bold text-primary">{review.rating}/10</span>
        </div>
      </div>

      {/* Movie reference */}
      {movie && (
        <Link
          href={`/movies/${movie.id}`}
          className="flex items-center gap-3 rounded-lg bg-muted/60 border border-border p-2 hover:border-primary/40 transition-colors"
        >
          <div className="relative h-10 w-7 rounded overflow-hidden shrink-0">
            <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{movie.title}</p>
            <p className="text-[11px] text-muted-foreground">{movie.genre} · {movie.year}</p>
          </div>
        </Link>
      )}

      {/* Content */}
      <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button
          onClick={() => { setLiked(!liked); setLikes((l) => (liked ? l - 1 : l + 1)) }}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors",
            liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={liked ? "Unlike review" : "Like review"}
        >
          <ThumbsUp className={cn("h-4 w-4", liked && "fill-primary")} />
          {likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="h-4 w-4" />
          {review.comments}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </article>
  )
}

function WriteReviewPanel() {
  const [rating, setRating] = useState(0)
  const [selectedMovieId, setSelectedMovieId] = useState<number | "">("")
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || rating === 0 || selectedMovieId === "") return
    setSubmitted(true)
    setText("")
    setRating(0)
    setSelectedMovieId("")
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div id="write-review" className="rounded-xl bg-card border border-border p-6 sticky top-24">
      <h2 className="font-serif text-xl font-bold text-foreground mb-1">Write a Review</h2>
      <p className="text-sm text-muted-foreground mb-5">Share your opinion with the community</p>

      {submitted ? (
        <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-8 text-center">
          <Star className="h-8 w-8 text-primary mx-auto mb-2 fill-primary" />
          <p className="font-semibold text-foreground">Review submitted!</p>
          <p className="text-sm text-muted-foreground mt-1">Thanks for sharing your opinion.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Movie select */}
          <div>
            <label htmlFor="movie-select" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Select a Film
            </label>
            <div className="relative">
              <select
                id="movie-select"
                value={selectedMovieId}
                onChange={(e) => setSelectedMovieId(Number(e.target.value) || "")}
                className="w-full appearance-none bg-muted border border-border text-foreground text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                <option value="">Choose a film...</option>
                {MOVIES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.year})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Your Rating
            </label>
            <StarPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <p className="text-xs text-primary mt-1 font-medium">{rating}/10</p>
            )}
          </div>

          {/* Text */}
          <div>
            <label htmlFor="review-text" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Your Review
            </label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you think about the film..."
              rows={5}
              className="w-full rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition leading-relaxed"
            />
          </div>

          <Button
            type="submit"
            disabled={!text.trim() || rating === 0 || selectedMovieId === ""}
            className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-40 gap-2"
          >
            <Send className="h-4 w-4" />
            Post Review
          </Button>
        </form>
      )}
    </div>
  )
}

const FILTER_OPTIONS = ["All Reviews", "Highest Rated", "Most Liked", "Recent"] as const
type FilterOption = (typeof FILTER_OPTIONS)[number]

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All Reviews")

  const sorted = [...INITIAL_REVIEWS].sort((a, b) => {
    if (activeFilter === "Highest Rated") return b.rating - a.rating
    if (activeFilter === "Most Liked") return b.likes - a.likes
    return 0
  })

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Page header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Community</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Reviews &amp; Opinions
            </h1>
            <p className="text-muted-foreground mt-3 text-pretty max-w-lg">
              Honest takes from real movie lovers. Read what the community thinks, or share your own review.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Review list */}
            <div className="flex-1">
              {/* Filter bar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setActiveFilter(opt)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                        activeFilter === opt
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Filter className="h-3.5 w-3.5" />
                  {sorted.length} reviews
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {sorted.map((review) => {
                  const movie = MOVIES.find((m) => m.id === review.movieId)
                  return <ReviewCard key={review.id} review={review} movie={movie} />
                })}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 shrink-0">
              <WriteReviewPanel />
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
