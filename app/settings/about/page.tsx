"use client"

import { ArrowLeft } from "lucide-react"
import BackButton from "@/components/back-button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <BackButton fallbackPath="/settings" className="inline-flex items-center text-forest-500">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </BackButton>
          <h1 className="font-medium ml-4">About</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-8">
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-forest-600">Only Friends</h2>
            <p className="text-muted-foreground mt-2">Version 1.0.0</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">About Only Friends</h3>
            <p className="text-muted-foreground">
              Only Friends is a private social network designed to help you stay connected with your closest friends and
              family. Share moments, stories, and updates with the people who matter most, without the noise of
              traditional social media.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Our Mission</h3>
            <p className="text-muted-foreground">
              We believe that meaningful connections happen in small groups. Our mission is to create a space where you
              can be your authentic self with the people you trust, free from the pressure of public social media.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Legal</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-forest-500 hover:underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-forest-500 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/community" className="block text-forest-500 hover:underline">
                Community Guidelines
              </Link>
            </div>
          </div>

          <Separator />

          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>© 2023 Only Friends. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
