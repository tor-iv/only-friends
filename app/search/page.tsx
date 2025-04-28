"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"

// Mock data for users/friends - only showing existing friends since users can only add friends from contacts
const mockUsers = [
  {
    id: 1,
    name: "Jamie Smith",
    username: "jamie.smith",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Taylor Brown",
    username: "taylor.brown",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Jordan Lee",
    username: "jordan.lee",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    name: "Morgan Davis",
    username: "morgan.davis",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 8,
    name: "Avery Robinson",
    username: "avery.robinson",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(mockUsers)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Simulate search delay
    const timer = setTimeout(() => {
      const filteredResults = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filteredResults)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center gap-3">
          <Link href="/home" className="text-forest-500">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your friends..."
              className="pl-9 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto">
          {searchQuery.trim() === "" ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Search for your existing friends</p>
              <p className="text-sm mt-2">
                Remember, you can only add friends from your contacts.{" "}
                <Link href="/add-friends" className="text-forest-500 hover:underline">
                  Go to Invite Friends
                </Link>
              </p>
            </div>
          ) : isSearching ? (
            <div className="py-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-muted"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No friends found matching "{searchQuery}"</p>
              <p className="text-sm mt-2">
                To add new friends,{" "}
                <Link href="/add-friends" className="text-forest-500 hover:underline">
                  go to the Invite Friends page
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <Link key={user.id} href={`/friend/${user.id}`}>
                  <div className="flex items-center p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                    {user.profilePicture ? (
                      <Image
                        src={user.profilePicture || "/placeholder.svg"}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
