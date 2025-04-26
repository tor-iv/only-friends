"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Mock data for stories
const mockStories = [
  {
    id: "2",
    user: {
      id: 2,
      name: "Alex Johnson",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "2 hours ago",
    image: "/placeholder.svg?height=1067&width=600",
    text: "Amazing sunset view from the mountain top!",
  },
  {
    id: "3",
    user: {
      id: 3,
      name: "Jamie Smith",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "1 hour ago",
    image: "/placeholder.svg?height=1067&width=600",
    text: "Just finished this book. Highly recommend!",
  },
  {
    id: "4",
    user: {
      id: 4,
      name: "Taylor Brown",
      profilePicture: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "30 minutes ago",
    image: "/placeholder.svg?height=1067&width=600",
    text: "Coffee and coding day!",
  },
]

export default function StoryViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const storyId = params.id
  const storyIndex = mockStories.findIndex((story) => story.id === storyId)

  const [currentIndex, setCurrentIndex] = useState(storyIndex !== -1 ? storyIndex : 0)
  const [progress, setProgress] = useState(0)
  const [reply, setReply] = useState("")

  const currentStory = mockStories[currentIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 1)
      } else {
        // Move to next story
        if (currentIndex < mockStories.length - 1) {
          setCurrentIndex((prev) => prev + 1)
          setProgress(0)
        } else {
          // End of stories, go back to home
          router.push("/home")
        }
      }
    }, 50) // 5 seconds total duration (50ms * 100)

    return () => clearInterval(interval)
  }, [progress, currentIndex, router])

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setProgress(0)
    }
  }

  const handleNextStory = () => {
    if (currentIndex < mockStories.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setProgress(0)
    } else {
      router.push("/home")
    }
  }

  const handleSendReply = () => {
    if (reply.trim()) {
      // In a real app, you would send the reply to the server
      setReply("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="fixed top-0 left-0 right-0 z-20 p-4">
        <div className="flex gap-1 mb-4">
          {mockStories.map((_, index) => (
            <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              {index === currentIndex && (
                <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
              )}
              {index < currentIndex && <div className="h-full bg-white rounded-full w-full" />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <X className="h-6 w-6 text-white" />
            </Link>

            {currentStory.user.profilePicture ? (
              <Image
                src={currentStory.user.profilePicture || "/placeholder.svg"}
                alt={currentStory.user.name}
                width={40}
                height={40}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted" />
            )}

            <div>
              <div className="text-sm font-medium text-white">{currentStory.user.name}</div>
              <div className="text-xs text-white/70">{currentStory.timestamp}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Story content */}
        <div className="absolute inset-0">
          <Image src={currentStory.image || "/placeholder.svg"} alt="Story" fill className="object-cover" />

          {currentStory.text && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-white text-center text-xl font-medium drop-shadow-lg">{currentStory.text}</div>
            </div>
          )}
        </div>

        {/* Navigation overlays */}
        <button className="absolute top-0 left-0 w-1/3 h-full z-10" onClick={handlePrevStory} />
        <button className="absolute top-0 right-0 w-1/3 h-full z-10" onClick={handleNextStory} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Reply to story..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button size="icon" className="bg-forest-500 hover:bg-forest-600" onClick={handleSendReply}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
