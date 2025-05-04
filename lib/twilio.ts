import twilio from "twilio"

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

// Create Twilio client
let client: any = null

// Function to get or initialize the Twilio client
function getTwilioClient() {
  if (!client && accountSid && authToken) {
    try {
      client = twilio(accountSid, authToken)
    } catch (error) {
      console.error("Failed to initialize Twilio client:", error)
      throw new Error("Failed to initialize Twilio client")
    }
  }

  if (!client) {
    throw new Error("Twilio client not initialized. Check your environment variables.")
  }

  return client
}

// Function to send verification code via SMS
export async function sendVerificationCode(phoneNumber: string, code: string) {
  try {
    // Validate phone number format
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return { success: false, error: "Invalid phone number format" }
    }

    const client = getTwilioClient()

    if (!twilioPhoneNumber) {
      return { success: false, error: "Twilio phone number not configured" }
    }

    const message = await client.messages.create({
      body: `Your Only Friends verification code is: ${code}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    })

    return { success: true, messageId: message.sid }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending SMS",
    }
  }
}

// Generate a random verification code
export function generateVerificationCode(length = 6) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0")
}

// Function to format phone number for display
export function formatPhoneNumberForDisplay(phoneNumber: string) {
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
