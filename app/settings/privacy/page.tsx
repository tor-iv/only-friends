"use client"

import Link from "next/link"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Save, UserPlus, Eye, Lock, Shield } from "lucide-react"
import { useState } from "react"
import BackButton from "@/components/back-button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PrivacySettingsPage() {
  const [profileVisibility, setProfileVisibility] = useState("friends")
  const [postVisibility, setPostVisibility] = useState("friends")
  const [friendRequests, setFriendRequests] = useState("everyone")
  const [locationSharing, setLocationSharing] = useState(false)
  const [activityStatus, setActivityStatus] = useState(true)
  const [readReceipts, setReadReceipts] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the backend
    alert("Privacy settings saved!")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton fallbackPath="/settings" className="inline-flex items-center text-forest-500">
            Back
          </BackButton>
          <h1 className="font-medium ml-4">Privacy Settings</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-forest-500" />
                  Visibility
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Who can see your profile</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger id="profile-visibility">
                      <SelectValue placeholder="Select who can see your profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="friends">Friends only</SelectItem>
                      <SelectItem value="friends-of-friends">Friends of friends</SelectItem>
                      <SelectItem value="nobody">Nobody</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="post-visibility">Who can see your posts</Label>
                  <Select value={postVisibility} onValueChange={setPostVisibility}>
                    <SelectTrigger id="post-visibility">
                      <SelectValue placeholder="Select who can see your posts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="friends">Friends only</SelectItem>
                      <SelectItem value="friends-of-friends">Friends of friends</SelectItem>
                      <SelectItem value="nobody">Nobody</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-lg font-medium flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-forest-500" />
                  Connections
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="friend-requests">Who can send you friend requests</Label>
                  <Select value={friendRequests} onValueChange={setFriendRequests}>
                    <SelectTrigger id="friend-requests">
                      <SelectValue placeholder="Select who can send you friend requests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="friends-of-friends">Friends of friends</SelectItem>
                      <SelectItem value="nobody">Nobody</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-lg font-medium flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-forest-500" />
                  Privacy Controls
                </h2>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-sharing">Location sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow friends to see your location</p>
                  </div>
                  <Switch id="location-sharing" checked={locationSharing} onCheckedChange={setLocationSharing} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="activity-status">Activity status</Label>
                    <p className="text-sm text-muted-foreground">Show when you're active</p>
                  </div>
                  <Switch id="activity-status" checked={activityStatus} onCheckedChange={setActivityStatus} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="read-receipts">Read receipts</Label>
                    <p className="text-sm text-muted-foreground">Show when you've read messages</p>
                  </div>
                  <Switch id="read-receipts" checked={readReceipts} onCheckedChange={setReadReceipts} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600">
                <Save className="h-4 w-4 mr-2" />
                Save Privacy Settings
              </Button>
            </div>
          </form>

          <div className="pt-6 border-t">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/settings/blocked-accounts">
                <Lock className="h-4 w-4 mr-2" />
                Manage Blocked Accounts
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
