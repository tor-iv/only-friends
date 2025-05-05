"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import OtpInput from "@/components/otp-input"

export default function TestSMSPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [step, setStep] = useState<"send" | "verify">("send")
  const [devCode, setDevCode] = useState<string | null>(null)

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

  const handleSendCode = async () => {
    // Reset states
    setError("")
    setSuccess("")
    setDevCode(null)

    // Basic validation
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number")
      return
    }

    setIsLoading(true)

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
        throw new Error(data.error || "Failed to send verification code")
      }

      // Store the phone number for verification
      sessionStorage.setItem("phoneNumber", fullPhoneNumber)

      // Show success message
      setSuccess(`Verification code sent to ${fullPhoneNumber}`)

      // If we're in development mode and got a verification code
      if (data.verificationCode) {
        setDevCode(data.verificationCode)
      }

      // Move to verification step
      setStep("verify")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to send verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    // Reset states
    setError("")
    setSuccess("")

    // Basic validation
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code")
      return
    }

    setIsVerifying(true)

    try {
      const phoneNumber = sessionStorage.getItem("phoneNumber")

      if (!phoneNumber) {
        throw new Error("Phone number not found. Please restart the process.")
      }

      // Verify the code
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code")
      }

      // Show success message
      setSuccess("Phone number verified successfully!")

      // Reset for another test
      setTimeout(() => {
        setStep("send")
        setVerificationCode("")
        setDevCode(null)
      }, 3000)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to verify code")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOtpComplete = (otp: string) => {
    setVerificationCode(otp)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test SMS Verification</CardTitle>
          <CardDescription>Test the SMS verification functionality with Twilio and Supabase</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === "send" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
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
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="flex-1 rounded-l-none"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                </div>
              </div>

              <Button
                onClick={handleSendCode}
                className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <div className="flex justify-center mb-2">
                  <OtpInput length={6} onComplete={handleOtpComplete} />
                </div>

                {devCode && (
                  <div className="text-center p-2 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-amber-800 text-sm">
                      Development mode: <span className="font-mono font-bold">{devCode}</span>
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleVerifyCode}
                className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100"
                disabled={isVerifying || verificationCode.length !== 6}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <Button variant="outline" className="w-full" onClick={() => setStep("send")} disabled={isVerifying}>
                Back
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-xs text-muted-foreground">
            This is a test page to verify the SMS functionality with Twilio and Supabase.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
