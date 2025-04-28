import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageSquare, User, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PostProps {
  post: {
    id: number
    user: {
      id: number
      name: string
      profilePicture: string
    }
    timestamp: string
    content: {
      text: string
      image: string
    }
    commentCount: number
    isTemporary: boolean
    expiresIn?: string
  }
}

export default function PostCard({ post }: PostProps) {
  return (
    <Card className={`overflow-hidden ${post.isTemporary ? "border-forest-200 border-2" : ""}`}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {post.user.profilePicture ? (
              <Image
                src={post.user.profilePicture || "/placeholder.svg"}
                alt={post.user.name}
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
              <div className="font-medium">{post.user.name}</div>
              <div className="text-xs text-muted-foreground">{post.timestamp}</div>
            </div>
          </div>

          {post.isTemporary && post.expiresIn && (
            <div className="flex items-center text-xs text-forest-600 font-medium">
              <Clock className="h-3 w-3 mr-1" />
              {post.expiresIn}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {post.content.image && (
          <Image
            src={post.content.image || "/placeholder.svg"}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto"
          />
        )}
        <div className="p-4">
          <p>{post.content.text}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/post/${post.id}`} className="text-sm text-muted-foreground">
          {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/post/${post.id}`}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Comment
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
