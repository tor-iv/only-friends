"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProfilePictureUpload from "@/components/profile-picture-upload"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function CreateProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleProfilePictureChange = (file: File | null) => {
    setProfilePicture(file)
  }

  // Function to convert File to data URL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Get the phone number from session storage (set during verification)
      const phoneNumber = sessionStorage.getItem("phoneNumber")
      if (!phoneNumber) {
        throw new Error("Phone number not found. Please restart the signup process.")
      }

      // Create a temporary user profile without authentication
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        profile_picture: null as string | null,
      }

      // Handle profile picture upload if provided
      if (profilePicture) {
        try {
          // Convert the file to a data URL instead of a blob URL
          const dataUrl = await fileToDataUrl(profilePicture)
          profileData.profile_picture = dataUrl
        } catch (uploadError) {
          console.error("Error handling profile picture:", uploadError)
          // Continue without the profile picture
        }
      }

      // Store the profile data in session storage
      sessionStorage.setItem("tempProfileData", JSON.stringify(profileData))

      // Show success message
      toast({
        title: "Profile created",
        description: "Your profile has been created successfully.",
      })

      // Navigate to the next step
      router.push("/contacts-access")
    } catch (err: any) {
      console.error("Error creating profile:", err)
      setError(err.message || "Failed to create profile. Please try again.")
      toast({
        title: "Error",
        description: err.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-background">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="w-full">
          <Link href="/verify" className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold">Create Your Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              <ProfilePictureUpload onChange={handleProfilePictureChange} />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-sm text-red-500 text-center">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Profile..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
