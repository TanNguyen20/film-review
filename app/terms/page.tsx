import { Navbar } from "@/components/navbar"
import { Film, Mail, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — CineVault",
  description:
    "Read the Terms of Service for CineVault. Learn about your rights and responsibilities when using our movie review platform.",
}

const sections = [
  {
    id: "use-of-service",
    number: "1",
    title: "Use of the Service",
    content: [
      "Film Review allows users to discover movies, read reviews, write reviews, and share opinions about films.",
      "You agree to use the service only for lawful purposes and in a way that does not harm the platform or other users.",
    ],
  },
  {
    id: "user-content",
    number: "2",
    title: "User Content",
    content: [
      "Users may submit reviews, ratings, and comments.",
      "By submitting content you:",
    ],
    list: [
      "Confirm that the content is your own",
      "Grant Film Review permission to display and distribute your content on the platform",
      "Agree not to post illegal, harmful, or abusive content",
    ],
    footer:
      "Film Review reserves the right to remove any content that violates these rules.",
  },
  {
    id: "account-access",
    number: "3",
    title: "Account Access",
    content: [
      "Some features may require users to log in.",
      "If you connect your TikTok account, you authorize Film Review to access limited information required for login or content sharing.",
    ],
  },
  {
    id: "third-party-services",
    number: "4",
    title: "Third-Party Services",
    content: [
      "Film Review may integrate with third-party platforms such as TikTok for login or sharing features.",
      "These services operate under their own terms and policies.",
    ],
  },
  {
    id: "service-availability",
    number: "5",
    title: "Service Availability",
    content: [
      "We strive to keep the service available but cannot guarantee uninterrupted access.",
      "We may update, modify, or discontinue features at any time.",
    ],
  },
  {
    id: "limitation-of-liability",
    number: "6",
    title: "Limitation of Liability",
    content: ["Film Review is provided \"as is\". We are not responsible for:"],
    list: [
      "User-generated content",
      "External links",
      "Damages resulting from the use of the service",
    ],
  },
  {
    id: "changes-to-terms",
    number: "7",
    title: "Changes to Terms",
    content: [
      "We may update these Terms occasionally. Continued use of the service means you accept the updated Terms.",
    ],
  },
  {
    id: "contact",
    number: "8",
    title: "Contact",
    content: ["For questions regarding these Terms, contact:"],
    isContact: true,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="text-foreground">Terms of Service</span>
            </nav>

            <div className="flex items-start gap-4">
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance leading-tight">
                  Terms of Service
                </h1>
                <p className="mt-2 text-muted-foreground text-sm">
                  Last updated: <span className="text-foreground font-medium">March 2026</span>
                </p>
              </div>
            </div>

            <p className="mt-8 text-muted-foreground leading-relaxed max-w-2xl">
              Welcome to Film Review. By accessing or using our website or application, you agree to the following Terms of Service. Please read them carefully before using the platform.
            </p>
          </div>
        </section>

        {/* Table of Contents + Body */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* Sticky TOC */}
            <aside className="lg:w-56 shrink-0">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  On this page
                </p>
                <nav className="flex flex-col gap-0.5" aria-label="Table of contents">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    >
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-xs font-bold bg-muted text-muted-foreground">
                        {s.number}
                      </span>
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-10">
                {sections.map((s, i) => (
                  <article
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-24 pb-10 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                        {s.number}
                      </span>
                      <h2 className="font-serif text-xl font-bold text-foreground">
                        {s.title}
                      </h2>
                    </div>

                    <div className="flex flex-col gap-3 pl-10">
                      {s.content.map((para, pi) => (
                        <p key={pi} className="text-muted-foreground leading-relaxed">
                          {para}
                        </p>
                      ))}

                      {s.list && (
                        <ul className="flex flex-col gap-2 mt-1">
                          {s.list.map((item, li) => (
                            <li key={li} className="flex items-start gap-2.5 text-muted-foreground">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {s.footer && (
                        <p className="text-muted-foreground leading-relaxed mt-1">
                          {s.footer}
                        </p>
                      )}

                      {s.isContact && (
                        <a
                          href="mailto:tannguyen20.dev.com"
                          className="inline-flex items-center gap-2 mt-1 text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          <Mail className="h-4 w-4 shrink-0" />
                          tannguyen20.dev.com
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-12 rounded-lg border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By continuing to use CineVault, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the platform.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Back to Home
                  </Link>
                  <span className="text-border">·</span>
                  <Link
                    href="/privacy"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-border">·</span>
                  <a
                    href="mailto:tannguyen20.dev@gmail.com"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Film className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-serif text-base font-bold text-foreground">
              Cine<span className="text-primary">Vault</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} CineVault. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/terms" className="text-primary font-medium">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
