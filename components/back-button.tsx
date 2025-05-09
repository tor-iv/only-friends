"use client"

import type React from "react"

import { ArrowLeft } from "lucide-react"
import { useCallback } from "react"
import { useNavigationHistory } from "@/hooks/use-navigation-history"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  className?: string
  label?: string
  fallbackPath?: string
}

export default function BackButton({ className = "", label = "Back", fallbackPath = "/home" }: BackButtonProps) {
  const { goBack, getPreviousPath } = useNavigationHistory()
  const router = useRouter()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      try {
        // Try to use our custom back navigation
        goBack()
      } catch (error) {
        // If anything goes wrong, fall back to the fallback path
        console.error("Navigation error:", error)
        router.push(fallbackPath)
      }
    },
    [goBack, router, fallbackPath],
  )

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center text-forest-500 dark:text-cream-300 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="mr-2 h-5 w-5" />
      {label}
    </button>
  )
}
