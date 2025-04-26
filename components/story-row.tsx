import { Plus, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for stories
const mockStories = [
  { id: 1, user: { name: "You", profilePicture: null }, viewed: false, isYou: true },
  { id: 2, user: { name: "Alex", profilePicture: "/placeholder.svg?height=60&width=60" }, viewed: false },
  { id: 3, user: { name: "Jamie", profilePicture: "/placeholder.svg?height=60&width=60" }, viewed: true },
  { id: 4, user: { name: "Taylor", profilePicture: "/placeholder.svg?height=60&width=60" }, viewed: false },
  { id: 5, user: { name: "Jordan", profilePicture: "/placeholder.svg?height=60&width=60" }, viewed: true },
  { id: 6, user: { name: "Casey", profilePicture: "/placeholder.svg?height=60&width=60" }, viewed: false },
]

export default function StoryRow() {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 py-2 px-1">
        {mockStories.map((story) => (
          <Link
            key={story.id}
            href={story.isYou ? "/create-story" : `/story/${story.id}`}
            className="flex flex-col items-center gap-1 w-16"
          >
            <div
              className={`relative w-14 h-14 rounded-full ${story.viewed ? "border-2 border-muted" : "border-2 border-forest-500"} p-0.5`}
            >
              {story.isYou ? (
                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                  <Plus className="w-6 h-6 text-forest-500" />
                </div>
              ) : story.user.profilePicture ? (
                <Image
                  src={story.user.profilePicture || "/placeholder.svg"}
                  alt={story.user.name}
                  width={60}
                  height={60}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <span className="text-xs truncate w-full text-center">{story.user.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
