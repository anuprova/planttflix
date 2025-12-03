import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // files with extensions
  ) {
    return NextResponse.next();
  }

  console.log(`[Middleware] Path: ${pathname}`);

  // Look for Appwrite session cookie instead of custom cookies
  const appwriteSession = request.cookies.get("a_session_69156882003887d9925c")?.value;
  
  // Also check for any cookie starting with "a_session_"
  const allCookies = request.cookies.getAll();
  const hasAppwriteSession = allCookies.some(cookie => cookie.name.startsWith("a_session_"));

  console.log(`[Middleware] Appwrite session exists: ${hasAppwriteSession}`);

  // Public routes - always allow
  const publicPaths = ["/", "/about", "/contact", "/shop", "/login", "/signup"];
  if (publicPaths.some(path => pathname === path || pathname.startsWith("/shop/"))) {
    console.log(`[Middleware] Public path - allowing`);
    return NextResponse.next();
  }

  // Protected routes - require Appwrite session
  if (pathname.startsWith("/user") || pathname.startsWith("/superadmin") || pathname.startsWith("/nurseryadmin")) {
    // No Appwrite session? Redirect to login
    if (!hasAppwriteSession) {
      console.log(`[Middleware] No Appwrite session - redirecting to login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Has session - allow access
    // Role checking will be done client-side in the dashboard pages
    console.log(`[Middleware] Appwrite session found - allowing`);
    return NextResponse.next();
  }

  // Default: allow
  console.log(`[Middleware] Default - allowing`);
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
