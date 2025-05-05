import { NextResponse } from "next/server"
import { verifyPhoneNumber } from "@/lib/twilio-service"

export async function POST(request: Request) {
  try {
    // Parse the request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    const { phoneNumber, code } = body

    if (!phoneNumber || !code) {
      return NextResponse.json({ success: false, error: "Phone number and code are required" }, { status: 400 })
    }

    // Verify the phone number
    const result = await verifyPhoneNumber(phoneNumber, code)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Invalid verification code" }, { status: 400 })
    }

    return NextResponse.json({ success: true, verified: true })
  } catch (error) {
    console.error("Error in verify-code API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
