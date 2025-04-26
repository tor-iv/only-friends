import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import OtpInput from "@/components/otp-input"

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 leaf-pattern">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        <div className="w-full">
          <Link href="/" className="inline-flex items-center text-forest-500 dark:text-cream-300 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold mb-2">Verify your number</h1>
            <p className="text-muted-foreground">We've sent a code to +1 (555) 123-4567</p>
          </div>

          <div className="space-y-8">
            <OtpInput length={6} />

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Code expires in <span className="font-medium">04:59</span>
              </div>
              <Button variant="link" className="text-forest-500 dark:text-cream-300 p-0 h-auto" disabled>
                Resend code
              </Button>
            </div>

            <Button className="w-full bg-forest-500 hover:bg-forest-600 text-cream-100" size="lg" asChild>
              <Link href="/create-profile">Verify</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
