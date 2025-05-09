"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"
import BackButton from "@/components/back-button"

// Mock data for user profiles
const mockProfiles = [
  {
    id: "1",
    name: "Jamie Smith",
    username: "jamiesmith",
    profilePicture: "/diverse-person-portrait.png",
    bio: "Photographer, traveler, and coffee enthusiast.",
  },
  {
    id: "2",
    name: "Alex Johnson",
    username: "alexj",
    profilePicture: "/diverse-group-conversation.png",
    bio: "Nature lover and hiking enthusiast.",
  },
  {
    id: "3",
    name: "Taylor Wilson",
    username: "taylorw",
    profilePicture: "/diverse-group-meeting.png",
    bio: "Digital artist and designer.",
  },
  {
    id: "4",
    name: "Jordan Lee",
    username: "jlee",
    profilePicture: "/diverse-group-meeting.png",
    bio: "Music producer and DJ.",
  },
  {
    id: "5",
    name: "Casey Morgan",
    username: "caseym",
    profilePicture: "/diverse-group-five.png",
    bio: "Fitness coach and nutrition expert.",
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(mockProfiles)
  const [isSearching, setIsSearching] = useState(false)

  // Filter profiles based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(mockProfiles)
      return
    }

    setIsSearching(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const filteredResults = mockProfiles.filter(
        (profile) =>
          profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.bio.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filteredResults)
      setIsSearching(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton />
          <h1 className="font-medium ml-4">Search</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for people..."
              className="pl-10 bg-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-4">
            {isSearching ? (
              <SearchSkeleton />
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-medium">People</h2>
                <div className="space-y-2">
                  {searchResults.map((profile) => (
                    <Link key={profile.id} href={`/friend/${profile.id}`}>
                      <div className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors">
                        {profile.profilePicture ? (
                          <Image
                            src={profile.profilePicture || "/placeholder.svg"}
                            alt={profile.name}
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
                          <h3 className="font-medium">{profile.name}</h3>
                          <p className="text-sm text-muted-foreground">@{profile.username}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-20 bg-muted rounded"></div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center p-3 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-muted"></div>
            <div className="ml-3 space-y-2">
              <div className="h-4 w-32 bg-muted rounded"></div>
              <div className="h-3 w-24 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
