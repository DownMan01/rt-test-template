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
   twitter: {
    card: "summary_large_image",
    title: "Random Tweets Template Website",
    description: "A website with random tweets template.",
    creator: "@weVibesMedia",
    images: ["https://t.notedrop.xyz/rt.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" href="/rt.png" />
          <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
          <link rel="icon" href="/icon-192x192.png" type="image/png" sizes="192x192" />
          <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
    </head>
      
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
