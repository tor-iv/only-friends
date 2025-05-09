"use client"

import { useSearchParams } from "next/navigation"

export default function NavigationTrackerInner() {
  // This component can safely use useSearchParams because it's wrapped in Suspense
  const searchParams = useSearchParams()

  // Store search params in session storage if needed
  if (typeof window !== "undefined" && searchParams.toString()) {
    const PARAMS_KEY = "last_search_params"
    sessionStorage.setItem(PARAMS_KEY, searchParams.toString())
  }

  return null
}
