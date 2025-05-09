"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin, Coffee, MessageSquare, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Mock data for nearby friends
interface NearbyFriend {
  id: string
  name: string
  profilePicture: string
  distance: string
  lastSeen: string
  isNew: boolean
}

export default function NearbyFriendsDropdown() {
  const [nearbyFriends, setNearbyFriends] = useState<NearbyFriend[]>([
    {
      id: "1",
      name: "Jamie Smith",
      profilePicture: "/diverse-group.png",
      distance: "0.5 miles away",
      lastSeen: "Just now",
      isNew: true,
    },
    {
      id: "2",
      name: "Taylor Brown",
      profilePicture: "/diverse-group.png",
      distance: "1.2 miles away",
      lastSeen: "10 minutes ago",
      isNew: true,
    },
    {
      id: "3",
      name: "Jordan Lee",
      profilePicture: "/diverse-group.png",
      distance: "0.8 miles away",
      lastSeen: "1 hour ago",
      isNew: false,
    },
  ])

  const [open, setOpen] = useState(false)
  const [hasNewNearbyFriends, setHasNewNearbyFriends] = useState(true)

  // In a real app, this would fetch nearby friends data
  useEffect(() => {
    // Check if there are any new nearby friends
    const newFriends = nearbyFriends.filter((friend) => friend.isNew)
    setHasNewNearbyFriends(newFriends.length > 0)
  }, [nearbyFriends])

  // Mark all friends as seen when opening the dropdown
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      // Mark all as seen
      setNearbyFriends((prev) =>
        prev.map((friend) => ({
          ...friend,
          isNew: false,
        })),
      )
      setHasNewNearbyFriends(false)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MapPin className="h-5 w-5" />
          {hasNewNearbyFriends && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-forest-500"></span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Nearby Friends</span>
          <Link href="/settings/location" className="text-xs text-forest-500 hover:underline">
            <Settings className="h-3 w-3 inline mr-1" />
            Settings
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {nearbyFriends.length > 0 ? (
            nearbyFriends.map((friend) => (
              <DropdownMenuItem key={friend.id} className="p-3 focus:bg-forest-50 cursor-default">
                <div className="flex items-start gap-3 w-full">
                  <Image
                    src={friend.profilePicture || "/placeholder.svg"}
                    alt={friend.name}
                    width={40}
                    height={40}
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
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                        <Link href={`/messages/${friend.id}`}>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Link>
                      </Button>
                      <Button size="sm" className="h-8 text-xs bg-forest-500 hover:bg-forest-600">
                        <Coffee className="h-3 w-3 mr-1" />
                        Meet Up
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center">
              <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No nearby friends</p>
              <p className="text-xs text-muted-foreground mt-1">
                We'll notify you when friends are nearby for a catch-up
              </p>
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="outline" size="sm" className="w-full text-xs" asChild>
            <Link href="/nearby-friends">View All Nearby Friends</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
