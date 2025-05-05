"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a singleton instance for the browser client
let browserClient: ReturnType<typeof createClientComponentClient> | null = null

export function getSupabaseBrowser() {
  if (browserClient) return browserClient

  browserClient = createClientComponentClient()
  return browserClient
}

export const supabaseBrowser = getSupabaseBrowser()
