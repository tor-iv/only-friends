"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (
    email: string,
    password: string,
    phone: string,
    metadata?: any,
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    error: any | null
    data: any | null
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabaseBrowser.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error in auth setup:", error)
      } finally {
        setIsLoading(false)
      }
    }

    let listener: { subscription: { unsubscribe: () => void } } | null = null

    try {
      const { data, error } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      if (error) {
        console.error("Error setting up auth listener:", error)
      } else {
        listener = data
      }
    } catch (error) {
      console.error("Error in auth listener setup:", error)
      setIsLoading(false)
    }

    setData()

    return () => {
      if (listener?.subscription) {
        try {
          listener.subscription.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from auth listener:", error)
        }
      }
    }
  }, [])

  const signUp = async (email: string, password: string, phone: string, metadata?: any) => {
    try {
      const { data, error } = await supabaseBrowser.auth.signUp({
        email,
        password,
        phone,
        options: {
          data: metadata,
        },
      })

      return { data, error }
    } catch (error) {
      console.error("Error in signUp:", error)
      return { data: null, error: error instanceof Error ? error : new Error("Unknown error in signUp") }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      })

      return { data, error }
    } catch (error) {
      console.error("Error in signIn:", error)
      return { data: null, error: error instanceof Error ? error : new Error("Unknown error in signIn") }
    }
  }

  const signOut = async () => {
    try {
      await supabaseBrowser.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error in signOut:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      return { data, error }
    } catch (error) {
      console.error("Error in resetPassword:", error)
      return { data: null, error: error instanceof Error ? error : new Error("Unknown error in resetPassword") }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
