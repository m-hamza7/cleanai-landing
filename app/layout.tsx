import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "leaflet/dist/leaflet.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "CleanAI - AI-Powered Waste Management & Flood Prevention",
  description:
    "Revolutionary AI system for smart cities that detects waste, optimizes municipal response, and prevents urban flooding through intelligent automation.",
  generator: "CleanAI",
  icons: {
    icon: [
      {
        url: "/logo2.jpg",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "/logo2.jpg",
        type: "image/jpeg",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
