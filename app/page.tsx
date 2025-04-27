import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 leaf-pattern">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-forest-500 dark:text-cream-300">
            Only Friends
          </h1>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <div className="flex">
              <Select defaultValue="US">
                <SelectTrigger className="w-[80px] rounded-r-none">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">+1</SelectItem>
                  <SelectItem value="UK">+44</SelectItem>
                  <SelectItem value="CA">+1</SelectItem>
                  <SelectItem value="AU">+61</SelectItem>
                </SelectContent>
              </Select>
              <Input type="tel" placeholder="Phone number" className="flex-1 rounded-l-none" />
            </div>
            <p className="text-xs text-muted-foreground">We'll send a verification code to this number</p>
          </div>

          <Button className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100" size="lg" asChild>
            <Link href="/verify">
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-forest-400 hover:text-forest-500 dark:text-cream-400 dark:hover:text-cream-300"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto mt-8 text-center">
        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
          Privacy Policy
        </Link>
      </div>
    </div>
  )
}
