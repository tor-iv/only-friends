import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Check if Supabase environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase environment variables are missing in middleware")
      return res
    }

    // Create the Supabase client with explicit URL and key
    const supabase = createMiddlewareClient(
      { req, res },
      {
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
      },
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protected routes
    const protectedRoutes = [
      "/home",
      "/profile",
      "/friends",
      "/create-post",
      "/post",
      "/friend",
      "/notifications",
      "/settings",
      "/add-friends",
      "/invite-friends",
    ]

    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
    const isAuthRoute =
      req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname === "/verify" ||
      req.nextUrl.pathname === "/create-profile" ||
      req.nextUrl.pathname === "/contacts-access" ||
      req.nextUrl.pathname === "/forgot-password"

    // If the user is not logged in and trying to access a protected route
    if (!session && isProtectedRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/"
      return NextResponse.redirect(redirectUrl)
    }

    // If the user is logged in and trying to access an auth route
    if (session && isAuthRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/home"
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error("Error in middleware:", error)
    // If there's an error with Supabase, just continue without redirecting
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
