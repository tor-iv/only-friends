import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Users } from "lucide-react"

export default function PendingProgressPage() {
  // Mock data - in a real app, this would come from the user's profile
  const connectedFriends = 2
  const requiredFriends = 5
  const progress = (connectedFriends / requiredFriends) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 leaf-pattern">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-background border rounded-lg p-6 shadow-subtle">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-forest-100 dark:bg-forest-800 flex items-center justify-center">
                <Users className="w-10 h-10 text-forest-500 dark:text-forest-300" />
              </div>
            </div>

            <h1 className="font-serif text-2xl font-bold mb-2">You're almost there!</h1>

            <div className="flex justify-center items-center gap-1 mb-4">
              <span className="text-xl font-bold">{connectedFriends}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{requiredFriends} friends connected</span>
            </div>

            <Progress value={progress} className="h-2 mb-6" />

            <p className="text-muted-foreground mb-8">
              You need {requiredFriends - connectedFriends} more friends to unlock Only Friends
            </p>
          </div>

          <div className="space-y-4">
            <Button className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100" size="lg" asChild>
              <Link href="/invite-friends">Invite More Friends</Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/invite-friends?tab=pending">View Pending Invites</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
