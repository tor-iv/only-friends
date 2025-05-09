"use client"

import type React from "react"

import NavigationTracker from "@/components/navigation-tracker"

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationTracker />
      {children}
    </>
  )
}
