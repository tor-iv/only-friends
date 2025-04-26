"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"

interface OtpInputProps {
  length: number
  onComplete?: (otp: string) => void
}

export default function OtpInput({ length, onComplete }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value

    // Only accept numbers
    if (!/^\d*$/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Check if OTP is complete
    const otpValue = newOtp.join("")
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue)
    }

    // Move to next input if current input is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted data is a number and has the correct length
    if (!/^\d+$/.test(pastedData)) return

    const pastedOtp = pastedData.substring(0, length).split("")
    const newOtp = [...otp]

    for (let i = 0; i < pastedOtp.length; i++) {
      newOtp[i] = pastedOtp[i]
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const lastFilledIndex = Math.min(pastedOtp.length, length - 1)
    inputRefs.current[lastFilledIndex]?.focus()

    // Check if OTP is complete
    if (pastedOtp.length === length && onComplete) {
      onComplete(pastedOtp.join(""))
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center text-lg"
        />
      ))}
    </div>
  )
}
