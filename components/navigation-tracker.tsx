"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

// This component doesn't render anything, it just tracks navigation
export default function NavigationTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialRenderRef = useRef(true)
  const lastPathRef = useRef<string | null>(null)

  // Handle browser back/forward button and programmatic navigation
  useEffect(() => {
    if (typeof window === "undefined") return

    // Skip the initial render to avoid adding the first page twice
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      lastPathRef.current = pathname
      return
    }

    const HISTORY_KEY = "navigation_history"
    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

    // Skip if this is the same path as last time (prevents duplicates during re-renders)
    if (lastPathRef.current === fullPath) {
      return
    }

    // Update our reference to the current path
    lastPathRef.current = fullPath

    // Get current history
    const history = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]")

    // Check if we're navigating back (browser back button)
    const isBackNavigation = detectBackNavigation(history, fullPath)

    if (isBackNavigation) {
      // Find where in history this path exists
      const existingIndex = history.findIndex((entry) => entry.path === fullPath)

      if (existingIndex >= 0) {
        // Trim history to this point
        const newHistory = history.slice(0, existingIndex + 1)
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
        return
      }
    }

    // Don't add duplicate consecutive entries
    if (history.length > 0 && history[history.length - 1].path === fullPath) {
      return
    }

    // Add current path to history with timestamp and ID
    const newEntry = {
      path: fullPath,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(2, 9),
    }

    const newHistory = [...history, newEntry].slice(-30) // Keep last 30 entries
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  }, [pathname, searchParams])

  return null
}

// Helper function to detect if we're navigating back
function detectBackNavigation(history, currentPath) {
  if (history.length < 2) return false

  // Check if current path exists earlier in history
  for (let i = 0; i < history.length - 1; i++) {
    if (history[i].path === currentPath) {
      return true
    }
  }

  return false
}
