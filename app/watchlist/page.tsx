"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Bookmark,
  Clock,
  Film,
  Heart,
  Loader2,
  MessageCircle,
  Play,
  Trash2,
  Video,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { TikTokLoginButton } from "@/components/TikTokLoginButton"
import { cn } from "@/lib/utils"

interface WatchlistVideo {
  id: string
  user_id: string
  tiktok_video_id: string
  tiktok_video_url: string
  title: string
  description: string
  genre: string
  status: string
  created_at: string
  likes_count: number
  comments_count: number
  watchlisted_at: string
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

function WatchlistCard({
  video,
  onRemove,
  removing,
}: {
  video: WatchlistVideo
  onRemove: (id: string) => void
  removing: boolean
}) {
  const colors = [
    "from-blue-500/20 via-slate-900 to-blue-900/40",
    "from-purple-500/20 via-slate-900 to-purple-900/40",
    "from-emerald-500/20 via-slate-900 to-emerald-900/40",
    "from-rose-500/20 via-slate-900 to-rose-900/40",
    "from-amber-500/20 via-slate-900 to-amber-900/40",
  ]
  const colorIndex = video.id ? video.id.charCodeAt(0) % colors.length : 0
  const bgClass = colors[colorIndex]

  return (
    <article className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      {/* Thumbnail */}
      <div
        className={cn(
          "relative aspect-[9/16] max-h-[280px] w-full overflow-hidden bg-gradient-to-br",
          bgClass
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <Video className="h-10 w-10" />
            <span className="text-xs font-medium">TikTok Review</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            href={`/films?q=${encodeURIComponent(video.title || "")}`}
            className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl shadow-primary/30 hover:scale-110 transition-transform"
            aria-label={`Watch ${video.title}`}
          >
            <Play className="h-5 w-5 fill-primary-foreground text-primary-foreground ml-0.5" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault()
              onRemove(video.id)
            }}
            disabled={removing}
            className="h-10 w-10 rounded-full bg-destructive/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
            aria-label="Remove from watchlist"
          >
            {removing ? (
              <Loader2 className="h-4 w-4 text-destructive-foreground animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive-foreground" />
            )}
          </button>
        </div>

        {/* Genre badge */}
        {video.genre && (
          <div className="absolute top-2 left-2 rounded-full bg-primary/90 px-2.5 py-0.5">
            <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-wider">
              {video.genre}
            </span>
          </div>
        )}

        {/* Watchlist badge */}
        <div className="absolute top-2 right-2 rounded-full bg-amber-500/90 px-2 py-0.5 flex items-center gap-1">
          <Bookmark className="h-3 w-3 fill-white text-white" />
          <span className="text-[10px] font-bold text-white">SAVED</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <Link href={`/films?q=${encodeURIComponent(video.title || "")}`}>
          <h3 className="font-semibold text-foreground text-sm truncate leading-tight hover:text-primary transition-colors">
            {video.title || "Untitled Review"}
          </h3>
        </Link>
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
            <span className="text-xs">{formatDate(video.watchlisted_at)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function WatchlistPage() {
  const [videos, setVideos] = useState<WatchlistVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { data: session, isPending } = authClient.useSession()

  const fetchWatchlist = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/watchlist")
      if (!res.ok) return
      const json = await res.json()
      if (json.videos) {
        setVideos(json.videos)
      }
    } catch (err) {
      console.error("Failed to fetch watchlist:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchWatchlist()
    } else if (!isPending) {
      setLoading(false)
    }
  }, [session, isPending, fetchWatchlist])

  const handleRemove = async (videoId: string) => {
    setRemovingId(videoId)
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      })
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== videoId))
      }
    } catch (err) {
      console.error("Failed to remove from watchlist:", err)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        {/* Page header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Your Collection
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground text-balance">
              My Watchlist
            </h1>
            <p className="text-muted-foreground mt-3 text-pretty max-w-lg">
              Films you&apos;ve saved to watch later. Never lose track of a
              review you want to come back to.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {isPending || loading ? (
            <div className="flex flex-col items-center gap-3 py-24">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading your watchlist...
              </p>
            </div>
          ) : !session?.user ? (
            /* Not logged in */
            <div className="flex flex-col items-center gap-5 py-24 rounded-xl bg-card border border-border">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">
                  Sign in to view your watchlist
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Log in with TikTok to save and manage your watchlist.
                </p>
              </div>
              <TikTokLoginButton />
            </div>
          ) : videos.length === 0 ? (
            /* Empty watchlist */
            <div className="flex flex-col items-center gap-5 py-24 rounded-xl bg-card border border-border">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                <Film className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">
                  Your watchlist is empty
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Browse trending films and save the ones you want to watch
                  later.
                </p>
              </div>
              <Link href="/trending">
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  <Film className="h-4 w-4" />
                  Browse Trending Films
                </Button>
              </Link>
            </div>
          ) : (
            /* Watchlist grid */
            <>
              <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5" />
                {videos.length} film{videos.length !== 1 ? "s" : ""} saved
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {videos.map((video) => (
                  <WatchlistCard
                    key={video.id}
                    video={video}
                    onRemove={handleRemove}
                    removing={removingId === video.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
