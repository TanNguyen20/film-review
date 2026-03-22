"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Play,
  TrendingUp,
  Video,
  Clock,
  Loader2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TikTokEmbed } from "@/components/tiktok-embed"

interface TikTokVideo {
  id: string
  tiktok_video_id: string
  tiktok_video_url: string
  title: string
  description: string
  genre: string
  status: string
  created_at: string
}

const TABS = ["All", "Action", "Drama", "Sci-Fi", "Horror", "Comedy", "Fantasy", "Thriller"]

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

function VideoReviewCard({
  video,
  index,
  onWatch,
}: {
  video: TikTokVideo
  index: number
  onWatch: () => void
}) {
  return (
    <article
      className="group relative cursor-pointer rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
      onClick={onWatch}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[9/16] max-h-[280px] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-muted to-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
            <Video className="h-8 w-8" />
          </div>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground ml-0.5" />
          </div>
        </div>
        {/* Rank badge */}
        <div className="absolute top-2 left-2 h-7 w-7 rounded-md bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-xs font-bold text-primary">#{index + 1}</span>
        </div>
        {/* Genre badge */}
        {video.genre && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5">
            <span className="text-[10px] font-bold text-primary-foreground uppercase">
              {video.genre}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm truncate leading-tight">
          {video.title || "Untitled Review"}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{formatDate(video.created_at)}</span>
          </div>
          {video.status === "published" && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5">
              LIVE
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function WatchModal({
  video,
  onClose,
}: {
  video: TikTokVideo
  onClose: () => void
}) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Watch ${video.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-lg font-bold text-foreground truncate">
              {video.title || "Film Review"}
            </h2>
            {video.genre && (
              <span className="text-xs text-primary font-semibold">{video.genre}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 ml-3"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto">
          {video.tiktok_video_id ? (
            <TikTokEmbed videoId={video.tiktok_video_id} className="rounded-none" />
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
              <Video className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                This video is still processing on TikTok.
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
        </div>
      </div>
    </div>
  )
}

export function TrendingSection() {
  const [activeTab, setActiveTab] = useState("All")
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [watchVideo, setWatchVideo] = useState<TikTokVideo | null>(null)

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

  const filtered =
    activeTab === "All"
      ? videos
      : videos.filter((v) => v.genre?.toLowerCase() === activeTab.toLowerCase())

  return (
    <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              This Week
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Trending Film Reviews
          </h2>
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

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading trending reviews...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 rounded-xl bg-card border border-border">
          <Video className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm font-medium">
            {videos.length > 0
              ? "No reviews in this genre yet."
              : "No film reviews uploaded yet. Be the first!"}
          </p>
          {videos.length > 0 && (
            <button
              onClick={() => setActiveTab("All")}
              className="text-xs text-primary hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
          {filtered.map((video, index) => (
            <VideoReviewCard
              key={video.id}
              video={video}
              index={index}
              onWatch={() => setWatchVideo(video)}
            />
          ))}
        </div>
      )}

      {/* Watch modal */}
      {watchVideo && (
        <WatchModal video={watchVideo} onClose={() => setWatchVideo(null)} />
      )}
    </section>
  )
}
