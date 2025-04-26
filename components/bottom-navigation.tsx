"use client"

import { Home, Plus, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="sticky bottom-0 z-10 bg-background border-t">
      <div className="w-full max-w-lg mx-auto flex items-center justify-around">
        <Link
          href="/home"
          className={`flex flex-col items-center py-3 px-6 ${
            pathname === "/home" ? "text-forest-500" : "text-muted-foreground"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link href="/create-post" className="flex flex-col items-center py-3 px-6 text-muted-foreground">
          <div className="bg-forest-500 rounded-full p-2">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs mt-1">Create</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center py-3 px-6 ${
            pathname === "/profile" ? "text-forest-500" : "text-muted-foreground"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  )
}
