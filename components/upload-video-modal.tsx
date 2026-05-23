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
  ChevronDown,
  Info,
  Lock,
  Globe,
  Users,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadVideoModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

type UploadState = "idle" | "loading-info" | "ready" | "uploading" | "success" | "error"

const GENRE_OPTIONS = ["Action", "Drama", "Sci-Fi", "Horror", "Comedy", "Fantasy", "Thriller", "Romance", "Documentary"]

export function UploadVideoModal({ open, onClose, onSuccess }: UploadVideoModalProps) {
  const [state, setState] = useState<UploadState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")
  const [privacyLevel, setPrivacyLevel] = useState("SELF_ONLY")
  const [privacyOptions, setPrivacyOptions] = useState<string[]>(["SELF_ONLY"])
  const [disableComment, setDisableComment] = useState(false)
  const [disableDuet, setDisableDuet] = useState(false)
  const [disableStitch, setDisableStitch] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Creator Info
  const [creatorNickname, setCreatorNickname] = useState("")
  const [creatorAvatarUrl, setCreatorAvatarUrl] = useState("")
  const [creatorUsername, setCreatorUsername] = useState("")
  const [maxVideoDuration, setMaxVideoDuration] = useState(600)

  // Global Disables from account settings
  const [globalCommentDisabled, setGlobalCommentDisabled] = useState(false)
  const [globalDuetDisabled, setGlobalDuetDisabled] = useState(false)
  const [globalStitchDisabled, setGlobalStitchDisabled] = useState(false)

  // Commercial Content Disclosure (Point 3)
  const [commercialDisclosure, setCommercialDisclosure] = useState(false)
  const [disclosureType, setDisclosureType] = useState<"brand_organic" | "brand_content" | null>(null)

  // Explicit Music Usage Consent (Point 5)
  const [musicConsent, setMusicConsent] = useState(false)

  const resetForm = useCallback(() => {
    setState("idle")
    setErrorMsg("")
    setTitle("")
    setGenre("")
    setPrivacyLevel("SELF_ONLY")
    setDisableComment(false)
    setDisableDuet(false)
    setDisableStitch(false)
    setSelectedFile(null)
    setUploadProgress(0)
    setCommercialDisclosure(false)
    setDisclosureType(null)
    setMusicConsent(false)
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
      const data = json.data || {}
      if (data.privacy_level_options) {
        setPrivacyOptions(data.privacy_level_options)
        setPrivacyLevel(data.privacy_level_options[0] || "SELF_ONLY")
      }
      setCreatorNickname(data.creator_nickname || "")
      setCreatorAvatarUrl(data.creator_avatar_url || "")
      setCreatorUsername(data.creator_username || "")
      setMaxVideoDuration(data.max_video_post_duration_sec || 600)

      const commentDis = !!data.comment_disabled
      const duetDis = !!data.duet_disabled
      const stitchDis = !!data.stitch_disabled

      setGlobalCommentDisabled(commentDis)
      setGlobalDuetDisabled(duetDis)
      setGlobalStitchDisabled(stitchDis)

      // If globally disabled, make sure we reflect it in the form state
      if (commentDis) setDisableComment(true)
      if (duetDis) setDisableDuet(true)
      if (stitchDis) setDisableStitch(true)

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
      
      // Dynamic duration validation
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        if (video.duration > maxVideoDuration) {
          setErrorMsg(`Video duration (${Math.round(video.duration)}s) exceeds the maximum allowed duration of ${maxVideoDuration} seconds for your TikTok account.`)
          setSelectedFile(null)
          return
        }
        setSelectedFile(file)
        setErrorMsg("")
      }
      video.src = URL.createObjectURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title.trim() || !musicConsent) return
    if (commercialDisclosure && !disclosureType) {
      setErrorMsg("Please select whether the commercial content promotes your own brand or a third-party brand.")
      return
    }

    setState("uploading")
    setUploadProgress(10)
    setErrorMsg("")

    try {
      const formData = new FormData()
      formData.append("video", selectedFile)
      formData.append("title", title.trim())
      formData.append("genre", genre)
      formData.append("privacy_level", privacyLevel)
      formData.append("disable_comment", String(disableComment))
      formData.append("disable_duet", String(disableDuet))
      formData.append("disable_stitch", String(disableStitch))
      formData.append("brand_content_toggle", String(commercialDisclosure && disclosureType === "brand_content"))
      formData.append("brand_organic_toggle", String(commercialDisclosure && disclosureType === "brand_organic"))

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

  const isSelfOnlyDisabled = commercialDisclosure && disclosureType === "brand_content"

  const handleCommercialChange = (checked: boolean) => {
    setCommercialDisclosure(checked)
    if (!checked) {
      setDisclosureType(null)
    }
  }

  const handleDisclosureTypeChange = (type: "brand_organic" | "brand_content") => {
    setDisclosureType(type)
    if (type === "brand_content" && privacyLevel === "SELF_ONLY") {
      // Find a non-private option
      const nextOption = privacyOptions.find(opt => opt !== "SELF_ONLY") || "PUBLIC_TO_EVERYONE"
      setPrivacyLevel(nextOption)
    }
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
        className="relative z-10 w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
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
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
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
              <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
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
              {/* Creator Profile Info */}
              {creatorNickname && (
                <div className="flex items-center justify-between rounded-xl bg-muted/60 border border-border/80 p-4 transition-all duration-300 hover:bg-muted/80">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full border-2 border-primary/20 overflow-hidden bg-muted">
                      {creatorAvatarUrl ? (
                        <img
                          src={creatorAvatarUrl}
                          alt={creatorNickname}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold font-serif text-lg">
                          {creatorNickname.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        {creatorNickname}
                        <Check className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                      </h3>
                      <p className="text-xs text-muted-foreground">@{creatorUsername}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20">
                      TikTok Account Linked
                    </span>
                    <span className="text-[10px] text-muted-foreground/80">
                      Max Duration: {maxVideoDuration}s
                    </span>
                  </div>
                </div>
              )}

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
                    className="w-full rounded-lg border-2 border-dashed border-border bg-muted/50 py-8 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-muted transition-colors animate-in fade-in duration-300"
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

              {/* Genre */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Film Genre
                </label>
                <div className="relative">
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    disabled={state === "uploading"}
                    className="w-full appearance-none bg-muted border border-border text-foreground text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition disabled:opacity-50"
                  >
                    <option value="">Select a genre...</option>
                    {GENRE_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Point 3: Commercial Content Disclosure */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                      Commercial Content Disclosure
                    </label>
                    <p className="text-[10px] text-muted-foreground leading-normal pr-4">
                      Turn this on if you are posting content that promotes a brand, product, or service.
                    </p>
                  </div>
                  <button
                    role="switch"
                    type="button"
                    aria-checked={commercialDisclosure}
                    disabled={state === "uploading"}
                    onClick={() => handleCommercialChange(!commercialDisclosure)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors shrink-0",
                      commercialDisclosure ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                        commercialDisclosure && "translate-x-4"
                      )}
                    />
                  </button>
                </div>

                {commercialDisclosure && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label
                      className={cn(
                        "flex flex-col gap-1 p-3 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/30 transition-all",
                        disclosureType === "brand_organic" && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="disclosure_type"
                          checked={disclosureType === "brand_organic"}
                          onChange={() => handleDisclosureTypeChange("brand_organic")}
                          disabled={state === "uploading"}
                          className="text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-foreground">Your Brand</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground pl-5 leading-normal">
                        Promotes your own brand, business, product, or service.
                      </span>
                    </label>

                    <label
                      className={cn(
                        "flex flex-col gap-1 p-3 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/30 transition-all",
                        disclosureType === "brand_content" && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="disclosure_type"
                          checked={disclosureType === "brand_content"}
                          onChange={() => handleDisclosureTypeChange("brand_content")}
                          disabled={state === "uploading"}
                          className="text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-foreground">Branded Content</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground pl-5 leading-normal">
                        Promotes a third-party brand, business, product, or service in partnership.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Point 4: Privacy and Interaction Settings */}
              <div className="space-y-4 rounded-xl border border-border/80 bg-muted/30 p-4">
                {/* Privacy Level */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Privacy Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {privacyOptions.map((option) => {
                      const disabledOpt = option === "SELF_ONLY" && isSelfOnlyDisabled
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => !disabledOpt && setPrivacyLevel(option)}
                          disabled={state === "uploading" || disabledOpt}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border",
                            privacyLevel === option
                              ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                              : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                            disabledOpt && "opacity-40 cursor-not-allowed border-dashed bg-muted"
                          )}
                        >
                          {option === "PUBLIC_TO_EVERYONE" && <Globe className="h-3 w-3" />}
                          {option === "MUTUAL_FOLLOW_FRIENDS" && <Users className="h-3 w-3" />}
                          {option === "SELF_ONLY" && <Lock className="h-3 w-3" />}
                          {privacyLabelMap[option] || option}
                        </button>
                      )
                    })}
                  </div>
                  {isSelfOnlyDisabled && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-500 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Branded content visibility cannot be set to private.</span>
                    </div>
                  )}
                </div>

                {/* Interaction settings */}
                <div className="pt-3 border-t border-border/50">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">
                    Interaction Settings
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <ToggleSwitch
                      label="Allow Comments"
                      checked={!disableComment}
                      onChange={(checked) => setDisableComment(!checked)}
                      disabled={state === "uploading" || globalCommentDisabled}
                      infoText={globalCommentDisabled ? "Disabled by your TikTok" : undefined}
                    />
                    <ToggleSwitch
                      label="Allow Duet"
                      checked={!disableDuet}
                      onChange={(checked) => setDisableDuet(!checked)}
                      disabled={state === "uploading" || globalDuetDisabled}
                      infoText={globalDuetDisabled ? "Disabled by your TikTok" : undefined}
                    />
                    <ToggleSwitch
                      label="Allow Stitch"
                      checked={!disableStitch}
                      onChange={(checked) => setDisableStitch(!checked)}
                      disabled={state === "uploading" || globalStitchDisabled}
                      infoText={globalStitchDisabled ? "Disabled by your TikTok" : undefined}
                    />
                  </div>
                </div>
              </div>

              {/* Point 5: Explicit Consent & Process Notice */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={musicConsent}
                    onChange={(e) => setMusicConsent(e.target.checked)}
                    disabled={state === "uploading"}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 shrink-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground select-none leading-normal">
                      By posting, you agree to TikTok's Music Usage Confirmation.
                    </span>
                    <p className="text-[10px] text-muted-foreground leading-normal select-none">
                      Verify that you have all necessary rights or permissions to use the audio included in this video.
                    </p>
                  </div>
                </label>

                <div className="flex gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[11px] leading-relaxed">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Notice:</strong> After publishing, it may take a few minutes for the content to process and become visible on your TikTok profile.
                  </p>
                </div>
              </div>

              {/* Error inline */}
              {errorMsg && (
                <p className="text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMsg}
                </p>
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
                disabled={
                  !selectedFile ||
                  !title.trim() ||
                  !musicConsent ||
                  (commercialDisclosure && !disclosureType) ||
                  state === "uploading"
                }
                className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-40 gap-2 h-11 rounded-xl transition-all duration-300"
              >
                {state === "uploading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading to TikTok ({uploadProgress}%)
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Publish to TikTok
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
  infoText,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  infoText?: string
}) {
  return (
    <label
      className={cn(
        "flex flex-col gap-1 rounded-lg bg-card border border-border px-3 py-2 cursor-pointer transition-colors flex-1 min-w-[140px]",
        checked && !disabled && "border-primary/20 bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed bg-muted/35"
      )}
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <span className="text-xs font-semibold text-foreground whitespace-nowrap">{label}</span>
        <button
          role="switch"
          type="button"
          aria-checked={checked}
          onClick={() => !disabled && onChange(!checked)}
          disabled={disabled}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors shrink-0",
            checked && !disabled ? "bg-primary" : "bg-muted-foreground/30"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
              checked && !disabled && "translate-x-4"
            )}
          />
        </button>
      </div>
      {infoText && (
        <span className="text-[9px] text-amber-500 font-medium leading-normal">{infoText}</span>
      )}
    </label>
  )
}
