"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TrendingSection } from "@/components/trending-section"
import { ReviewSection } from "@/components/review-section"
import { CommunityStats } from "@/components/community-stats"
import { VideoSection } from "@/components/video-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <HeroSection />
        <TrendingSection />
        <CommunityStats />
        <VideoSection />
        <ReviewSection />
      </div>
      <Footer />
    </main>
  )
}

