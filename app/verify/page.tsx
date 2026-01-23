"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import OtpInput from "@/components/otp-input"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function VerifyPage() {
  const router = useRouter()
  const { verifyPhoneNumber, sendVerificationCode } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    // Get phone number from session storage
    const storedPhone = sessionStorage.getItem("verify_phone")
    if (!storedPhone) {
      // No phone number, redirect to login
      router.push("/login")
      return
    }
    setPhoneNumber(storedPhone)
  }, [router])

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatPhoneDisplay = (phone: string): string => {
    // Format for display: +1 (555) 123-4567
    if (phone.startsWith("+1") && phone.length === 12) {
      return `${phone.slice(0, 2)} (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8)}`
    }
    return phone
  }

  const handleOtpComplete = async (otp: string) => {
    if (!phoneNumber) return

    setError("")
    setIsLoading(true)

    try {
      const result = await verifyPhoneNumber(phoneNumber, otp)

      if (result.success) {
        // Clear the stored phone number
        sessionStorage.removeItem("verify_phone")

        if (result.isNewUser) {
          // New user - redirect to create profile
          router.push("/create-profile")
        } else {
          // Existing user - redirect to home
          router.push("/home")
        }
      } else {
        setError(result.error || "Invalid verification code")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!phoneNumber || !canResend) return

    setIsResending(true)
    setError("")

    try {
      const result = await sendVerificationCode(phoneNumber)

      if (result.success) {
        // Reset countdown
        setCountdown(300)
        setCanResend(false)
      } else {
        setError(result.error || "Failed to resend code")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 leaf-pattern">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="w-full">
          <Link href="/login" className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold mb-2">Verify your number</h1>
            <p className="text-muted-foreground">
              We've sent a code to {formatPhoneDisplay(phoneNumber)}
            </p>
          </div>

          <div className="space-y-8">
            <OtpInput length={6} onComplete={handleOtpComplete} />

            {error && <div className="text-sm text-red-500 text-center">{error}</div>}

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Code expires in <span className="font-medium">{formatCountdown(countdown)}</span>
              </div>
              <Button
                variant="link"
                className="text-forest-500 dark:text-cream-300 p-0 h-auto"
                disabled={!canResend || isResending}
                onClick={handleResendCode}
              >
                {isResending ? "Sending..." : canResend ? "Resend code" : "Resend code"}
              </Button>
            </div>

            <Button
              className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
              size="lg"
              disabled={isLoading}
              onClick={() => {
                // The OTP input auto-submits on complete, but provide manual option
                const inputs = document.querySelectorAll('input[type="text"]')
                let otp = ""
                inputs.forEach((input) => {
                  otp += (input as HTMLInputElement).value
                })
                if (otp.length === 6) {
                  handleOtpComplete(otp)
                }
              }}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
