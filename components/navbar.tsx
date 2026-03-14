"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Search, Bell, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { TikTokLoginButton } from "./TikTokLoginButton"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trending", href: "/trending" },
  { label: "Reviews", href: "/reviews" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <Film className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground tracking-tight">
              Film<span className="text-primary">Review</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  placeholder="Search films..."
                  className="h-8 w-48 bg-muted border-border text-sm focus-visible:ring-primary"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            <button
              className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            </button>

            <div className="hidden sm:flex sm:mx-2"><TikTokLoginButton /></div>
            
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded text-left transition-colors",
                    active
                      ? "text-primary bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-4 pt-4 border-t border-border">
            <TikTokLoginButton />
          </div>
        </div>
      )}
    </header>
  )
}
