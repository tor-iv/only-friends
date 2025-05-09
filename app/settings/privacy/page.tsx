"use client"

import Link from "next/link"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Save, Lock, Shield, MessageSquare, Calendar, MapPin } from "lucide-react"
import { useState } from "react"
import BackButton from "@/components/back-button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PrivacySettingsPage() {
  const [commentVisibility, setCommentVisibility] = useState("post_followers")
  const [birthdayVisibility, setBirthdayVisibility] = useState("friends")
  const [locationSharing, setLocationSharing] = useState(false)
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
          <div className="bg-forest-50 p-4 rounded-lg border border-forest-100">
            <p className="text-sm text-forest-800">
              <strong>Only Friends</strong> is designed to share content exclusively with your friends. Your profile and
              posts are only visible to people you're connected with.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-forest-500" />
                  Comment Privacy
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="comment-visibility">Who can see your comments</Label>
                  <Select value={commentVisibility} onValueChange={setCommentVisibility}>
                    <SelectTrigger id="comment-visibility">
                      <SelectValue placeholder="Select who can see your comments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post_followers">Anyone that follows posts</SelectItem>
                      <SelectItem value="friends">Only friends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-lg font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-forest-500" />
                  Birthday Privacy
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="birthday-visibility">Who can see your birthday</Label>
                  <Select value={birthdayVisibility} onValueChange={setBirthdayVisibility}>
                    <SelectTrigger id="birthday-visibility">
                      <SelectValue placeholder="Select who can see your birthday" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friends">All friends</SelectItem>
                      <SelectItem value="close_friends">Close friends only</SelectItem>
                      <SelectItem value="nobody">Nobody</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This controls who can see your birthday on your profile and receive notifications.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-lg font-medium flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-forest-500" />
                  Location Privacy
                </h2>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-sharing">Location sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow friends to see when you're nearby</p>
                  </div>
                  <Switch id="location-sharing" checked={locationSharing} onCheckedChange={setLocationSharing} />
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/settings/location">
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Location Settings
                  </Link>
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-lg font-medium flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-forest-500" />
                  Other Privacy Controls
                </h2>

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
