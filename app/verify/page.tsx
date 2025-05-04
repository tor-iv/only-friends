"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import OtpInput from "@/components/otp-input"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { formatPhoneNumberForDisplay } from "@/lib/twilio"

export default function VerifyPage() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState<string>("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const router = useRouter()

  useEffect(() => {
    // Get the phone number from session storage
    const storedPhoneNumber = sessionStorage.getItem("phoneNumber")
    if (!storedPhoneNumber) {
      router.push("/")
      return
    }
    setPhoneNumber(storedPhoneNumber)

    // Format the phone number for display
    try {
      setDisplayPhoneNumber(formatPhoneNumberForDisplay(storedPhoneNumber))
    } catch (err) {
      setDisplayPhoneNumber(storedPhoneNumber)
    }

    // Set up timer for OTP expiration
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleVerify = async () => {
    if (!phoneNumber) {
      setError("Phone number not found. Please go back and try again.")
      return
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      // Verify the OTP
      const verifyResponse = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, code: otp }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Invalid verification code")
      }

      // Generate a random email based on the phone number to use with Supabase
      const randomEmail = `user_${Date.now()}@onlyfriends.app`
      const password = `password_${Date.now()}`

      // Sign up the user with Supabase
      const { error } = await supabase.auth.signUp({
        email: randomEmail,
        password,
        phone: phoneNumber,
        options: {
          data: {
            phone_number: phoneNumber,
            verified: true,
          },
        },
      })

      if (error) {
        throw error
      }

      // Store the credentials for the login page
      sessionStorage.setItem("tempEmail", randomEmail)
      sessionStorage.setItem("tempPassword", password)

      // Show success message
      setSuccessMessage("Phone number verified successfully!")

      // Navigate to create profile page after a short delay
      setTimeout(() => {
        router.push("/create-profile")
      }, 1500)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to verify. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!phoneNumber) return

    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      // Resend verification code
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification code")
      }

      // Reset the timer
      setTimeLeft(300)

      // Show success message
      setSuccessMessage(`New code sent to ${displayPhoneNumber}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to resend code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpComplete = (otpValue: string) => {
    setOtp(otpValue)
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-background">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="w-full">
          <Link href="/" className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold mb-2">Verify your number</h1>
            <p className="text-muted-foreground">We've sent a code to {displayPhoneNumber}</p>
          </div>

          <div className="space-y-8">
            <OtpInput length={6} onComplete={handleOtpComplete} />

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Code expires in <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
              <Button
                variant="link"
                className="text-forest-500 dark:text-cream-300 p-0 h-auto"
                disabled={(timeLeft > 0 && timeLeft < 290) || isLoading} // Prevent spam clicks, allow after 10 seconds
                onClick={handleResendCode}
              >
                Resend code
              </Button>
            </div>

            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            {successMessage && <div className="text-sm text-green-500 text-center">{successMessage}</div>}

            <Button
              className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
              size="lg"
              onClick={handleVerify}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
