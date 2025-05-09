"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Plus, Search, X } from "lucide-react"
import Image from "next/image"
import BackButton from "@/components/back-button"

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Jamie Smith",
      profilePicture: "/diverse-group.png",
      online: true,
    },
    lastMessage: {
      text: "Are we still meeting tomorrow for coffee?",
      timestamp: "2 min ago",
      isRead: false,
      sender: "u1",
    },
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Taylor Brown",
      profilePicture: "/diverse-group.png",
      online: false,
    },
    lastMessage: {
      text: "I just saw the photos from the hike! Looks amazing.",
      timestamp: "1 hour ago",
      isRead: true,
      sender: "u2",
    },
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Jordan Lee",
      profilePicture: "/diverse-group.png",
      online: true,
    },
    lastMessage: {
      text: "Thanks for the recommendation!",
      timestamp: "Yesterday",
      isRead: true,
      sender: "current-user",
    },
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Casey Wilson",
      profilePicture: "/diverse-group.png",
      online: false,
    },
    lastMessage: {
      text: "Let me know when you're free this weekend.",
      timestamp: "2 days ago",
      isRead: true,
      sender: "current-user",
    },
  },
  {
    id: "5",
    user: {
      id: "u5",
      name: "Alex Johnson",
      profilePicture: "/diverse-group.png",
      online: false,
    },
    lastMessage: {
      text: "Did you see that new restaurant downtown?",
      timestamp: "3 days ago",
      isRead: true,
      sender: "u5",
    },
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const filteredConversations = searchQuery
    ? mockConversations.filter(
        (conv) =>
          conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mockConversations

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto">
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery("")
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Input
                type="search"
                placeholder="Search messages..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BackButton fallbackPath="/home" />
                <h1 className="font-serif text-xl font-bold">Messages</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsSearching(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/messages/new">
                    <Plus className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto">
          {filteredConversations.length > 0 ? (
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="block py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Image
                        src={conversation.user.profilePicture || "/placeholder.svg"}
                        alt={conversation.user.name}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                      {conversation.user.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{conversation.user.name}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {conversation.lastMessage.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {conversation.lastMessage.sender === "current-user" && (
                          <span className="text-xs text-gray-500">You: </span>
                        )}
                        <p
                          className={`text-sm truncate ${conversation.lastMessage.isRead ? "text-gray-500" : "font-semibold"}`}
                        >
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                    </div>
                    {!conversation.lastMessage.isRead && conversation.lastMessage.sender !== "current-user" && (
                      <div className="h-2.5 w-2.5 bg-forest-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-10">
              <div className="mb-4 text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-2" />
              </div>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any messages matching "{searchQuery}"</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="mb-4 text-gray-400">
                <MessageEmptyIcon className="h-16 w-16 mx-auto mb-2" />
              </div>
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p className="text-gray-500 mb-4">Start a conversation with one of your friends</p>
              <Button className="bg-forest-500 hover:bg-forest-600 text-white" asChild>
                <Link href="/messages/new">New message</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Custom empty messages icon
function MessageEmptyIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8" />
      <path d="M8 13h6" />
    </svg>
  )
}
