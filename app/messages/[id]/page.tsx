"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { PlaneIcon as PaperPlaneIcon, Plus, ImageIcon, Smile } from "lucide-react"
import Link from "next/link"
import BackButton from "@/components/back-button"

// Mock conversation data
const mockConversations = {
  "1": {
    id: "1",
    user: {
      id: "u1",
      name: "Jamie Smith",
      profilePicture: "/diverse-group.png",
      online: true,
    },
    messages: [
      {
        id: "m1",
        text: "Hey! How's it going?",
        timestamp: "Yesterday 2:30 PM",
        sender: "u1",
        isRead: true,
      },
      {
        id: "m2",
        text: "I'm doing well, thanks for asking! Just wrapping up work. How about you?",
        timestamp: "Yesterday 2:35 PM",
        sender: "current-user",
        isRead: true,
      },
      {
        id: "m3",
        text: "Pretty good! Just planning my weekend. Are we still meeting tomorrow for coffee?",
        timestamp: "Yesterday 2:40 PM",
        sender: "u1",
        isRead: true,
      },
      {
        id: "m4",
        text: "Looking forward to it. Does 10am at the usual place still work?",
        timestamp: "Yesterday 2:45 PM",
        sender: "current-user",
        isRead: true,
      },
      {
        id: "m5",
        text: "Perfect! See you then 😊",
        timestamp: "Yesterday 2:50 PM",
        sender: "u1",
        isRead: false,
      },
    ],
  },
  "2": {
    id: "2",
    user: {
      id: "u2",
      name: "Taylor Brown",
      profilePicture: "/diverse-group.png",
      online: false,
    },
    messages: [
      {
        id: "m1",
        text: "Hello! I just saw the photos from the hike! Looks amazing.",
        timestamp: "1 hour ago",
        sender: "u2",
        isRead: true,
      },
    ],
  },
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const { id } = params
  const conversation = mockConversations[id]
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

  const handleSend = () => {
    if (!message.trim()) return

    // In a real app, this would send the message to the server
    // For now, just log it and clear the input
    console.log("Sending message:", message)
    setMessage("")
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Conversation not found</h1>
          <Button asChild>
            <Link href="/messages">Back to Messages</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton fallbackPath="/messages" />
            <div className="flex items-center gap-2">
              <Image
                src={conversation.user.profilePicture || "/placeholder.svg"}
                alt={conversation.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h1 className="font-medium">{conversation.user.name}</h1>
                <p className="text-xs text-gray-500">{conversation.user.online ? "Online" : "Offline"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto space-y-4">
          <div className="text-center text-xs text-gray-500 my-4">
            {conversation.messages[0].timestamp.split(" ")[0]}
          </div>

          {conversation.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "current-user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.sender === "current-user"
                    ? "bg-forest-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="mb-1">{msg.text}</p>
                <div
                  className={`text-xs ${
                    msg.sender === "current-user" ? "text-forest-200" : "text-gray-500"
                  } text-right flex items-center justify-end gap-1`}
                >
                  {msg.timestamp.split(" ").slice(1).join(" ")}
                  {msg.sender === "current-user" && <span className="text-xs">{msg.isRead ? "Read" : "Sent"}</span>}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 bg-white border-t p-3">
        <div className="w-full max-w-lg mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button variant="ghost" size="icon" className="shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-forest-500"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <PaperPlaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
