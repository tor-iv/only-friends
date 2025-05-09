import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bell, MessageSquare, Search } from "lucide-react"
import PostCard from "@/components/post-card"
import BottomNavigation from "@/components/bottom-navigation"
import NearbyFriendsDropdown from "@/components/nearby-friends-dropdown"

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Alex Johnson",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "2 hours ago",
    content: {
      text: "Just finished hiking at the national park. The views were incredible!",
      image: "/placeholder.svg?height=400&width=600",
    },
    commentCount: 5,
    isTemporary: true,
    expiresIn: "22 hours left",
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Jamie Smith",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "Yesterday",
    content: {
      text: "Made this delicious pasta dish from scratch. Recipe in comments!",
      image: "/placeholder.svg?height=400&width=600",
    },
    commentCount: 12,
    isTemporary: false,
  },
  {
    id: 3,
    user: {
      id: 3,
      name: "Taylor Brown",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "2 days ago",
    content: {
      text: "Just had the most thought-provoking conversation about the future of technology and its impact on society. It's fascinating to consider how AI, blockchain, and other emerging technologies will reshape our world in the coming decades. What do you all think about the pace of technological change?",
      image: null,
    },
    commentCount: 8,
    isTemporary: false,
  },
  {
    id: 4,
    user: {
      id: 4,
      name: "Jordan Lee",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "5 hours ago",
    content: {
      text: "Coffee date with my bestie! ☕️",
      image: "/placeholder.svg?height=400&width=600",
    },
    commentCount: 3,
    isTemporary: true,
    expiresIn: "19 hours left",
  },
  {
    id: 5,
    user: {
      id: 5,
      name: "Casey Wilson",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "1 week ago",
    content: {
      text: "Finally got my dream car! Hard work pays off.",
      image: "/placeholder.svg?height=400&width=600",
    },
    commentCount: 24,
    isTemporary: false,
  },
  {
    id: 6,
    user: {
      id: 2,
      name: "Jamie Smith",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "3 hours ago",
    content: {
      text: "Sometimes the simplest moments are the most meaningful. Grateful for this beautiful day and the amazing people in my life.",
      image: null,
    },
    commentCount: 7,
    isTemporary: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-forest-500">Only Friends</h1>
          <div className="flex items-center gap-2">
            <NearbyFriendsDropdown />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
