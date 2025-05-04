import { Button } from "@/components/ui/button"
import { Bell, HelpCircle, Info, Lock, LogOut, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <Link href="/profile" className="inline-flex items-center text-forest-500 dark:text-cream-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <h1 className="font-medium ml-4">Settings</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="space-y-1">
            <Link href="/settings/account" className="flex items-center justify-between p-3 hover:bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-forest-500" />
                <span>Account Settings</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>

            <Link href="/settings/privacy" className="flex items-center justify-between p-3 hover:bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-forest-500" />
                <span>Privacy Settings</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>

            <Link
              href="/settings/notifications"
              className="flex items-center justify-between p-3 hover:bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-forest-500" />
                <span>Notification Preferences</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>

            <Link href="/settings/help" className="flex items-center justify-between p-3 hover:bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-forest-500" />
                <span>Help & Support</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>

            <Link href="/settings/about" className="flex items-center justify-between p-3 hover:bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-forest-500" />
                <span>About</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>

          <div className="pt-6 border-t">
            <Button variant="destructive" className="w-full" asChild>
              <Link href="/">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
