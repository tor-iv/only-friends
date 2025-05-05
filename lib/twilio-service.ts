import { normalizePhoneNumberForTwilio, generateVerificationCode } from "@/lib/twilio"
import { storeVerificationCode, verifyCode } from "@/lib/verification-store"

export async function sendVerificationSMS(phoneNumber: string): Promise<{
  success: boolean
  verificationCode?: string
  error?: string
  messageId?: string
}> {
  try {
    // Normalize the phone number
    const normalizedPhoneNumber = normalizePhoneNumberForTwilio(phoneNumber)

    // Generate a verification code
    const verificationCode = generateVerificationCode()

    // Store the verification code in the database
    const storeSuccess = await storeVerificationCode(normalizedPhoneNumber, verificationCode)

    if (!storeSuccess) {
      throw new Error("Failed to store verification code")
    }

    // Check if we have Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.warn("Twilio credentials missing - using development mode")

      // Return the verification code in development mode
      if (process.env.NODE_ENV !== "production") {
        return {
          success: true,
          verificationCode,
          messageId: "dev-mode",
        }
      }

      throw new Error("Twilio credentials missing")
    }

    // Make the Twilio API call
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
        To: normalizedPhoneNumber,
        From: twilioPhoneNumber,
        Body: `Your Only Friends verification code is: ${verificationCode}`,
      }).toString(),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Twilio API error:", errorData)
      throw new Error(`Twilio API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Return success with the message ID
    return {
      success: true,
      messageId: data.sid,
      // Include verification code in development mode
      ...(process.env.NODE_ENV !== "production" ? { verificationCode } : {}),
    }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending SMS",
    }
  }
}

export async function verifyPhoneNumber(
  phoneNumber: string,
  code: string,
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Normalize the phone number
    const normalizedPhoneNumber = normalizePhoneNumberForTwilio(phoneNumber)

    // Verify the code
    const isValid = await verifyCode(normalizedPhoneNumber, code)

    if (!isValid) {
      return {
        success: false,
        error: "Invalid or expired verification code",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error verifying code",
    }
  }
}
