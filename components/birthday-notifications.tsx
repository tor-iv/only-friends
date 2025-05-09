import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Friend {
  id: string
  name: string
  profilePicture: string
  birthday: Date
}

interface BirthdayNotificationsProps {
  todayBirthdays: Friend[]
  upcomingBirthdays: Friend[]
}

export default function BirthdayNotifications({ todayBirthdays, upcomingBirthdays }: BirthdayNotificationsProps) {
  if (todayBirthdays.length === 0 && upcomingBirthdays.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-3">
        <Calendar className="h-5 w-5 text-forest-500 mr-2" />
        <h3 className="font-medium">Birthdays</h3>
      </div>

      {todayBirthdays.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-forest-500 mb-2">Today</h4>
          <div className="space-y-3">
            {todayBirthdays.map((friend) => (
              <div key={friend.id} className="flex items-center">
                <Image
                  src={friend.profilePicture || "/placeholder.svg"}
                  alt={friend.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">Birthday today!</p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto">
                  Send Wishes
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingBirthdays.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-forest-500 mb-2">Upcoming</h4>
          <div className="space-y-3">
            {upcomingBirthdays.map((friend) => {
              const daysUntil = Math.ceil((friend.birthday.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              return (
                <div key={friend.id} className="flex items-center">
                  <Image
                    src={friend.profilePicture || "/placeholder.svg"}
                    alt={friend.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Birthday in {daysUntil} {daysUntil === 1 ? "day" : "days"}
                    </p>
                  </div>
                  <Link href={`/friend/${friend.id}`} className="ml-auto">
                    <Button size="sm" variant="ghost">
                      View Profile
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
