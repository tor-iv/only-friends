import { NextResponse } from "next/server"
import { normalizePhoneNumberForTwilio } from "@/lib/twilio"
import { checkRateLimit } from "@/lib/verification-store"
import { sendVerificationSMS } from "@/lib/twilio-service"

// This is a server-side only API route
export async function POST(request: Request) {
  try {
    // Parse the request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    const { phoneNumber } = body

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json({ success: false, error: "Valid phone number is required" }, { status: 400 })
    }

    console.log("Received phone number:", phoneNumber)

    // Normalize the phone number for storage and verification
    const normalizedPhoneNumber = normalizePhoneNumberForTwilio(phoneNumber)
    console.log("Normalized phone number:", normalizedPhoneNumber)

    // Check rate limit (max 5 attempts in 30 minutes)
    const rateLimitCheck = await checkRateLimit(normalizedPhoneNumber, 5, 30)

    if (!rateLimitCheck.allowed) {
      // Calculate time until next allowed attempt
      let waitTimeMessage = "Too many verification attempts. Please try again later."

      if (rateLimitCheck.nextAllowedAttempt) {
        const waitMinutes = Math.ceil(
          (rateLimitCheck.nextAllowedAttempt.getTime() - new Date().getTime()) / (1000 * 60),
        )
        waitTimeMessage = `Too many verification attempts. Please try again in ${waitMinutes} minute${
          waitMinutes !== 1 ? "s" : ""
        }.`
      }

      return NextResponse.json(
        {
          success: false,
          error: waitTimeMessage,
          rateLimited: true,
          attemptsCount: rateLimitCheck.attemptsCount,
        },
        { status: 429 }, // 429 Too Many Requests
      )
    }

    // Send the verification SMS
    const result = await sendVerificationSMS(normalizedPhoneNumber)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send verification code" },
        { status: 500 },
      )
    }

    // Return success response
    const response: any = {
      success: true,
      message: "Verification code sent",
      attemptsRemaining: 5 - (rateLimitCheck.attemptsCount + 1), // Include this attempt
    }

    // Include verification code in development mode
    if (process.env.NODE_ENV !== "production" && result.verificationCode) {
      response.verificationCode = result.verificationCode
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in send-verification API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
