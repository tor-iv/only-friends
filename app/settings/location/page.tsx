"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Save, MapPin } from "lucide-react"
import { useState } from "react"
import BackButton from "@/components/back-button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function LocationSettingsPage() {
  const [locationSharing, setLocationSharing] = useState(true)
  const [locationPrecision, setLocationPrecision] = useState("approximate")
  const [nearbyNotifications, setNearbyNotifications] = useState(true)
  const [notificationDistance, setNotificationDistance] = useState("2")
  const [notificationFrequency, setNotificationFrequency] = useState("daily")
  const [shareWithFriends, setShareWithFriends] = useState("all_friends")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the backend
    alert("Location settings saved!")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton fallbackPath="/settings/privacy" className="inline-flex items-center text-forest-500">
            Back
          </BackButton>
          <h1 className="font-medium ml-4">Location Settings</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="bg-forest-50 p-4 rounded-lg border border-forest-100">
            <p className="text-sm text-forest-800">
              <strong>Location Privacy</strong>: Only Friends uses your location to help you connect with nearby
              friends. Your location is never shared with third parties.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-forest-500" />
                  Location Sharing
                </h2>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-sharing">Enable location sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow friends to see when you're nearby</p>
                  </div>
                  <Switch id="location-sharing" checked={locationSharing} onCheckedChange={setLocationSharing} />
                </div>

                {locationSharing && (
                  <>
                    <div className="space-y-2 ml-8">
                      <Label htmlFor="location-precision">Location precision</Label>
                      <RadioGroup
                        id="location-precision"
                        value={locationPrecision}
                        onValueChange={setLocationPrecision}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="precise" id="precise" />
                          <Label htmlFor="precise" className="font-normal">
                            Precise (exact location)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="approximate" id="approximate" />
                          <Label htmlFor="approximate" className="font-normal">
                            Approximate (neighborhood level)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2 ml-8">
                      <Label htmlFor="share-with">Share location with</Label>
                      <Select value={shareWithFriends} onValueChange={setShareWithFriends}>
                        <SelectTrigger id="share-with">
                          <SelectValue placeholder="Select who can see your location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_friends">All friends</SelectItem>
                          <SelectItem value="close_friends">Close friends only</SelectItem>
                          <SelectItem value="selected_friends">Selected friends</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-lg font-medium">Nearby Friends Notifications</h2>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="nearby-notifications">Nearby friend alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when friends who were far away are now nearby
                    </p>
                  </div>
                  <Switch
                    id="nearby-notifications"
                    checked={nearbyNotifications}
                    onCheckedChange={setNearbyNotifications}
                  />
                </div>

                {nearbyNotifications && (
                  <>
                    <div className="space-y-2 ml-8">
                      <Label htmlFor="notification-distance">Notification distance</Label>
                      <Select value={notificationDistance} onValueChange={setNotificationDistance}>
                        <SelectTrigger id="notification-distance">
                          <SelectValue placeholder="Select distance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Within 1 mile</SelectItem>
                          <SelectItem value="2">Within 2 miles</SelectItem>
                          <SelectItem value="5">Within 5 miles</SelectItem>
                          <SelectItem value="10">Within 10 miles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 ml-8">
                      <Label htmlFor="notification-frequency">Check frequency</Label>
                      <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                        <SelectTrigger id="notification-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Once a day</SelectItem>
                          <SelectItem value="manual">Only when I check</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">How often the app should check for nearby friends</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600">
                <Save className="h-4 w-4 mr-2" />
                Save Location Settings
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
