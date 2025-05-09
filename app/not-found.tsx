"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button variant="outline" size="lg" asChild className="gap-2">
            <Link href="/home">
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </Link>
          </Button>
          <Button size="lg" asChild className="gap-2">
            <Link href="/home">
              <Home size={16} />
              <span>Go Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
