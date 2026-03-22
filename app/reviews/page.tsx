"use client"

import { useState, useEffect, useCallback } from "react"
import {
  MessageCircle,
  ThumbsUp,
  Share2,
  Filter,
  Loader2,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

interface ReviewComment {
  id: string
  video_id: string
  user_id: string
  user_name: string
  content: string
  created_at: string
  video_title: string
  video_genre: string
  likes_count: number
  comments_count: number
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const avatarColors = [
  "bg-primary/30 text-primary",
  "bg-rose-500/20 text-rose-400",
  "bg-sky-500/20 text-sky-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-indigo-500/20 text-indigo-400",
]

function getAvatarColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function ReviewCard({ review }: { review: ReviewComment }) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(review.likes_count)

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/videos/${review.video_id}/likes`, {
        method: "POST",
      })
      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
        setLikesCount(data.count)
      }
    } catch {
      setLiked(!liked)
      setLikesCount((l) => (liked ? l - 1 : l + 1))
    }
  }

  return (
    <article className="rounded-xl bg-card border border-border p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
              getAvatarColor(review.user_id)
            )}
            aria-hidden="true"
          >
            {getInitials(review.user_name)}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{review.user_name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
          </div>
        </div>
        {review.video_genre && (
          <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2.5 py-1 shrink-0 uppercase tracking-wider">
            {review.video_genre}
          </span>
        )}
      </div>

      {/* Movie reference */}
      <div className="flex items-center gap-3 rounded-lg bg-muted/60 border border-border p-2.5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <MessageCircle className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">{review.video_title}</p>
          {review.video_genre && (
            <p className="text-[11px] text-muted-foreground">{review.video_genre}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors",
            liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={liked ? "Unlike review" : "Like review"}
        >
          <ThumbsUp className={cn("h-4 w-4", liked && "fill-primary")} />
          {likesCount}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="h-4 w-4" />
          {review.comments_count}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </article>
  )
}

const FILTER_OPTIONS = ["All Reviews", "Most Liked", "Recent"] as const
type FilterOption = (typeof FILTER_OPTIONS)[number]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewComment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All Reviews")
  const { data: session } = authClient.useSession()

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/comments")
      const json = await res.json()
      if (json.comments) {
        setReviews(json.comments)
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const sorted = [...reviews].sort((a, b) => {
    if (activeFilter === "Most Liked") return b.likes_count - a.likes_count
    if (activeFilter === "Recent")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-24">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading reviews...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 rounded-xl bg-card border border-border">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">No reviews yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {session?.user
                    ? "Be the first to leave a comment on a film review!"
                    : "Sign in to leave comments on film reviews."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sorted.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
