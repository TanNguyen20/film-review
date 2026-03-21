"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Video,
  Upload,
  Clock,
  Shield,
  Loader2,
  FileVideo,
  RefreshCw,
  Play,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UploadVideoModal } from "@/components/upload-video-modal"
import { TikTokEmbed } from "@/components/tiktok-embed"
import { authClient } from "@/lib/auth-client"

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
}

const privacyLabelMap: Record<string, string> = {
  PUBLIC_TO_EVERYONE: "Public",
  MUTUAL_FOLLOW_FRIENDS: "Friends",
  FOLLOWER_OF_CREATOR: "Followers",
  SELF_ONLY: "Only Me",
}

function formatFileSize(bytes: number): string {
  if (!bytes) return "—"
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
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

function VideoEmbedInline({
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
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-lg font-bold text-foreground truncate">
              {video.title || "Film Review"}
            </h2>
            {video.genre && (
              <span className="text-xs text-primary font-semibold">
                {video.genre}
              </span>
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
            <TikTokEmbed
              videoId={video.tiktok_video_id}
              className="rounded-none"
            />
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

function VideoCard({
  video,
  onWatch,
}: {
  video: TikTokVideo
  onWatch: () => void
}) {
  return (
    <article className="rounded-xl bg-card border border-border p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileVideo className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {video.title || "Untitled"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {video.video_filename || "Video"}
            </p>
          </div>
        </div>
        {video.genre && (
          <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 shrink-0 uppercase">
            {video.genre}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>{privacyLabelMap[video.privacy_level] || video.privacy_level}</span>
        </div>
        <span>·</span>
        <span>{formatFileSize(video.video_size)}</span>
        <span>·</span>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDate(video.created_at)}</span>
        </div>
      </div>

      {/* Description */}
      {video.description && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {video.description}
        </p>
      )}

      {/* Watch button */}
      <Button
        size="sm"
        onClick={onWatch}
        className="w-fit gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-1"
      >
        <Play className="h-3.5 w-3.5 fill-primary-foreground" />
        Watch Review
      </Button>
    </article>
  )
}

export function VideoSection() {
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [watchVideo, setWatchVideo] = useState<TikTokVideo | null>(null)
  const { data: session } = authClient.useSession()

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

  const handleUploadSuccess = () => {
    fetchVideos()
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Video className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                TikTok
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Video Reviews
            </h2>
          </div>
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
                Upload Video
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 rounded-xl bg-card border border-border">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">No videos yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                {session?.user
                  ? "Upload your first video to TikTok to get started."
                  : "Sign in with TikTok to upload videos."}
              </p>
            </div>
            {session?.user && (
              <Button
                onClick={() => setUploadOpen(true)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2"
              >
                <Upload className="h-4 w-4" />
                Upload Your First Video
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onWatch={() => setWatchVideo(video)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Watch modal */}
      {watchVideo && (
        <VideoEmbedInline
          video={watchVideo}
          onClose={() => setWatchVideo(null)}
        />
      )}

      {/* Upload modal */}
      <UploadVideoModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </section>
  )
}
