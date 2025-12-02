import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    console.log(`[Middleware] Processing: ${pathname}`);

    // Get cookies
    const token = request.cookies.get("app_session")?.value;
    const role = request.cookies.get("role")?.value;

    console.log(`[Middleware] Token exists: ${!!token}, Role: ${role || "none"}`);

    // Public routes that don't need authentication
    const publicRoutes = ["/", "/about", "/contact", "/shop"];
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith("/shop/"));
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    // If user is logged in and trying to access auth pages, redirect to appropriate dashboard
    if (token && isAuthPage) {
      console.log(`[Middleware] Logged in user accessing auth page, redirecting to dashboard`);
      const dashboardPath = role?.toLowerCase() === "superadmin" 
        ? "/superadmin" 
        : role?.toLowerCase() === "nurseryadmin"
        ? "/nurseryadmin"
        : "/user/dashboard";
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Protected routes for unauthenticated users
    const protectedPaths = ["/user", "/superadmin", "/nurseryadmin"];
    const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtectedRoute && !token) {
      console.log(`[Middleware] Unauthenticated access to protected route, redirecting to login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based access control
    if (token && role) {
      const normalizedRole = role.toLowerCase();
      
      // Superadmin routes
      if (pathname.startsWith("/superadmin") && normalizedRole !== "superadmin") {
        console.log(`[Middleware] Non-superadmin accessing superadmin route`);
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Nurseryadmin routes
      if (pathname.startsWith("/nurseryadmin") && normalizedRole !== "nurseryadmin") {
        console.log(`[Middleware] Non-nurseryadmin accessing nurseryadmin route`);
        return NextResponse.redirect(new URL("/", request.url));
      }

      // User routes - allow all authenticated users
      if (pathname.startsWith("/user") && !["user", "superadmin", "nurseryadmin"].includes(normalizedRole)) {
        console.log(`[Middleware] Invalid role accessing user route`);
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    console.log(`[Middleware] Request allowed`);
    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Error:", error);
    // Allow request to continue even if middleware fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
