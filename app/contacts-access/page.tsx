"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

// Client component that uses useSearchParams
function ContactsAccessContent() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/create-profile"

  return (
    <div className="w-full">
      <Link href={from} className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-forest-100 dark:bg-forest-800 flex items-center justify-center">
            <Users className="w-12 h-12 text-forest-500 dark:text-forest-300" />
          </div>
        </div>

        <h1 className="font-serif text-2xl font-bold mb-4">Connect with Your Friends</h1>

        <p className="text-muted-foreground mb-4">
          Only Friends requires access to your contacts to help you connect with friends. We value your privacy and will
          never share your contact list.
        </p>

        <p className="text-sm font-medium mb-8">
          You'll need at least 5 friends on Only Friends to access all features.
        </p>
      </div>

      <div className="space-y-4">
        <Button className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100" size="lg" asChild>
          <Link href="/invite-friends">Allow Access to Contacts</Link>
        </Button>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/pending-progress">Skip for now</Link>
        </Button>
      </div>
    </div>
  )
}

// Loading fallback for Suspense
function ContactsAccessLoading() {
  return <div className="w-full text-center p-4">Loading...</div>
}

// Main page component with Suspense boundary
export default function ContactsAccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-background">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <Suspense fallback={<ContactsAccessLoading />}>
          <ContactsAccessContent />
        </Suspense>
      </div>
    </div>
  )
}
