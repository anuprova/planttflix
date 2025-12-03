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

  const token = request.cookies.get("app_session")?.value;
  const role = request.cookies.get("role")?.value;

  console.log(`[Middleware] Cookies - Token: ${!!token}, Role: ${role}`);

  // Public routes - always allow
  const publicPaths = ["/", "/about", "/contact", "/shop", "/login", "/signup"];
  if (publicPaths.some(path => pathname === path || pathname.startsWith("/shop/"))) {
    console.log(`[Middleware] Public path - allowing`);
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (pathname.startsWith("/user") || pathname.startsWith("/superadmin") || pathname.startsWith("/nurseryadmin")) {
    // No token? Redirect to login
    if (!token) {
      console.log(`[Middleware] No token - redirecting to login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Has token but no role? Allow (role might be set after middleware runs)
    if (!role) {
      console.log(`[Middleware] Token exists but no role - allowing`);
      return NextResponse.next();
    }

    // Role-based access
    const normalizedRole = role.toLowerCase();
    
    if (pathname.startsWith("/superadmin") && normalizedRole !== "superadmin") {
      console.log(`[Middleware] Wrong role for superadmin`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/nurseryadmin") && normalizedRole !== "nurseryadmin") {
      console.log(`[Middleware] Wrong role for nurseryadmin`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log(`[Middleware] Authenticated - allowing`);
    return NextResponse.next();
  }

  // Default: allow
  console.log(`[Middleware] Default - allowing`);
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
