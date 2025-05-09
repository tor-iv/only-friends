"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Search, X } from "lucide-react"
import BackButton from "@/components/back-button"

// Mock data for friends
const mockFriends = [
  {
    id: "u1",
    name: "Jamie Smith",
    profilePicture: "/diverse-group.png",
    lastSeen: "Online",
  },
  {
    id: "u2",
    name: "Taylor Brown",
    profilePicture: "/diverse-group.png",
    lastSeen: "Last seen 2h ago",
  },
  {
    id: "u3",
    name: "Jordan Lee",
    profilePicture: "/diverse-group.png",
    lastSeen: "Online",
  },
  {
    id: "u4",
    name: "Casey Wilson",
    profilePicture: "/diverse-group.png",
    lastSeen: "Last seen yesterday",
  },
  {
    id: "u5",
    name: "Alex Johnson",
    profilePicture: "/diverse-group.png",
    lastSeen: "Last seen 3d ago",
  },
  {
    id: "u6",
    name: "Riley Martinez",
    profilePicture: "/diverse-group.png",
    lastSeen: "Online",
  },
  {
    id: "u7",
    name: "Morgan Zhang",
    profilePicture: "/diverse-group.png",
    lastSeen: "Last seen 1h ago",
  },
  {
    id: "u8",
    name: "Sam Rodriguez",
    profilePicture: "/diverse-group.png",
    lastSeen: "Last seen 5d ago",
  },
]

export default function NewMessagePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFriends = searchQuery
    ? mockFriends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockFriends

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <BackButton fallbackPath="/messages" />
            <h1 className="font-serif text-xl font-bold">New Message</h1>
          </div>
        </div>
      </header>

      <div className="p-4 border-b">
        <div className="w-full max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search friends..."
              className="pl-9 pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="w-full max-w-lg mx-auto">
          {filteredFriends.length > 0 ? (
            <div className="divide-y">
              {filteredFriends.map((friend) => (
                <Button key={friend.id} variant="ghost" className="w-full justify-start py-4 px-4 h-auto" asChild>
                  <a href={`/messages/${friend.id}`} className="flex items-center gap-3">
                    <Image
                      src={friend.profilePicture || "/placeholder.svg"}
                      alt={friend.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-left">{friend.name}</h3>
                      <p className="text-xs text-gray-500 text-left">{friend.lastSeen}</p>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="mb-4 text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-2" />
              </div>
              <h3 className="text-lg font-medium mb-2">No friends found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any friends matching "{searchQuery}"</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
