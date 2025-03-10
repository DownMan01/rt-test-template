import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "Random Tweets Template",
    template: "%s | RandomTweets - An RT Template Website",
  },
  description: "Create and customize Random Tweets-Quotes",
    openGraph: {
    title: "Random Tweets Template",
    description: "A website with random tweets template.",
    url: "https://t.notedrop.xyz/",
    siteName: "Random Tweets",
    images: [
      {
        url: "https://t.notedrop.xyz/rt.png",
        width: 1200,
        height: 630,
        alt: "Random Tweets Template",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
