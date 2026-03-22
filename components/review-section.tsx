"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, ThumbsUp, MessageCircle, Share2, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      // toggle locally as fallback
      setLiked(!liked)
      setLikesCount((l) => (liked ? l - 1 : l + 1))
    }
  }

  return (
    <article className="rounded-xl bg-card border border-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0", getAvatarColor(review.user_id))}>
            {getInitials(review.user_name)}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{review.user_name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
          </div>
        </div>
        {review.video_genre && (
          <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0 uppercase">
            {review.video_genre}
          </span>
        )}
      </div>

      {/* Movie tag */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Review for</span>
        <span className="text-xs font-semibold text-primary">{review.video_title}</span>
      </div>

      {/* Content */}
      <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-border">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors",
            liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
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

export function ReviewSection() {
  const [reviews, setReviews] = useState<ReviewComment[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Community</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Latest Reviews</h2>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 rounded-xl bg-card border border-border">
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
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 flex flex-col gap-4">
              {reviews.slice(0, 6).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
