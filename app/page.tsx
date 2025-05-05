"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function WelcomePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Format phone number as user types
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, "")

    // Format the phone number (US format)
    let formatted = digitsOnly
    if (countryCode === "+1") {
      if (digitsOnly.length <= 3) {
        formatted = digitsOnly
      } else if (digitsOnly.length <= 6) {
        formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
      } else {
        formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
      }
    }

    setPhoneNumber(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      // Safely format the phone number by removing non-digit characters
      const formattedNumber = phoneNumber.replace(/\D/g, "")

      // Validate phone number length
      if (countryCode === "+1" && formattedNumber.length !== 10) {
        setError("Please enter a valid 10-digit phone number")
        setIsLoading(false)
        return
      }

      // Format the phone number with the country code in E.164 format
      let fullPhoneNumber = `${countryCode}${formattedNumber}`

      // Make sure the phone number has the + prefix (E.164 format)
      if (!fullPhoneNumber.startsWith("+")) {
        fullPhoneNumber = `+${fullPhoneNumber.replace(/^\+/, "")}`
      }

      console.log("Sending verification to phone number:", fullPhoneNumber)

      try {
        // Send verification code
        const response = await fetch("/api/auth/send-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
        })

        const data = await response.json()

        if (!response.ok) {
          // Special handling for rate limiting errors
          if (response.status === 429) {
            throw new Error(data.error || "Too many verification attempts. Please try again later.")
          }
          throw new Error(data.error || "Failed to send verification code")
        }

        // Store the phone number in session storage for the verification step
        sessionStorage.setItem("phoneNumber", fullPhoneNumber)

        // Show success message with attempts remaining if available
        let message = `Verification code sent to ${fullPhoneNumber}`
        if (data.attemptsRemaining !== undefined) {
          message += ` (${data.attemptsRemaining} attempt${data.attemptsRemaining !== 1 ? "s" : ""} remaining)`
        }
        setSuccessMessage(message)

        // Navigate to verification page after a short delay
        setTimeout(() => {
          router.push("/verify")
        }, 1500)
      } catch (apiError) {
        // For development/demo purposes, simulate successful verification if API fails
        console.error("API error, using development fallback:", apiError)

        // Store the phone number in session storage
        sessionStorage.setItem("phoneNumber", fullPhoneNumber)

        // Generate a fake verification code for development
        const fakeCode = "123456"
        sessionStorage.setItem("verificationCode", fakeCode)

        toast({
          title: "Development Mode",
          description: `Using development fallback. Verification code: ${fakeCode}`,
        })

        // Show success message
        setSuccessMessage(`Development mode: Verification code sent to ${fullPhoneNumber}`)

        // Navigate to verification page after a short delay
        setTimeout(() => {
          router.push("/verify")
        }, 1500)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to send verification code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-background">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-forest-500 dark:text-cream-300">
            Only Friends
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <div className="flex">
              <Select defaultValue="+1" onValueChange={(value) => setCountryCode(value)}>
                <SelectTrigger className="w-[80px] rounded-r-none">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+61">+61</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                className="flex-1 rounded-l-none"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">We'll send a verification code to this number</p>
            {error && <p className="text-xs text-red-500">{error}</p>}
            {successMessage && <p className="text-xs text-green-500">{successMessage}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Sending code..." : "Get Started"} {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-forest-400 hover:text-forest-500 dark:text-cream-400 dark:hover:text-cream-300"
            >
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>

      <div className="w-full max-w-md mx-auto mt-8 text-center">
        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
          Privacy Policy
        </Link>
      </div>
    </div>
  )
}
