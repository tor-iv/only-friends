"use client"

export function debugNavigationHistory() {
  if (typeof window === "undefined") return "Not available on server"

  const history = JSON.parse(localStorage.getItem("navigation_history") || "[]")
  console.log("Navigation History:", history)
  return history
}

export function clearNavigationHistory() {
  if (typeof window === "undefined") return "Not available on server"

  localStorage.setItem("navigation_history", JSON.stringify([]))
  console.log("Navigation History cleared")
  return "History cleared"
}
