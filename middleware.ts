// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// export function middleware(request: NextRequest) {
//   const role = request.cookies?.get("role")?.value
  
// const token = request.cookies.get("session")?.value;

//   // const token = request.cookies.get("session")?.value;
// // const token = request.local
//   console.log("middleware token", token);
//   const { pathname } = request.nextUrl;
//   if (pathname.startsWith("/nurseryadmin") && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (pathname.startsWith("/nurseryadmin/addproduct")) {
//     if (role !== "admin") {
//     return NextResponse.redirect(new URL("/nurseryadmin/products", request.url));
//     }
//   }


//   return NextResponse.next();
// }
// export const config = { matcher: ["/nurseyadmin/:path*"] };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("app_session")?.value || null;
  const role = request.cookies.get("role")?.value || null;

  const { pathname } = request.nextUrl;

  console.log("Middleware Role:", role);
  console.log("Middleware Token:", token);
  console.log("Middleware Path:", pathname);

  // Normalize role to lowercase for comparison
  const normalizedRole = role?.toLowerCase();

  // --------------------------------------
  // 1️⃣ UNAUTHENTICATED USERS
  // --------------------------------------
  if (!token) {
    // If user tries to access admin routes without login → redirect to login
    if (pathname.startsWith("/nurseryadmin") || pathname.startsWith("/superadmin")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // normal users can browse normally
    return NextResponse.next();
  }

  // --------------------------------------
  // 2️⃣ AUTHENTICATED USERS - Redirect from login/signup pages
  // --------------------------------------
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    // User is already logged in, redirect to their dashboard
    if (normalizedRole === "superadmin") {
      return NextResponse.redirect(new URL("/superadmin", request.url));
    } else if (normalizedRole === "nurseryadmin") {
      return NextResponse.redirect(new URL("/nurseryadmin", request.url));
    } else {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  // --------------------------------------
  // 3️⃣ AUTHENTICATED USER ROLE-BASED ACCESS CONTROL
  // --------------------------------------

  // If User logs in → prevent access to admin routes
  if (normalizedRole === "user") {
    if (pathname.startsWith("/superadmin") || pathname.startsWith("/nurseryadmin")) {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // If NurseryAdmin logs in → prevent access to superadmin routes
  if (normalizedRole === "nurseryadmin") {
    if (pathname.startsWith("/superadmin")) {
      // Nursery admin cannot access superadmin pages
      return NextResponse.redirect(new URL("/nurseryadmin", request.url));
    }
    return NextResponse.next();
  }

  // If SuperAdmin logs in → allow access to all routes
  if (normalizedRole === "superadmin") {
    return NextResponse.next();
  }

  // If role is unknown or invalid
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/nurseryadmin/:path*",
    "/superadmin/:path*",
    "/user/:path*",
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};
