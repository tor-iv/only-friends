import { Button } from "@/components/ui/button"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "comment",
    user: {
      id: 2,
      name: "Jamie Smith",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    content: "commented on your post",
    timestamp: "2 minutes ago",
    read: false,
    link: "/post/1",
  },
  {
    id: 2,
    type: "friend_request",
    user: {
      id: 3,
      name: "Taylor Brown",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    content: "accepted your friend request",
    timestamp: "1 hour ago",
    read: false,
    link: "/profile/3",
  },
  {
    id: 3,
    type: "story",
    user: {
      id: 4,
      name: "Jordan Lee",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    content: "added a new story",
    timestamp: "3 hours ago",
    read: true,
    link: "/story/4",
  },
  {
    id: 4,
    type: "system",
    content: "Welcome to Only Friends! Complete your profile to get started.",
    timestamp: "1 day ago",
    read: true,
    link: "/profile",
  },
]

export default function NotificationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/home" className="inline-flex items-center text-forest-500 dark:text-cream-300">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Link>
            <h1 className="font-medium ml-4">Notifications</h1>
          </div>
          <Button variant="ghost" size="sm">
            Clear All
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-4">
          {mockNotifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.link}
              className={`block p-4 border rounded-lg ${notification.read ? "" : "bg-forest-50 dark:bg-forest-900/20"}`}
            >
              <div className="flex gap-3">
                {"user" in notification ? (
                  notification.user.profilePicture ? (
                    <Image
                      src={notification.user.profilePicture || "/placeholder.svg"}
                      alt={notification.user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )
                ) : (
                  <div className="w-10 h-10 rounded-full bg-forest-100 dark:bg-forest-800 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-forest-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex-1">
                  <div className="font-medium">{"user" in notification ? notification.user.name : "Only Friends"}</div>
                  <div className="text-sm text-muted-foreground">{notification.content}</div>
                  <div className="text-xs text-muted-foreground mt-1">{notification.timestamp}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
