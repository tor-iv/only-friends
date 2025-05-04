"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // In a real app, you would call an API to send a reset code
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-background">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="w-full">
          <Link href="/login" className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold mb-2">Reset Your Password</h1>
            <p className="text-muted-foreground">
              {isSubmitted
                ? "We've sent a verification code to your phone number."
                : "Enter your phone number and we'll send you a verification code to reset your password."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <Select defaultValue="US">
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
                </div>
              </div>

              {error && <div className="text-sm text-red-500 text-center">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center text-forest-500 dark:text-cream-300">
                Check your phone for the verification code.
              </div>
              <Button className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100" size="lg" asChild>
                <Link href="/verify">Continue to Verification</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
