"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MessageSquare, User, UserMinus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"
import BackButton from "@/components/back-button"

// Mock data for friend profile
const mockFriend = {
  id: 1,
  name: "Jamie Smith",
  profilePicture: "/placeholder.svg?height=120&width=120",
  bio: "Photographer, traveler, and coffee enthusiast. Always looking for the next adventure!",
  posts: [
    { id: 1, image: "/placeholder.svg?height=300&width=300" },
    { id: 2, image: "/placeholder.svg?height=300&width=300" },
    { id: 3, image: "/placeholder.svg?height=300&width=300" },
    { id: 4, image: "/placeholder.svg?height=300&width=300" },
  ],
}

export default function FriendDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the friend data based on the ID
  const friendId = params.id
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton />
          <h1 className="font-medium ml-4">Profile</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              {mockFriend.profilePicture ? (
                <Image
                  src={mockFriend.profilePicture || "/placeholder.svg"}
                  alt={mockFriend.name}
                  width={120}
                  height={120}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <h2 className="font-serif text-xl font-bold mb-1">{mockFriend.name}</h2>

            <p className="text-sm text-muted-foreground mb-4 max-w-xs">{mockFriend.bio}</p>

            <div className="flex gap-2">
              <Button className="bg-forest-500 hover:bg-forest-600 text-cream-100" asChild>
                <Link href={`/messages/${friendId}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Link>
              </Button>

              <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remove Friend
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {mockFriend.name} from your friends list? They will not be
                      notified, but you will no longer see their posts.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground"
                      onClick={() => {
                        // In a real app, you would call an API to remove the friend
                        setIsOpen(false)
                      }}
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Posts</h3>

            <div className="grid grid-cols-3 gap-1">
              {mockFriend.posts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <div className="aspect-square">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt="Post thumbnail"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
