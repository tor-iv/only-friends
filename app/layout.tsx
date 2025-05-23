import type React from "react"
import type { Metadata } from "next"
import { Cabin, Lora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Only Friends",
  description: "Connect with your real friends",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cabin.variable} ${lora.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {/* NavigationTracker is conditionally rendered in client components that need it */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
