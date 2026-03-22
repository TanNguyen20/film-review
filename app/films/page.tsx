"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Film,
  Play,
  Clock,
  Shield,
  Filter,
  SortAsc,
  Loader2,
  Video,
  Upload,
  X,
  Search,
  RefreshCw,
  Trash2,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { TikTokEmbed } from "@/components/tiktok-embed"
import { UploadVideoModal } from "@/components/upload-video-modal"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

interface TikTokVideo {
  id: string
  user_id: string
  tiktok_publish_id: string
  tiktok_video_id: string
  tiktok_video_url: string
  title: string
  description: string
  genre: string
  privacy_level: string
  video_filename: string
  video_size: number
  status: string
  created_at: string
  updated_at: string
  likes_count: number
  comments_count: number
}

interface Comment {
  id: string
  user_id: string
  user_name: string
  content: string
  created_at: string
}

const GENRES = ["All", "Action", "Drama", "Sci-Fi", "Horror", "Comedy", "Fantasy", "Thriller", "Romance", "Documentary"]
const SORT_OPTIONS = ["Newest", "Oldest", "Title A-Z"] as const
type SortOption = (typeof SORT_OPTIONS)[number]

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

const privacyLabelMap: Record<string, string> = {
  PUBLIC_TO_EVERYONE: "Public",
  MUTUAL_FOLLOW_FRIENDS: "Friends",
  FOLLOWER_OF_CREATOR: "Followers",
  SELF_ONLY: "Only Me",
}

function VideoCard({
  video,
  onClick,
}: {
  video: TikTokVideo
  onClick: () => void
}) {
  return (
    <article
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[9/16] max-h-[280px] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-muted to-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
            <Video className="h-10 w-10" />
            <span className="text-xs font-medium">TikTok Review</span>
          </div>
        </div>
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground ml-0.5" />
          </div>
        </div>
        {/* Genre badge */}
        {video.genre && (
          <div className="absolute top-2 left-2 rounded-full bg-primary/90 px-2.5 py-0.5">
            <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-wider">
              {video.genre}
            </span>
          </div>
        )}
        {/* Status badge */}
        {video.status === "published" && (
          <div className="absolute top-2 right-2 rounded-full bg-emerald-500/90 px-2 py-0.5">
            <span className="text-[10px] font-bold text-white">LIVE</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm truncate leading-tight">
          {video.title || "Untitled Review"}
        </h3>
        {video.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-3 w-3" />
              <span className="text-xs">{video.likes_count || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              <span className="text-xs">{video.comments_count || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{formatDate(video.created_at)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function VideoEmbedModal({
  video,
  onClose,
  onDelete,
  currentUserId,
  onVideoUpdate,
}: {
  video: TikTokVideo
  onClose: () => void
  onDelete: (id: string) => Promise<void>
  currentUserId?: string
  onVideoUpdate: (id: string, updates: Partial<TikTokVideo>) => void
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(video.likes_count || 0)
  const [likingInProgress, setLikingInProgress] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [postingComment, setPostingComment] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  // Fetch like status
  useEffect(() => {
    fetch(`/api/videos/${video.id}/likes`)
      .then((r) => r.json())
      .then((data) => {
        setLiked(data.liked)
        setLikesCount(data.count)
      })
      .catch(() => {})
  }, [video.id])

  // Fetch comments
  useEffect(() => {
    setLoadingComments(true)
    fetch(`/api/videos/${video.id}/comments`)
      .then((r) => r.json())
      .then((data) => {
        setComments(data.comments || [])
      })
      .catch(() => {})
      .finally(() => setLoadingComments(false))
  }, [video.id])

  const hasVideoId = !!video.tiktok_video_id
  const isOwner = currentUserId && video.user_id === currentUserId

  const handleDelete = async () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    setDeleting(true)
    try {
      await onDelete(video.id)
    } catch {
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  const handleLike = async () => {
    if (!currentUserId || likingInProgress) return
    setLikingInProgress(true)
    try {
      const res = await fetch(`/api/videos/${video.id}/likes`, {
        method: "POST",
      })
      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
        setLikesCount(data.count)
        onVideoUpdate(video.id, { likes_count: data.count })
      }
    } catch {
      // silently fail
    } finally {
      setLikingInProgress(false)
    }
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !currentUserId || postingComment) return
    setPostingComment(true)
    try {
      const res = await fetch(`/api/videos/${video.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setComments((prev) => [data.comment, ...prev])
        setCommentText("")
        onVideoUpdate(video.id, {
          comments_count: (video.comments_count || 0) + 1,
        })
      }
    } catch {
      // silently fail
    } finally {
      setPostingComment(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Watch ${video.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-lg font-bold text-foreground truncate">
              {video.title || "Film Review"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              {video.genre && (
                <span className="text-xs text-primary font-semibold">
                  {video.genre}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(video.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-3">
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={cn(
                  "h-8 rounded-full flex items-center justify-center transition-colors gap-1.5 px-3",
                  confirmingDelete
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                )}
                aria-label="Delete video"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                {confirmingDelete && (
                  <span className="text-xs font-semibold">
                    {deleting ? "Deleting..." : "Confirm"}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Video Embed */}
          {hasVideoId ? (
            <TikTokEmbed
              videoId={video.tiktok_video_id}
              className="rounded-none"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
              <Video className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                This video doesn&apos;t have a TikTok video ID yet. It may still
                be processing on TikTok.
              </p>
              {video.tiktok_video_url && (
                <a
                  href={video.tiktok_video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  View on TikTok →
                </a>
              )}
            </div>
          )}

          {/* Description */}
          {video.description && (
            <div className="px-5 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {video.description}
              </p>
            </div>
          )}

          {/* Like bar */}
          <div className="px-5 py-3 border-t border-border flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={!currentUserId || likingInProgress}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                liked
                  ? "text-rose-500"
                  : "text-muted-foreground hover:text-rose-500",
                !currentUserId && "opacity-50 cursor-not-allowed"
              )}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                className={cn(
                  "h-4.5 w-4.5 transition-transform",
                  liked && "fill-rose-500 scale-110"
                )}
              />
              {likesCount}
            </button>
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MessageCircle className="h-4.5 w-4.5" />
              {comments.length}
            </div>
          </div>

          {/* Comments section */}
          <div className="border-t border-border">
            <div className="px-5 py-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Comments
              </h3>
            </div>

            {/* Comment input */}
            {currentUserId ? (
              <form
                onSubmit={handlePostComment}
                className="px-5 pb-3 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  maxLength={1000}
                  className="flex-1 h-9 bg-muted border border-border text-foreground text-sm rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || postingComment}
                  className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
                  aria-label="Post comment"
                >
                  {postingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            ) : (
              <p className="px-5 pb-3 text-xs text-muted-foreground">
                Sign in to leave a comment.
              </p>
            )}

            {/* Comments list */}
            <div className="px-5 pb-4 flex flex-col gap-3 max-h-60 overflow-y-auto">
              {loadingComments ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary uppercase">
                        {comment.user_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {comment.user_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilmsContent() {
  const searchParams = useSearchParams()
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState("All")
  const [activeSort, setActiveSort] = useState<SortOption>("Newest")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedVideo, setSelectedVideo] = useState<TikTokVideo | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    const q = searchParams.get("q")
    if (q !== null) {
      setSearchQuery(q)
    }
  }, [searchParams])

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/videos")
      const json = await res.json()
      if (json.videos) {
        setVideos(json.videos)
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleVideoUpdate = (id: string, updates: Partial<TikTokVideo>) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    )
    if (selectedVideo?.id === id) {
      setSelectedVideo((prev) => (prev ? { ...prev, ...updates } : prev))
    }
  }

  // Filter
  let filtered = videos
  if (activeGenre !== "All") {
    filtered = filtered.filter(
      (v) => v.genre?.toLowerCase() === activeGenre.toLowerCase()
    )
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (v) =>
        v.title?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q)
    )
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (activeSort) {
      case "Oldest":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      case "Title A-Z":
        return (a.title || "").localeCompare(b.title || "")
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }
  })

  return (
    <>
      <div className="pt-16">
        {/* Page header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-2">
              <Film className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Community Reviews
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Film Reviews
            </h1>
            <p className="text-muted-foreground mt-3 text-pretty max-w-lg">
              Watch TikTok video reviews from our community. Discover honest
              takes on the latest films, filter by genre, and share your own
              reviews.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
            <div className="flex items-center gap-3 shrink-0">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-44 bg-muted border border-border text-foreground text-xs rounded-lg pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                />
              </div>
              {/* Sort */}
              <div className="flex items-center gap-1.5">
                <SortAsc className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={activeSort}
                  onChange={(e) =>
                    setActiveSort(e.target.value as SortOption)
                  }
                  className="bg-muted border border-border text-foreground text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              {sorted.length} review{sorted.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchVideos}
                className="gap-1.5 border-border text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              {session?.user && (
                <Button
                  size="sm"
                  onClick={() => setUploadOpen(true)}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Review
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-24">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading film reviews...
              </p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 rounded-xl bg-card border border-border">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                <Film className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  No reviews found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {videos.length > 0
                    ? "Try adjusting your filters or search query."
                    : session?.user
                      ? "Be the first to upload a film review!"
                      : "Sign in with TikTok to upload film reviews."}
                </p>
              </div>
              {videos.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveGenre("All")
                    setSearchQuery("")
                  }}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Clear Filters
                </Button>
              )}
              {videos.length === 0 && session?.user && (
                <Button
                  onClick={() => setUploadOpen(true)}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Your First Review
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {sorted.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Embed modal */}
      {selectedVideo && (
        <VideoEmbedModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          currentUserId={session?.user?.id}
          onVideoUpdate={handleVideoUpdate}
          onDelete={async (id) => {
            const res = await fetch(`/api/videos/${id}`, { method: "DELETE" })
            if (!res.ok) {
              const data = await res.json()
              alert(data.error || "Failed to delete video")
              throw new Error(data.error)
            }
            setVideos((prev) => prev.filter((v) => v.id !== id))
            setSelectedVideo(null)
          }}
        />
      )}

      {/* Upload modal */}
      <UploadVideoModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={fetchVideos}
      />
    </>
  )
}

export default function FilmsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="pt-32 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading films...</p>
            </div>
          }
        >
          <FilmsContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
