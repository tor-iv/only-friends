// Function to normalize phone numbers to E.164 format
export function normalizePhoneNumberForTwilio(phoneNumber: string): string {
  // Remove all non-digit characters except the leading +
  let formatted = phoneNumber.replace(/[^\d+]/g, "")

  // If doesn't start with +, add it
  if (!formatted.startsWith("+")) {
    // For US numbers
    if (formatted.length === 10) {
      formatted = `+1${formatted}`
    } else if (formatted.length === 11 && formatted.startsWith("1")) {
      formatted = `+${formatted}`
    } else {
      // For other cases, just add the +
      formatted = `+${formatted}`
    }
  }

  console.log("Normalized phone number for Twilio:", formatted)
  return formatted
}

// Generate a random verification code
export function generateVerificationCode(length = 6): string {
  // This ensures we always get a string of exactly the right length
  let code = ""
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

// Function to format phone number for display
export function formatPhoneNumberForDisplay(phoneNumber: string): string {
  // Basic formatting for US numbers, can be expanded for international
  try {
    if (!phoneNumber) return ""

    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, "")

    // Format based on length
    if (digitsOnly.length === 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
    } else if (digitsOnly.length === 11 && digitsOnly[0] === "1") {
      return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`
    }

    // If not a standard format, just return with country code
    if (phoneNumber.startsWith("+")) {
      return phoneNumber
    }

    return `+${phoneNumber}`
  } catch (error) {
    console.error("Error formatting phone number:", error)
    return phoneNumber // Return original if formatting fails
  }
}

// Send verification code using the Twilio API - SERVER SIDE ONLY
export async function sendVerificationCode(phoneNumber: string, code: string) {
  try {
    // Validate phone number format
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return { success: false, error: "Invalid phone number format" }
    }

    // Check if we have Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error("Twilio credentials missing - cannot send SMS")
      return { success: false, error: "Twilio credentials missing" }
    }

    console.log(`Sending verification code ${code} to ${phoneNumber} via Twilio API`)

    // Make the actual Twilio API call
    const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

    // Create the authorization string
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64")

    const response = await fetch(twilioApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: new URLSearchParams({
        To: phoneNumber,
        From: twilioPhoneNumber,
        Body: `Your Only Friends verification code is: ${code}`,
      }).toString(),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Twilio API error:", errorData)
      throw new Error(`Twilio API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Twilio API success, message SID:", data.sid)

    // Return only the success status and message ID
    return {
      success: true,
      messageId: data.sid,
    }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending SMS",
    }
  }
}
