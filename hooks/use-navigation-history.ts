"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Use session storage instead of local storage to avoid persisting across browser sessions
const HISTORY_KEY = "navigation_history"
const MAX_HISTORY_LENGTH = 30

// Define a proper history entry type with timestamp for better tracking
interface HistoryEntry {
  path: string
  timestamp: number
  id: string // Unique ID to distinguish between visits to the same path
}

export function useNavigationHistory() {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)
  const processingBackNavigation = useRef(false)

  // Initialize history from storage when component mounts
  useEffect(() => {
    setIsReady(true)

    // Initialize history if it doesn't exist
    if (typeof window !== "undefined" && !sessionStorage.getItem(HISTORY_KEY)) {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify([]))
    }
  }, [])

  // Update history when pathname changes
  useEffect(() => {
    if (!isReady || typeof window === "undefined") return

    // Skip if we're currently processing a back navigation
    if (processingBackNavigation.current) {
      processingBackNavigation.current = false
      return
    }

    const history: HistoryEntry[] = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]")

    // Don't add duplicate consecutive entries (same path)
    if (history.length > 0 && history[history.length - 1].path === pathname) {
      return
    }

    // Create a new history entry with timestamp and unique ID
    const newEntry: HistoryEntry = {
      path: pathname,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(2, 9),
    }

    // Add current path to history
    const newHistory = [...history, newEntry].slice(-MAX_HISTORY_LENGTH)
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  }, [pathname, isReady])

  // Get the previous path or fallback to /home
  const getPreviousPath = (): string => {
    if (typeof window === "undefined") return "/home"

    const history: HistoryEntry[] = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]")

    // If we have at least 2 items in history, return the second-to-last item
    if (history.length >= 2) {
      return history[history.length - 2].path
    }

    // Fallback to /home
    return "/home"
  }

  // Navigate back to previous page or fallback
  const goBack = () => {
    if (typeof window === "undefined") {
      router.push("/home")
      return
    }

    const history: HistoryEntry[] = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]")

    if (history.length < 2) {
      // No history, go to home
      router.push("/home")
      return
    }

    // Remove current page from history
    const newHistory = history.slice(0, -1)
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))

    // Set flag to prevent adding the previous page back to history
    processingBackNavigation.current = true

    // Navigate to the previous page
    router.push(newHistory[newHistory.length - 1].path)
  }

  // Get the entire history for debugging
  const getHistory = (): HistoryEntry[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]")
  }

  // Clear the entire history
  const clearHistory = (): void => {
    if (typeof window === "undefined") return
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify([]))
  }

  return { goBack, getPreviousPath, getHistory, clearHistory }
}
