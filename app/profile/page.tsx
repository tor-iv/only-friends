import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, User, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"

// Mock data for user profile
const mockProfile = {
  name: "Alex Johnson",
  profilePicture: "/placeholder.svg?height=120&width=120",
  bio: "Nature lover, hiker, and amateur photographer. Always seeking new adventures!",
  friendsCount: 12,
  posts: [
    { id: 1, image: "/placeholder.svg?height=300&width=300" },
    { id: 2, image: "/placeholder.svg?height=300&width=300" },
    { id: 3, image: "/placeholder.svg?height=300&width=300" },
    { id: 4, image: "/placeholder.svg?height=300&width=300" },
    { id: 5, image: "/placeholder.svg?height=300&width=300" },
    { id: 6, image: "/placeholder.svg?height=300&width=300" },
  ],
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-forest-500">Profile</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              {mockProfile.profilePicture ? (
                <Image
                  src={mockProfile.profilePicture || "/placeholder.svg"}
                  alt={mockProfile.name}
                  width={120}
                  height={120}
                  className="w-24 h-24 rounded-full object-cover border-2 border-forest-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-forest-500">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <h2 className="font-serif text-xl font-bold mb-1">{mockProfile.name}</h2>

            <p className="text-sm text-muted-foreground mb-4 max-w-xs">{mockProfile.bio}</p>

            <Link href="/friends" className="text-sm font-medium text-forest-500">
              {mockProfile.friendsCount} Friends
            </Link>
          </div>

          <Tabs defaultValue="posts">
            <TabsList className="w-full">
              <TabsTrigger value="posts" className="flex-1">
                Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-4">
              <div className="grid grid-cols-3 gap-1">
                {mockProfile.posts.map((post) => (
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
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
