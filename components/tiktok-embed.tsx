"use client"

import { cn } from "@/lib/utils"

interface TikTokEmbedProps {
  videoId: string
  autoplay?: boolean
  musicInfo?: boolean
  description?: boolean
  controls?: boolean
  loop?: boolean
  className?: string
}

export function TikTokEmbed({
  videoId,
  autoplay = true,
  musicInfo = true,
  description = true,
  controls = true,
  loop = true,
  className,
}: TikTokEmbedProps) {
  const params = new URLSearchParams()
  if (autoplay) params.set("autoplay", "1")
  if (musicInfo) params.set("music_info", "1")
  if (description) params.set("description", "1")
  if (!controls) params.set("controls", "0")
  if (loop) params.set("loop", "1")

  const queryString = params.toString()
  const src = `https://www.tiktok.com/player/v1/${videoId}${queryString ? `?${queryString}` : ""}`

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-black",
        className
      )}
      style={{ aspectRatio: "9 / 16", maxHeight: "80vh" }}
    >
      <iframe
        src={src}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="TikTok Video Player"
      />
    </div>
  )
}
