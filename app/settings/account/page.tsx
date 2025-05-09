"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import BackButton from "@/components/back-button"
import { Label } from "@/components/ui/label"

export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    username: "alexj",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Nature lover, hiking enthusiast, and amateur photographer. Always looking for the next adventure!",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the backend
    alert("Settings saved!")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton fallbackPath="/settings" className="inline-flex items-center text-forest-500">
            Back
          </BackButton>
          <h1 className="font-medium ml-4">Account Settings</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full bg-forest-500 hover:bg-forest-600">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>

          <div className="pt-6 border-t space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Password</h2>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/settings/change-password">Change Password</Link>
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Danger Zone</h2>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
