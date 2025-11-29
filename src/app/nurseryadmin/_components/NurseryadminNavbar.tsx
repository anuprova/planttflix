// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   ShoppingCart,
//   Sprout,
//   Menu,
//   X,
//   ChevronDown,
//   LogOut,
//   User
// } from "lucide-react";
// import { useCurrentUser, useLogout } from "@/hooks/lib/UseAuth";


// export default function NurseryadminNavbar() {
//   const [open, setOpen] = useState(false);
//   const [loginOpen, setLoginOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const router = useRouter();

//   // React Query Auth Hooks
//   const { data: user, isLoading: userLoading } = useCurrentUser();
//   const logoutMutation = useLogout();

//   // Safe role fetch (Appwrite user row should contain role field)
//   const role = user?.role || null;

//   // Top menu items
//   const menuItems = [
//     { label: "Home", path: "/" },
//     { label: "Shop", path: "/shop" },
//     { label: "About", path: "/about" },
//     { label: "Contact", path: "/contact" },
//   ];

//   // Scroll effect
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // Close login dropdown when clicking outside
//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (
//         loginOpen &&
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setLoginOpen(false);
//       }
//     }
//     document.addEventListener("click", handleClick);
//     return () => document.removeEventListener("click", handleClick);
//   }, [loginOpen]);

//   // Logout handler
//   function handleLogout() {
//     if (!confirm("Are you sure you want to logout?")) return;
//     logoutMutation.mutate(); // Appwrite logout + redirect
//   }

//   // Role label UI
//   function roleLabel() {
//     if (userLoading) return "...";
//     if (!user) return "Login";
//     if (role === "superadmin") return "SuperAdmin";
//     if (role === "nurseryadmin") return "NurseryAdmin";
//     return "User";
//   }

//   return (
//     <header
//       className={`sticky top-0 z-50 transition-all ${
//         scrolled
//           ? "backdrop-blur bg-white/80 shadow-md"
//           : "bg-transparent"
//       }`}
//     >
//       <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <Sprout className="w-7 h-7 text-green-600" />
//           <span className="text-2xl font-semibold text-green-700">
//             Plantflix
//           </span>
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-8">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               href={item.path}
//               className="text-gray-700 hover:text-green-600 transition"
//             >
//               {item.label}
//             </Link>
//           ))}

//           {/* Login Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setLoginOpen((s) => !s)}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-600 text-white"
//             >
//               <User className="w-4 h-4" />
//               <span>{roleLabel()}</span>
//               <ChevronDown className="w-4 h-4" />
//             </button>

//             {loginOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-2">
//                 {!user ? (
//                   <button
//                     onClick={() => router.push("/login")}
//                     className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg"
//                   >
//                     Login
//                   </button>
//                 ) : (
//                   <>
//                     <button
//                       onClick={() => {
//                         if (role === "superadmin")
//                           router.push("/superadmin/dashboard");
//                         else if (role === "nurseryadmin")
//                           router.push("/nurseryadmin/dashboard");
//                         else router.push("/user/dashboard");
//                       }}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg"
//                     >
//                       Dashboard
//                     </button>

//                     <button
//                       onClick={handleLogout}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg flex items-center gap-2"
//                     >
//                       <LogOut className="w-4 h-4" /> Logout
//                     </button>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Cart */}
//           <button className="relative p-2 hover:bg-gray-100 rounded-xl transition">
//             <ShoppingCart className="w-6 h-6 text-gray-700" />
//             <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//               3
//             </span>
//           </button>
//         </div>

//         {/* Mobile Menu Button */}
//         <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
//           {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
//         </button>
//       </nav>

//       {/* Mobile Menu */}
//       <div
//         className={`md:hidden overflow-hidden transition-all ${
//           open ? "max-h-[500px]" : "max-h-0"
//         }`}
//       >
//         <ul className="flex flex-col px-6 py-4 space-y-4">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               href={item.path}
//               onClick={() => setOpen(false)}
//               className="text-gray-700 hover:text-green-600"
//             >
//               {item.label}
//             </Link>
//           ))}

//           {/* Mobile Login / Logout */}
//           {!user ? (
//             <button
//               onClick={() => router.push("/login")}
//               className="w-full px-4 py-3 bg-green-600 text-white rounded-xl"
//             >
//               Login
//             </button>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="w-full px-4 py-3 bg-white border rounded-xl"
//             >
//               Logout
//             </button>
//           )}
//         </ul>
//       </div>
//     </header>
//   );
// }


"use client";


import { Bell, UserCircle } from "lucide-react";
import LogoutButton from "./NurseryadminlogoutButton";


export default function NurseryadminNavbar() {
  return (
    <div className="sticky top-0 z-30 bg-green-300 shadow-md border-b px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <h1 className="text-xl md:text-2xl font-bold text-green-700 tracking-wide">
        🌿 NurseryAdmin Panel
      </h1>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative">
          <Bell className="text-gray-600 hover:text-indigo-600" size={22} />
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* Profile Icon */}
        <button>
          <UserCircle className="text-gray-600 hover:text-indigo-600" size={28} />
        </button>

     
        <LogoutButton />
      </div>
    </div>
  );
}
