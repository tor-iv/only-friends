import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, ImageIcon, Smile, PlaneIcon as PaperPlaneIcon } from "lucide-react"

export default function ConversationLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto space-y-4">
          <div className="text-center">
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>

          <div className="flex justify-start">
            <Skeleton className="h-20 w-[70%] rounded-2xl rounded-bl-none" />
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-16 w-[60%] rounded-2xl rounded-br-none" />
          </div>

          <div className="flex justify-start">
            <Skeleton className="h-24 w-[75%] rounded-2xl rounded-bl-none" />
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-20 w-[65%] rounded-2xl rounded-br-none" />
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-white border-t p-3">
        <div className="w-full max-w-lg mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0" disabled>
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0" disabled>
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Skeleton className="h-10 flex-1" />
          <Button variant="ghost" size="icon" className="shrink-0" disabled>
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0" disabled>
            <PaperPlaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
