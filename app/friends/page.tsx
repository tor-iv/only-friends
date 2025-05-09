import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageSquare, Search, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"

// Mock data for friends
const mockFriends = [
  {
    id: 1,
    name: "Jamie Smith",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Taylor Brown",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Jordan Lee",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Casey Wilson",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    name: "Riley Garcia",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    name: "Morgan Davis",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 7,
    name: "Quinn Martinez",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 8,
    name: "Avery Robinson",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 9,
    name: "Drew Thompson",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 10,
    name: "Alex Johnson",
    profilePicture: "/placeholder.svg?height=60&width=60",
  },
]

export default function FriendsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <Link href="/profile" className="inline-flex items-center text-forest-500 dark:text-cream-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <h1 className="font-medium ml-4">Friends</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search friends" className="pl-10" />
          </div>

          <div className="space-y-4">
            {mockFriends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                <Link href={`/friend/${friend.id}`} className="flex items-center gap-3 flex-1">
                  {friend.profilePicture ? (
                    <Image
                      src={friend.profilePicture || "/placeholder.svg"}
                      alt={friend.name}
                      width={60}
                      height={60}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="font-medium">{friend.name}</div>
                </Link>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" asChild>
                    <Link href={`/messages/${friend.id}`}>
                      <MessageSquare className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
