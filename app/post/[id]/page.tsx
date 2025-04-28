import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, User, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for a post
const mockPost = {
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
  comments: [
    {
      id: 1,
      user: {
        id: 2,
        name: "Jamie Smith",
        profilePicture: "/placeholder.svg?height=32&width=32",
      },
      text: "Looks amazing! Which trail did you take?",
      timestamp: "1 hour ago",
    },
    {
      id: 2,
      user: {
        id: 1,
        name: "Alex Johnson",
        profilePicture: "/placeholder.svg?height=32&width=32",
      },
      text: "Thanks! I took the Sunrise Trail. It was challenging but worth it!",
      timestamp: "45 minutes ago",
    },
    {
      id: 3,
      user: {
        id: 3,
        name: "Taylor Brown",
        profilePicture: "/placeholder.svg?height=32&width=32",
      },
      text: "I've been wanting to go there! Let's plan a trip together sometime.",
      timestamp: "30 minutes ago",
    },
    {
      id: 4,
      user: {
        id: 4,
        name: "Jordan Lee",
        profilePicture: "/placeholder.svg?height=32&width=32",
      },
      text: "The colors in that sunset are unreal. Great shot!",
      timestamp: "15 minutes ago",
    },
    {
      id: 5,
      user: {
        id: 1,
        name: "Alex Johnson",
        profilePicture: "/placeholder.svg?height=32&width=32",
      },
      text: "Thanks everyone! @Taylor definitely, let's plan something for next month!",
      timestamp: "5 minutes ago",
    },
  ],
  isTemporary: true,
  expiresIn: "22 hours left",
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the post data based on the ID
  const postId = params.id

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <Link href="/home" className="inline-flex items-center text-forest-500">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <h1 className="font-medium ml-4">Post</h1>
        </div>
      </header>
      <main className="flex-1 p-4 pb-20">
        <div className="w-full max-w-lg mx-auto">
          <Card className={`overflow-hidden mb-4 ${mockPost.isTemporary ? "border-forest-200 border-2" : ""}`}>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {mockPost.user.profilePicture ? (
                    <Image
                      src={mockPost.user.profilePicture || "/placeholder.svg"}
                      alt={mockPost.user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{mockPost.user.name}</div>
                    <div className="text-xs text-muted-foreground">{mockPost.timestamp}</div>
                  </div>
                </div>

                {mockPost.isTemporary && mockPost.expiresIn && (
                  <div className="flex items-center text-xs text-forest-600 font-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    {mockPost.expiresIn}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {mockPost.content.image && (
                <Image
                  src={mockPost.content.image || "/placeholder.svg"}
                  alt="Post image"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              )}
              <div className="p-4">
                <p>{mockPost.content.text}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="font-medium">Comments</h2>

            <div className="space-y-4">
              {mockPost.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {comment.user.profilePicture ? (
                    <Image
                      src={comment.user.profilePicture || "/placeholder.svg"}
                      alt={comment.user.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="font-medium text-sm">{comment.user.name}</div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{comment.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="w-full max-w-lg mx-auto flex items-center gap-2">
          <Input placeholder="Add a comment..." className="flex-1" />
          <Button size="icon" className="bg-forest-500 hover:bg-forest-600">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="h-16"></div> {/* Spacer for the fixed comment input */}
    </div>
  )
}
