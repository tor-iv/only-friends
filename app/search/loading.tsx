import { Skeleton } from "@/components/ui/skeleton"
import BottomNavigation from "@/components/bottom-navigation"

export default function SearchLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20 ml-4" />
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <Skeleton className="h-10 w-full" />

          <div className="space-y-4">
            <Skeleton className="h-5 w-20" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center p-3 rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
