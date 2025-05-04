import { NextResponse } from "next/server"
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

    const { phoneNumber, code } = body

    if (!phoneNumber || !code) {
      return NextResponse.json({ success: false, error: "Phone number and code are required" }, { status: 400 })
    }

    // Check if the verification code is valid
    try {
      const { data, error } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("phone_number", phoneNumber)
        .eq("code", code)
        .gt("expires_at", new Date().toISOString())
        .eq("used", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        console.error("Error verifying code:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Invalid or expired verification code. Please request a new code.",
          },
          { status: 400 },
        )
      }

      // Mark the verification code as used
      const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

      if (updateError) {
        console.error("Error marking code as used:", updateError)
        // Continue anyway, not critical
      }

      return NextResponse.json({ success: true, verified: true })
    } catch (dbError) {
      console.error("Database error during verification:", dbError)
      return NextResponse.json({ success: false, error: "Database error during verification" }, { status: 500 })
    }
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
