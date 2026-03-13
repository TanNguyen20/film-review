import { Navbar } from "@/components/navbar"
import { ChevronRight, Mail, Shield } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy — FilmReview",
  description:
    "Read the Privacy Policy for FilmReview. Learn how we collect, use, and protect your personal information on our movie review platform.",
}

const sections = [
  {
    id: "information-we-collect",
    number: "1",
    title: "Information We Collect",
    content: ["We may collect the following information:"],
    subsections: [
      {
        heading: "Account Information",
        list: ["Username", "Email address (if provided)", "Login information from third-party services such as TikTok"],
      },
      {
        heading: "User Content",
        list: ["Movie reviews", "Ratings", "Comments"],
      },
      {
        heading: "Technical Information",
        list: ["Browser type", "Device information", "IP address", "Usage analytics"],
      },
    ],
  },
  {
    id: "how-we-use-information",
    number: "2",
    title: "How We Use Information",
    content: ["We use collected information to:"],
    list: [
      "Operate and maintain the platform",
      "Allow users to post and share movie reviews",
      "Improve service performance",
      "Enable sharing content to platforms like TikTok when users choose to do so",
    ],
    footer: "We do not sell personal data to third parties.",
  },
  {
    id: "tiktok-integration",
    number: "3",
    title: "TikTok Integration",
    content: ["If you connect your TikTok account:"],
    list: [
      "We only access the information necessary for authentication or sharing",
      "We do not post content without your permission",
      "TikTok data is used only for the features you authorize",
    ],
  },
  {
    id: "data-protection",
    number: "4",
    title: "Data Protection",
    content: [
      "We take reasonable security measures to protect your data from unauthorized access or disclosure.",
      "However, no internet service can guarantee complete security.",
    ],
  },
  {
    id: "data-retention",
    number: "5",
    title: "Data Retention",
    content: [
      "We retain user information only as long as necessary to provide our services.",
      "Users may request deletion of their data.",
    ],
  },
  {
    id: "childrens-privacy",
    number: "6",
    title: "Children's Privacy",
    content: [
      "Film Review is not intended for users under 13 years old.",
      "We do not knowingly collect personal information from children.",
    ],
  },
  {
    id: "updates-to-policy",
    number: "7",
    title: "Updates to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Updates will be posted on this page.",
    ],
  },
  {
    id: "contact",
    number: "8",
    title: "Contact",
    content: ["If you have questions about this Privacy Policy, please contact:"],
    isContact: true,
  },
]

export default function PrivacyPage() {
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
              <span className="text-foreground">Privacy Policy</span>
            </nav>

            <div className="flex items-start gap-4">
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance leading-tight">
                  Privacy Policy
                </h1>
                <p className="mt-2 text-muted-foreground text-sm">
                  Last updated: <span className="text-foreground font-medium">March 2026</span>
                </p>
              </div>
            </div>

            <p className="mt-8 text-muted-foreground leading-relaxed max-w-2xl">
              Film Review respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
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
                {sections.map((s) => (
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

                      {/* Flat list */}
                      {"list" in s && s.list && (
                        <ul className="flex flex-col gap-2 mt-1">
                          {s.list.map((item, li) => (
                            <li key={li} className="flex items-start gap-2.5 text-muted-foreground">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Nested subsections (e.g. section 1) */}
                      {"subsections" in s && s.subsections && (
                        <div className="flex flex-col gap-5 mt-2">
                          {s.subsections.map((sub, si) => (
                            <div key={si}>
                              <p className="text-sm font-semibold text-foreground mb-2">
                                {sub.heading}
                              </p>
                              <ul className="flex flex-col gap-2">
                                {sub.list.map((item, li) => (
                                  <li key={li} className="flex items-start gap-2.5 text-muted-foreground">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    <span className="leading-relaxed">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {"footer" in s && s.footer && (
                        <p className="text-muted-foreground leading-relaxed mt-1 italic border-l-2 border-primary/40 pl-3">
                          {s.footer}
                        </p>
                      )}

                      {s.isContact && (
                        <a
                          href="mailto:tannguyen20.dev@gmail.com"
                          className="inline-flex items-center gap-2 mt-1 text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          <Mail className="h-4 w-4 shrink-0" />
                          tannguyen20.dev@gmail.com
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-12 rounded-lg border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By using FilmReview, you acknowledge that you have read and understood this Privacy Policy. We are committed to protecting your privacy and handling your data with care and transparency.
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
                    href="/terms"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
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
              <Shield className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-serif text-base font-bold text-foreground">
              Film<span className="text-primary">Review</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} FilmReview. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-primary font-medium">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
