import { supabase } from "@/lib/supabase"

export async function storeVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
  try {
    // Set expiration to 10 minutes from now
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

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
      code: code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (storeError) {
      console.error("Error storing verification code:", storeError)
      return false
    }

    console.log(`Stored verification code for ${phoneNumber} in database`)
    return true
  } catch (error) {
    console.error("Database error when storing verification code:", error)
    return false
  }
}

export async function verifyCode(phoneNumber: string, code: string): Promise<boolean> {
  try {
    // Get the verification code from the database
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("phone_number", phoneNumber)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      console.log(`No valid verification code found for ${phoneNumber}`)
      return false
    }

    // Mark the code as used
    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      console.error("Error marking verification code as used:", updateError)
      // Continue anyway, not critical
    }

    console.log(`Verification successful for ${phoneNumber}`)
    return true
  } catch (error) {
    console.error("Database error when verifying code:", error)
    return false
  }
}

export async function getActiveCode(phoneNumber: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("verification_codes")
      .select("code")
      .eq("phone_number", phoneNumber)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return null
    }

    return data.code
  } catch (error) {
    console.error("Database error when getting active code:", error)
    return null
  }
}

// New function to check if a user has exceeded the rate limit
export async function checkRateLimit(
  phoneNumber: string,
  maxAttempts = 5,
  windowMinutes = 30,
): Promise<{
  allowed: boolean
  attemptsCount: number
  nextAllowedAttempt: Date | null
}> {
  try {
    // Calculate the start of the time window
    const windowStart = new Date()
    windowStart.setMinutes(windowStart.getMinutes() - windowMinutes)

    // Count the number of verification codes sent to this phone number within the time window
    const { data, error } = await supabase
      .from("verification_codes")
      .select("created_at")
      .eq("phone_number", phoneNumber)
      .gte("created_at", windowStart.toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error checking rate limit:", error)
      // If there's an error, allow the request to proceed to avoid blocking legitimate users
      return { allowed: true, attemptsCount: 0, nextAllowedAttempt: null }
    }

    const attemptsCount = data?.length || 0

    // If the user has exceeded the rate limit, calculate when they can try again
    if (attemptsCount >= maxAttempts) {
      // Find the oldest attempt within the window
      const oldestAttempt = data && data.length > 0 ? new Date(data[data.length - 1].created_at) : null

      // Calculate when the next attempt will be allowed
      let nextAllowedAttempt: Date | null = null
      if (oldestAttempt) {
        nextAllowedAttempt = new Date(oldestAttempt)
        nextAllowedAttempt.setMinutes(nextAllowedAttempt.getMinutes() + windowMinutes)
      }

      return {
        allowed: false,
        attemptsCount,
        nextAllowedAttempt,
      }
    }

    return {
      allowed: true,
      attemptsCount,
      nextAllowedAttempt: null,
    }
  } catch (error) {
    console.error("Database error when checking rate limit:", error)
    // If there's an error, allow the request to proceed to avoid blocking legitimate users
    return { allowed: true, attemptsCount: 0, nextAllowedAttempt: null }
  }
}
