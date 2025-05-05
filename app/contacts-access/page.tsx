"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function ContactsAccessPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if we have temporary profile data
    const tempProfileData = sessionStorage.getItem("tempProfileData")
    if (!tempProfileData) {
      toast({
        title: "Profile data missing",
        description: "Please complete your profile first.",
        variant: "destructive",
      })
      router.push("/create-profile")
    }
  }, [router, toast])

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-background">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="w-full">
          <Link href="/create-profile" className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
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
              Only Friends requires access to your contacts to help you connect with friends. We value your privacy and
              will never share your contact list.
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
      </div>
    </div>
  )
}
