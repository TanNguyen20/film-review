import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'FilmReview — Watch, Review & Share',
  description: 'Discover trending films, write reviews, and share your opinions with a community of movie lovers.',
  generator: 'v0.app',
  keywords: ['movies', 'film reviews', 'trending films', 'movie ratings', 'cinema'],
  icons: {
    icon: [
      { url: '/favicon-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
