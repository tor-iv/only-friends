import { Suspense } from "react"
import NotFoundClient from "@/components/not-found-client"
import NotFoundFallback from "@/components/not-found-fallback"

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundFallback />}>
      <NotFoundClient />
    </Suspense>
  )
}
