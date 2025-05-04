import { NextResponse } from "next/server"
import { sendVerificationCode, generateVerificationCode } from "@/lib/twilio"
import { supabase } from "@/lib/supabase"

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

    // Generate a verification code
    const verificationCode = generateVerificationCode()

    // Store the verification code in Supabase
    try {
      // First, check if there's an existing recent code and delete it
      const { error: deleteError } = await supabase
        .from("verification_codes")
        .delete()
        .eq("phone_number", phoneNumber)
        .gt("expires_at", new Date().toISOString())

      if (deleteError) {
        console.warn("Error cleaning up old verification codes:", deleteError)
        // Continue anyway, not critical
      }

      // Insert the new code
      const { error: storeError } = await supabase.from("verification_codes").insert({
        phone_number: phoneNumber,
        code: verificationCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes expiry
      })

      if (storeError) {
        console.error("Error storing verification code:", storeError)
        return NextResponse.json({ success: false, error: "Failed to store verification code" }, { status: 500 })
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
    }

    // Send the verification code via Twilio
    const result = await sendVerificationCode(phoneNumber, verificationCode)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send verification code" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: "Verification code sent" })
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
