"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Save, Bell, MessageSquare, Heart, UserPlus, Calendar } from "lucide-react"
import { useState } from "react"
import BackButton from "@/components/back-button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NotificationPreferencesPage() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [birthdayNotifications, setBirthdayNotifications] = useState("day_of")
  const [notifications, setNotifications] = useState({
    newMessages: true,
    friendRequests: true,
    comments: true,
    likes: true,
    mentions: true,
    friendActivity: false,
    promotions: false,
    birthdays: true,
  })

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the backend
    alert("Notification preferences saved!")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton fallbackPath="/settings" className="inline-flex items-center text-forest-500">
            Back
          </BackButton>
          <h1 className="font-medium ml-4">Notification Preferences</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-forest-500" />
                  Notification Channels
                </h2>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch id="push-notifications" checked={pushEnabled} onCheckedChange={setPushEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-forest-500" />
                  Birthday Notifications
                </h2>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-forest-500" />
                    <Label htmlFor="birthday-notifications">Friend birthdays</Label>
                  </div>
                  <Switch
                    id="birthday-notifications"
                    checked={notifications.birthdays}
                    onCheckedChange={() => handleNotificationChange("birthdays")}
                  />
                </div>

                {notifications.birthdays && (
                  <div className="space-y-2 ml-8">
                    <Label htmlFor="birthday-timing">When to notify you</Label>
                    <Select value={birthdayNotifications} onValueChange={setBirthdayNotifications}>
                      <SelectTrigger id="birthday-timing">
                        <SelectValue placeholder="Select when to receive notifications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week_before">One week before</SelectItem>
                        <SelectItem value="day_before">One day before</SelectItem>
                        <SelectItem value="day_of">On the day</SelectItem>
                        <SelectItem value="all">All of the above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-lg font-medium">Other Notification Types</h2>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-3 text-forest-500" />
                    <Label htmlFor="new-messages">New messages</Label>
                  </div>
                  <Switch
                    id="new-messages"
                    checked={notifications.newMessages}
                    onCheckedChange={() => handleNotificationChange("newMessages")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-3 text-forest-500" />
                    <Label htmlFor="friend-requests">Friend requests</Label>
                  </div>
                  <Switch
                    id="friend-requests"
                    checked={notifications.friendRequests}
                    onCheckedChange={() => handleNotificationChange("friendRequests")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-3 text-forest-500" />
                    <Label htmlFor="comments">Comments on your posts</Label>
                  </div>
                  <Switch
                    id="comments"
                    checked={notifications.comments}
                    onCheckedChange={() => handleNotificationChange("comments")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-3 text-forest-500" />
                    <Label htmlFor="likes">Likes on your posts</Label>
                  </div>
                  <Switch
                    id="likes"
                    checked={notifications.likes}
                    onCheckedChange={() => handleNotificationChange("likes")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-3 text-forest-500" />
                    <Label htmlFor="mentions">Mentions and tags</Label>
                  </div>
                  <Switch
                    id="mentions"
                    checked={notifications.mentions}
                    onCheckedChange={() => handleNotificationChange("mentions")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-3 text-forest-500" />
                    <Label htmlFor="friend-activity">Friend activity</Label>
                  </div>
                  <Switch
                    id="friend-activity"
                    checked={notifications.friendActivity}
                    onCheckedChange={() => handleNotificationChange("friendActivity")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-3 text-forest-500" />
                    <Label htmlFor="promotions">Promotions and updates</Label>
                  </div>
                  <Switch
                    id="promotions"
                    checked={notifications.promotions}
                    onCheckedChange={() => handleNotificationChange("promotions")}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Preferences
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
