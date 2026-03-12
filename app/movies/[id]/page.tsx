"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Play,
  Plus,
  Share2,
  Star,
  Clock,
  Calendar,
  User,
  ChevronLeft,
  ThumbsUp,
  MessageCircle,
  Send,
  TrendingUp,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MOVIES, type Movie } from "@/lib/movies"
import { cn } from "@/lib/utils"

const MOVIE_REVIEWS: Record<number, { user: string; avatar: string; avatarColor: string; rating: number; date: string; content: string; likes: number; liked: boolean }[]> = {
  1: [
    { user: "Alex M.", avatar: "AM", avatarColor: "bg-primary/30 text-primary", rating: 9, date: "2 days ago", content: "An absolute masterpiece of modern science fiction. The world-building is breathtaking and the emotional core of the story hits you right in the chest. I haven't felt this way since Interstellar.", likes: 284, liked: false },
    { user: "Casey T.", avatar: "CT", avatarColor: "bg-sky-500/20 text-sky-400", rating: 10, date: "4 days ago", content: "Sofia Reyes has created something utterly unique. The film asks profound questions about identity and belonging without ever feeling heavy-handed. Easily the best sci-fi film in years.", likes: 152, liked: true },
  ],
  2: [
    { user: "Priya K.", avatar: "PK", avatarColor: "bg-rose-500/20 text-rose-400", rating: 8, date: "5 days ago", content: "Neon Shadows nails the neo-noir aesthetic perfectly. Every frame feels like a painting. The lead performance is magnetic — you can't look away.", likes: 196, liked: false },
  ],
  3: [
    { user: "Jordan T.", avatar: "JT", avatarColor: "bg-sky-500/20 text-sky-400", rating: 10, date: "1 week ago", content: "I've never been so emotionally devastated and uplifted at the same time. Ember Throne transcends the fantasy genre. My film of the decade. Period.", likes: 523, liked: true },
    { user: "Remi A.", avatar: "RA", avatarColor: "bg-amber-500/20 text-amber-400", rating: 9, date: "2 weeks ago", content: "The dragon sequences are breathtaking. Practical-effects magic. The score by Johann Osei is the best of the year.", likes: 211, liked: false },
  ],
}

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
              "h-4 w-4 transition-colors",
              (hover || value) >= i ? "fill-primary text-primary" : "text-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  )
}

function RelatedCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="group flex items-center gap-3 rounded-lg bg-muted/50 border border-border p-3 hover:border-primary/40 transition-all">
      <div className="relative h-14 w-10 rounded overflow-hidden shrink-0">
        <Image src={movie.poster} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{movie.title}</p>
        <p className="text-xs text-muted-foreground">{movie.genre} · {movie.year}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs font-bold text-primary">{movie.rating}</span>
        </div>
      </div>
    </Link>
  )
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const movie = MOVIES.find((m) => m.id === Number(id))

  if (!movie) notFound()

  const [inWatchlist, setInWatchlist] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const reviews = MOVIE_REVIEWS[movie.id] ?? []
  const related = MOVIES.filter((m) => m.id !== movie.id && (m.genre === movie.genre || m.genreList.some((g) => movie.genreList.includes(g)))).slice(0, 4)
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : movie.rating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewText.trim() || rating === 0) return
    setSubmitted(true)
    setReviewText("")
    setRating(0)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero backdrop */}
        <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-background/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

          {/* Back link */}
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
            <Link
              href="/trending"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Trending
            </Link>
          </div>

          {/* Movie title block */}
          <div className="absolute bottom-10 left-0 right-0 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {movie.badge && (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">{movie.badge}</span>
              </div>
            )}
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {movie.genreList.map((g) => (
                <span key={g} className="text-xs rounded-full bg-muted px-2.5 py-1 text-muted-foreground font-medium">{g}</span>
              ))}
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{movie.year}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{movie.duration}</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left — main content */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Actions + rating row */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-bold text-primary text-xl">{avgRating}</span>
                  <span className="text-muted-foreground text-sm">/ 10</span>
                </div>
                {movie.hot && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/30 px-4 py-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Trending</span>
                  </div>
                )}
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    className={cn(
                      "border-border gap-2 transition-colors",
                      inWatchlist
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setInWatchlist(!inWatchlist)}
                  >
                    <Plus className={cn("h-4 w-4 transition-transform", inWatchlist && "rotate-45")} />
                    {inWatchlist ? "In Watchlist" : "Watchlist"}
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2">
                    <Play className="h-4 w-4 fill-primary-foreground" />
                    Watch Now
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2 hidden sm:flex">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Synopsis */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Synopsis</h2>
                <p className="text-foreground leading-relaxed text-pretty">{movie.synopsis}</p>
              </section>

              {/* Crew */}
              <section className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-card border border-border p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Director
                  </h3>
                  <p className="font-semibold text-foreground">{movie.director}</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Cast
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed">{movie.cast.join(", ")}</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Runtime
                  </h3>
                  <p className="font-semibold text-foreground">{movie.duration}</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Release Year
                  </h3>
                  <p className="font-semibold text-foreground">{movie.year}</p>
                </div>
              </section>

              {/* Reviews */}
              <section id="reviews">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Reviews
                    {reviews.length > 0 && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">({reviews.length})</span>
                    )}
                  </h2>
                  <Link href="/reviews" className="text-xs text-primary hover:underline font-medium">
                    See all reviews
                  </Link>
                </div>

                {reviews.length === 0 ? (
                  <div className="rounded-xl bg-card border border-border p-8 text-center">
                    <MessageCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium text-sm">No reviews yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {reviews.map((r, i) => {
                      const [likes, setLikes] = useState(r.likes)
                      const [liked, setLiked] = useState(r.liked)
                      return (
                        <article key={i} className="rounded-xl bg-card border border-border p-5 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={cn("h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0", r.avatarColor)}>
                                {r.avatar}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground text-sm">{r.user}</p>
                                <p className="text-xs text-muted-foreground">{r.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 rounded-full bg-muted px-2.5 py-1">
                              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                              <span className="text-xs font-bold text-primary">{r.rating}/10</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{r.content}</p>
                          <div className="flex items-center gap-4 pt-2 border-t border-border">
                            <button
                              onClick={() => { setLiked(!liked); setLikes((l) => liked ? l - 1 : l + 1) }}
                              className={cn("flex items-center gap-1.5 text-xs font-medium transition-colors", liked ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                            >
                              <ThumbsUp className={cn("h-4 w-4", liked && "fill-primary")} />
                              {likes}
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}

                {/* Write review inline */}
                <div className="mt-6 rounded-xl bg-card border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-4">Add Your Review</h3>
                  {submitted ? (
                    <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-6 text-center">
                      <Star className="h-7 w-7 text-primary mx-auto mb-2 fill-primary" />
                      <p className="font-semibold text-foreground text-sm">Review submitted!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Rating</label>
                        <StarPicker value={rating} onChange={setRating} />
                        {rating > 0 && <p className="text-xs text-primary mt-1 font-medium">{rating}/10</p>}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder={`What did you think about ${movie.title}?`}
                        rows={4}
                        className="w-full rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition leading-relaxed"
                      />
                      <Button
                        type="submit"
                        disabled={!reviewText.trim() || rating === 0}
                        className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-40 gap-2 w-fit"
                      >
                        <Send className="h-4 w-4" />
                        Post Review
                      </Button>
                    </form>
                  )}
                </div>
              </section>
            </div>

            {/* Right sidebar */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-24 flex flex-col gap-6">
                {/* Poster */}
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border">
                  <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
                </div>

                {/* Related */}
                {related.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-3">You Might Also Like</h3>
                    <div className="flex flex-col gap-2">
                      {related.map((m) => <RelatedCard key={m.id} movie={m} />)}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
