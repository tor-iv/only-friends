export default function NotFoundFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <a
            href="/home"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            <span>Go Back</span>
          </a>
          <a
            href="/home"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <span>Go Home</span>
          </a>
        </div>
      </div>
    </div>
  )
}
