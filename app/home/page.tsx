import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bell } from "lucide-react"
import StoryRow from "@/components/story-row"
import PostCard from "@/components/post-card"
import BottomNavigation from "@/components/bottom-navigation"

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
      text: "My new home office setup is finally complete!",
      image: "/placeholder.svg?height=400&width=600",
    },
    commentCount: 8,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-forest-500">Only Friends</h1>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <StoryRow />

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
