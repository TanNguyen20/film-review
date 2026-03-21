"use client"

import { useState, useRef, useCallback } from "react"
import {
  Upload,
  X,
  Film,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileVideo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadVideoModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

type UploadState = "idle" | "loading-info" | "ready" | "uploading" | "success" | "error"

export function UploadVideoModal({ open, onClose, onSuccess }: UploadVideoModalProps) {
  const [state, setState] = useState<UploadState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [title, setTitle] = useState("")
  const [privacyLevel, setPrivacyLevel] = useState("SELF_ONLY")
  const [privacyOptions, setPrivacyOptions] = useState<string[]>(["SELF_ONLY"])
  const [disableComment, setDisableComment] = useState(false)
  const [disableDuet, setDisableDuet] = useState(false)
  const [disableStitch, setDisableStitch] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = useCallback(() => {
    setState("idle")
    setErrorMsg("")
    setTitle("")
    setPrivacyLevel("SELF_ONLY")
    setDisableComment(false)
    setDisableDuet(false)
    setDisableStitch(false)
    setSelectedFile(null)
    setUploadProgress(0)
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  const loadCreatorInfo = useCallback(async () => {
    setState("loading-info")
    setErrorMsg("")
    try {
      const res = await fetch("/api/tiktok/creator-info", { method: "POST" })
      const json = await res.json()
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to load creator info")
        setState("error")
        return
      }
      if (json.data?.privacy_level_options) {
        setPrivacyOptions(json.data.privacy_level_options)
        setPrivacyLevel(json.data.privacy_level_options[0] || "SELF_ONLY")
      }
      setState("ready")
    } catch {
      setErrorMsg("Network error. Please try again.")
      setState("error")
    }
  }, [])

  // Load creator info when modal opens in idle state
  const handleModalOpen = useCallback(() => {
    if (state === "idle") {
      loadCreatorInfo()
    }
  }, [state, loadCreatorInfo])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["video/mp4", "video/webm", "video/quicktime"]
      if (!validTypes.includes(file.type)) {
        setErrorMsg("Please select a valid video file (MP4, WebM, or MOV)")
        return
      }
      // Validate file size (4GB max)
      if (file.size > 4 * 1024 * 1024 * 1024) {
        setErrorMsg("Video must be under 4GB")
        return
      }
      setSelectedFile(file)
      setErrorMsg("")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) return

    setState("uploading")
    setUploadProgress(10)
    setErrorMsg("")

    try {
      const formData = new FormData()
      formData.append("video", selectedFile)
      formData.append("title", title.trim())
      formData.append("privacy_level", privacyLevel)
      formData.append("disable_comment", String(disableComment))
      formData.append("disable_duet", String(disableDuet))
      formData.append("disable_stitch", String(disableStitch))

      setUploadProgress(30)

      const res = await fetch("/api/tiktok/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(80)

      const json = await res.json()

      if (!res.ok) {
        setErrorMsg(json.error || "Upload failed")
        setState("error")
        return
      }

      setUploadProgress(100)
      setState("success")
      onSuccess?.()
    } catch {
      setErrorMsg("Network error during upload. Please try again.")
      setState("error")
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const privacyLabelMap: Record<string, string> = {
    PUBLIC_TO_EVERYONE: "Public",
    MUTUAL_FOLLOW_FRIENDS: "Friends",
    FOLLOWER_OF_CREATOR: "Followers",
    SELF_ONLY: "Only Me",
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upload video to TikTok"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
        ref={(el) => {
          if (el && state === "idle") handleModalOpen()
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-serif text-lg font-bold text-foreground">Upload to TikTok</h2>
          </div>
          <button
            onClick={handleClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Loading creator info */}
          {state === "loading-info" && (
            <div className="flex flex-col items-center gap-3 py-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading TikTok account info...</p>
            </div>
          )}

          {/* Success */}
          {state === "success" && (
            <div className="flex flex-col items-center gap-3 py-10">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="font-semibold text-foreground text-lg">Video Uploaded!</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Your video has been sent to TikTok for processing. It may take a few moments to appear on your profile.
              </p>
              <Button onClick={handleClose} className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Done
              </Button>
            </div>
          )}

          {/* Error */}
          {state === "error" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <p className="font-semibold text-foreground">Upload Failed</p>
              <p className="text-sm text-red-400 text-center max-w-xs">{errorMsg}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" onClick={handleClose} className="border-border text-foreground hover:bg-muted">
                  Cancel
                </Button>
                <Button onClick={() => { resetForm(); loadCreatorInfo() }} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Ready to upload form */}
          {(state === "ready" || state === "uploading") && (
            <div className="flex flex-col gap-5">
              {/* File picker */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Video File
                </label>
                {selectedFile ? (
                  <div className="flex items-center gap-3 rounded-lg bg-muted border border-border p-3">
                    <FileVideo className="h-8 w-8 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                      className="text-muted-foreground hover:text-foreground"
                      disabled={state === "uploading"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-border bg-muted/50 py-8 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-muted transition-colors"
                  >
                    <Film className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to select a video file
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      MP4, WebM, or MOV · Max 4GB
                    </p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Title / Caption
                </label>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Write a caption for your TikTok video... #hashtags @mentions"
                  rows={3}
                  maxLength={2200}
                  disabled={state === "uploading"}
                  className="w-full rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition leading-relaxed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground/60 mt-1 text-right">
                  {title.length}/2200
                </p>
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Privacy Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {privacyOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setPrivacyLevel(option)}
                      disabled={state === "uploading"}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                        privacyLevel === option
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {privacyLabelMap[option] || option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-3">
                <ToggleSwitch
                  label="Disable Comments"
                  checked={disableComment}
                  onChange={setDisableComment}
                  disabled={state === "uploading"}
                />
                <ToggleSwitch
                  label="Disable Duet"
                  checked={disableDuet}
                  onChange={setDisableDuet}
                  disabled={state === "uploading"}
                />
                <ToggleSwitch
                  label="Disable Stitch"
                  checked={disableStitch}
                  onChange={setDisableStitch}
                  disabled={state === "uploading"}
                />
              </div>

              {/* Error inline */}
              {errorMsg && (
                <p className="text-sm text-red-400">{errorMsg}</p>
              )}

              {/* Upload progress */}
              {state === "uploading" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Uploading to TikTok...</span>
                    <span className="text-primary font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !title.trim() || state === "uploading"}
                className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-40 gap-2"
              >
                {state === "uploading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload to TikTok
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 rounded-lg bg-muted border border-border px-3 py-2 cursor-pointer transition-colors",
        checked && "border-primary/40 bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors shrink-0",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
            checked && "translate-x-4"
          )}
        />
      </button>
      <span className="text-xs font-medium text-foreground whitespace-nowrap">{label}</span>
    </label>
  )
}
