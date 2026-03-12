import Link from "next/link"
import { Film } from "lucide-react"

const links = {
  Explore: [
    { label: "Home", href: "/" },
    { label: "Trending Films", href: "/trending" },
    { label: "Reviews", href: "/reviews" },
    { label: "Watchlist", href: "/watchlist" },
  ],
  Community: [
    { label: "Write a Review", href: "/reviews" },
    { label: "Community Voices", href: "/reviews#community" },
    { label: "Top Rated", href: "/trending" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-10 justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <Film className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">
                Cine<span className="text-primary">Vault</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover trending films, write reviews, and share your opinions with a global community of movie lovers.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-10">
            {Object.entries(links).map(([group, items]) => (
              <div key={group}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{group}</h3>
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CineVault. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
