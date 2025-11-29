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
  const token = request.cookies.get("session")?.value || null;
  const role = request.cookies.get("role")?.value || null;

  const { pathname } = request.nextUrl;

  console.log("Middleware Role:", role);
  console.log("Middleware Token:", token);

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
  // 2️⃣ AUTHENTICATED USER REDIRECT LOGIC
  // --------------------------------------

  // If User logs in → take them to /shop
  if (role === "user") {
    if (pathname.startsWith("/superadmin") || pathname.startsWith("/nurseryadmin")) {
      return NextResponse.redirect(new URL("/shop", request.url));
    }
    return NextResponse.next();
  }

  // If NurseryAdmin logs in → take them to nurseryadmin dashboard
  if (role === "nurseryadmin") {
    if (pathname.startsWith("/superadmin")) {
      // Nursery admin cannot access superadmin pages
      return NextResponse.redirect(new URL("/nurseryadmin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // If SuperAdmin logs in → take them to superadmin dashboard
  if (role === "superadmin") {
    // superadmin should not be forced into nurseryadmin-only pages
    return NextResponse.next();
  }

  // If role is unknown
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/nurseryadmin/:path*",
    "/superadmin/:path*",
    "/dashboard/:path*",
  ],
};
