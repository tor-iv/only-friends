"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Coffee, MessageSquare, Search, X, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BackButton from "@/components/back-button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for nearby friends
interface NearbyFriend {
  id: string
  name: string
  profilePicture: string
  distance: string
  lastSeen: string
  isNew: boolean
  lastLocation?: string
}

export default function NearbyFriendsPage() {
  const [nearbyFriends, setNearbyFriends] = useState<NearbyFriend[]>([
    {
      id: "1",
      name: "Jamie Smith",
      profilePicture: "/diverse-group.png",
      distance: "0.5 miles away",
      lastSeen: "Just now",
      isNew: true,
      lastLocation: "Downtown Coffee Shop",
    },
    {
      id: "2",
      name: "Taylor Brown",
      profilePicture: "/diverse-group.png",
      distance: "1.2 miles away",
      lastSeen: "10 minutes ago",
      isNew: true,
      lastLocation: "Central Park",
    },
    {
      id: "3",
      name: "Jordan Lee",
      profilePicture: "/diverse-group.png",
      distance: "0.8 miles away",
      lastSeen: "1 hour ago",
      isNew: false,
      lastLocation: "Main Street Mall",
    },
    {
      id: "4",
      name: "Casey Wilson",
      profilePicture: "/diverse-group.png",
      distance: "1.5 miles away",
      lastSeen: "30 minutes ago",
      isNew: false,
    },
    {
      id: "5",
      name: "Alex Johnson",
      profilePicture: "/diverse-group.png",
      distance: "2.1 miles away",
      lastSeen: "2 hours ago",
      isNew: false,
    },
  ])

  const [recentlyNearbyFriends, setRecentlyNearbyFriends] = useState<NearbyFriend[]>([
    {
      id: "6",
      name: "Riley Garcia",
      profilePicture: "/diverse-group.png",
      distance: "5 miles away",
      lastSeen: "Yesterday",
      isNew: false,
      lastLocation: "City Library",
    },
    {
      id: "7",
      name: "Morgan Davis",
      profilePicture: "/diverse-group.png",
      distance: "8 miles away",
      lastSeen: "2 days ago",
      isNew: false,
      lastLocation: "University Campus",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Filter friends based on search query
  const filteredNearbyFriends = searchQuery
    ? nearbyFriends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : nearbyFriends

  const filteredRecentlyNearbyFriends = searchQuery
    ? recentlyNearbyFriends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : recentlyNearbyFriends

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto">
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery("")
                }}
              >
                <X className="h-5 w-5" />
              </Button>
              <Input
                type="search"
                placeholder="Search nearby friends..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BackButton fallbackPath="/home" />
                <h1 className="font-medium">Nearby Friends</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsSearching(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings/location">
                    <Settings className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto">
          <Tabs defaultValue="nearby" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="nearby">Currently Nearby</TabsTrigger>
              <TabsTrigger value="recently">Recently Nearby</TabsTrigger>
            </TabsList>
            <TabsContent value="nearby">
              {filteredNearbyFriends.length > 0 ? (
                <div className="space-y-4">
                  {filteredNearbyFriends.map((friend) => (
                    <div key={friend.id} className="bg-white rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <Image
                          src={friend.profilePicture || "/placeholder.svg"}
                          alt={friend.name}
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium flex items-center gap-2">
                              {friend.name}
                              {friend.isNew && <Badge className="bg-forest-500 text-xs">New</Badge>}
                            </div>
                            <span className="text-xs text-muted-foreground">{friend.lastSeen}</span>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {friend.distance}
                            {friend.lastLocation && ` • Near ${friend.lastLocation}`}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1" asChild>
                              <Link href={`/messages/${friend.id}`}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Link>
                            </Button>
                            <Button size="sm" className="flex-1 bg-forest-500 hover:bg-forest-600">
                              <Coffee className="h-4 w-4 mr-2" />
                              Meet Up
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No nearby friends</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? `No friends matching "${searchQuery}" are currently nearby`
                      : "None of your friends are currently nearby"}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="recently">
              {filteredRecentlyNearbyFriends.length > 0 ? (
                <div className="space-y-4">
                  {filteredRecentlyNearbyFriends.map((friend) => (
                    <div key={friend.id} className="bg-white rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <Image
                          src={friend.profilePicture || "/placeholder.svg"}
                          alt={friend.name}
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{friend.name}</div>
                            <span className="text-xs text-muted-foreground">{friend.lastSeen}</span>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {friend.distance}
                            {friend.lastLocation && ` • Last seen at ${friend.lastLocation}`}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1" asChild>
                              <Link href={`/messages/${friend.id}`}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recently nearby friends</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? `No friends matching "${searchQuery}" were recently nearby`
                      : "None of your friends were recently nearby"}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
