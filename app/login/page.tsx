"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

const countryCodes: { [key: string]: string } = {
  US: "+1",
  UK: "+44",
  CA: "+1",
  AU: "+61",
}

export default function LoginPage() {
  const router = useRouter()
  const { sendVerificationCode } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("US")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const formatPhoneForApi = (phone: string, country: string): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "")
    // Add country code
    return `${countryCodes[country]}${cleaned}`
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const formattedPhone = formatPhoneForApi(phoneNumber, countryCode)
      const result = await sendVerificationCode(formattedPhone)

      if (result.success) {
        // Store phone number in session storage for verify page
        sessionStorage.setItem("verify_phone", formattedPhone)
        router.push("/verify")
      } else {
        setError(result.error || "Failed to send verification code")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 leaf-pattern">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="w-full">
          <Link href="/" className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Enter your phone number to sign in</p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[80px] rounded-r-none">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">+1</SelectItem>
                      <SelectItem value="UK">+44</SelectItem>
                      <SelectItem value="CA">+1</SelectItem>
                      <SelectItem value="AU">+61</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="flex-1 rounded-l-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send you a verification code via SMS
                </p>
              </div>
            </div>

            {error && <div className="text-sm text-red-500 text-center">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Sending code..." : "Send Verification Code"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/"
                  className="text-forest-500 hover:text-forest-600 dark:text-cream-400 dark:hover:text-cream-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
