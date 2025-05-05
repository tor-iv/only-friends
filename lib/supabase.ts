import { createClient } from "@supabase/supabase-js"

// Create a more robust Supabase client initialization
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anonymous Key is missing")
    throw new Error("Supabase configuration is missing")
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// For backward compatibility
export const supabase = {
  from: (table: string) => {
    try {
      const client = getSupabaseClient()
      return client.from(table)
    } catch (error) {
      console.error(`Error accessing Supabase table ${table}:`, error)
      throw error
    }
  },
  auth: {
    getSession: () => {
      try {
        const client = getSupabaseClient()
        return client.auth.getSession()
      } catch (error) {
        console.error("Error accessing Supabase auth:", error)
        throw error
      }
    },
    getUser: () => {
      try {
        const client = getSupabaseClient()
        return client.auth.getUser()
      } catch (error) {
        console.error("Error accessing Supabase auth:", error)
        throw error
      }
    },
    signUp: (params: any) => {
      try {
        const client = getSupabaseClient()
        return client.auth.signUp(params)
      } catch (error) {
        console.error("Error accessing Supabase auth:", error)
        throw error
      }
    },
    signInWithPassword: (params: any) => {
      try {
        const client = getSupabaseClient()
        return client.auth.signInWithPassword(params)
      } catch (error) {
        console.error("Error accessing Supabase auth:", error)
        throw error
      }
    },
    signOut: () => {
      try {
        const client = getSupabaseClient()
        return client.auth.signOut()
      } catch (error) {
        console.error("Error accessing Supabase auth:", error)
        throw error
      }
    },
    onAuthStateChange: (callback: any) => {
      try {
        const client = getSupabaseClient()
        return client.auth.onAuthStateChange(callback)
      } catch (error) {
        console.error("Error accessing Supabase auth:", error)
        throw error
      }
    },
    resetPasswordForEmail: (email: string, options?: any) => {
      try {
        const client = getSupabaseClient()
        return client.auth.resetPasswordForEmail(email, options)
      } catch (error) {
        console.error("Error accessing Supabase auth:", error)
        throw error
      }
    },
    updateUser: (params: any) => {
      try {
        const client = getSupabaseClient()
        return client.auth.updateUser(params)
      } catch (error) {
        console.error("Error accessing Supabase auth:", error)
        throw error
      }
    },
  },
  storage: {
    from: (bucket: string) => {
      try {
        const client = getSupabaseClient()
        return client.storage.from(bucket)
      } catch (error) {
        console.error(`Error accessing Supabase storage bucket ${bucket}:`, error)
        throw error
      }
    },
  },
}
