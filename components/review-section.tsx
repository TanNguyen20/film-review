"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageCircle, Share2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const reviews = [
  {
    id: 1,
    user: "Alex M.",
    avatar: "AM",
    avatarColor: "bg-primary/30 text-primary",
    movie: "Stellar Horizon",
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
    movie: "Neon Shadows",
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
    movie: "Ember Throne",
    rating: 10,
    date: "1 week ago",
    content:
      "I've never been so emotionally devastated and uplifted at the same time. Ember Throne transcends the fantasy genre entirely. The dragon sequences are practical-effects magic. My film of the decade. Period.",
    likes: 523,
    comments: 89,
    liked: true,
  },
]

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <button
          key={i}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${i} out of 10`}
        >
          <Star
            className={cn(
              "h-5 w-5 transition-colors",
              (hover || value) >= i ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  const [likes, setLikes] = useState(review.likes)
  const [liked, setLiked] = useState(review.liked)

  const handleLike = () => {
    setLiked(!liked)
    setLikes((l) => (liked ? l - 1 : l + 1))
  }

  return (
    <article className="rounded-xl bg-card border border-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0", review.avatarColor)}>
            {review.avatar}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{review.user}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 rounded-full bg-muted px-2 py-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-xs font-bold text-primary">{review.rating}/10</span>
        </div>
      </div>

      {/* Movie tag */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Review for</span>
        <span className="text-xs font-semibold text-primary">{review.movie}</span>
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

export function ReviewSection() {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() && rating > 0) {
      setSubmitted(true)
      setText("")
      setRating(0)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Community</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Latest Reviews</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Review list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Write a review */}
          <div className="rounded-xl bg-card border border-border p-6 h-fit sticky top-24">
            <h3 className="font-serif text-xl font-bold text-foreground mb-1">Write a Review</h3>
            <p className="text-sm text-muted-foreground mb-5">Share your opinion with the community</p>

            {submitted ? (
              <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-6 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2 fill-primary" />
                <p className="font-semibold text-foreground">Review submitted!</p>
                <p className="text-sm text-muted-foreground mt-1">Thanks for sharing your opinion.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Your Rating
                  </label>
                  <StarPicker value={rating} onChange={setRating} />
                  {rating > 0 && (
                    <p className="text-xs text-primary mt-1 font-medium">{rating}/10</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What did you think about the film..."
                    rows={5}
                    className="w-full rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition leading-relaxed"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!text.trim() || rating === 0}
                  className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-40 gap-2"
                >
                  <Send className="h-4 w-4" />
                  Post Review
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
