import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/bottom-navigation"

export default function SearchLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center gap-3">
          <Link href="/home" className="text-forest-500">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search friends..." className="pl-9 pr-4" disabled />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
