"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TrendingSection } from "@/components/trending-section"
import { ReviewSection } from "@/components/review-section"
import { CommunityStats } from "@/components/community-stats"
import { MovieModal } from "@/components/movie-modal"
import { Footer } from "@/components/footer"
import type { Movie } from "@/lib/movies"

export default function HomePage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <HeroSection />
        <TrendingSection onMovieSelect={setSelectedMovie} />
        <CommunityStats />
        <ReviewSection />
      </div>
      <Footer />
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  )
}
