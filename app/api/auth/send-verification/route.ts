import { NextResponse } from "next/server"
import { sendVerificationCode, generateVerificationCode, normalizePhoneNumberForTwilio } from "@/lib/twilio"
import { storeVerificationCode, checkRateLimit } from "@/lib/verification-store"

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
        waitTimeMessage = `Too many verification attempts. Please try again in ${waitMinutes} minute${waitMinutes !== 1 ? "s" : ""}.`
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

    // Generate a verification code
    const verificationCode = generateVerificationCode()
    console.log("Generated verification code:", verificationCode)

    // Store the verification code in the database
    const storeSuccess = await storeVerificationCode(normalizedPhoneNumber, verificationCode)

    if (!storeSuccess) {
      return NextResponse.json({ success: false, error: "Failed to store verification code" }, { status: 500 })
    }

    // Send the verification code via Twilio
    const result = await sendVerificationCode(normalizedPhoneNumber, verificationCode)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send verification code" },
        { status: 500 },
      )
    }

    // Return success response without the verification code
    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      attemptsRemaining: 5 - (rateLimitCheck.attemptsCount + 1), // Include this attempt
    })
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
