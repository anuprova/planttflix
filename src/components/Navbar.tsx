"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Sprout,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { account } from "@/lib/Appwrite.config";
import { useUserCart } from "@/hooks/lib/UseCart";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: cartItems = [] } = useUserCart(user?.$id || null);
  const totalQty = cartItems.reduce((s, it) => s + (it.quantity || 0), 0);

  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Check user on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const accountData = await account.get();

      // Try to fetch role from Authenticationtable
      try {
        const { tableDb } = await import("@/lib/Appwrite.config");
        const { Query } = await import("appwrite");

        const profile = await tableDb.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          tableId: "Authenticationtable",
          queries: [Query.equal("email", accountData.email)],
        });

        const role = profile?.rows?.[0]?.role || "User";
        setUser({ ...accountData, role });
      } catch (roleError) {
        console.warn("Could not fetch role:", roleError);
        setUser({ ...accountData, role: "User" });
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Top menu items
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close login dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        loginOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLoginOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [loginOpen]);

  // Logout handler
  async function handleLogout() {
    if (!confirm("Are you sure you want to logout?")) return;
    try {
      await account.deleteSession("current");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Get display name
  function getDisplayName() {
    if (loading) return "Loading...";
    if (!user) return "Login";
    return user.name || "User";
  }

  // Get role badge color
  function getRoleBadgeColor(role: string) {
    switch (role?.toLowerCase()) {
      case "superadmin":
        return "bg-red-100 text-red-700 border-red-200";
      case "nurseryadmin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  // Get dashboard path based on role
  function getDashboardPath() {
    switch (user?.role?.toLowerCase()) {
      case "nurseryadmin":
        return "/nurseryadmin";
      case "superadmin":
        return "/superadmin";
      default:
        return "/user/dashboard";
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "backdrop-blur-sm bg-green-500/90 shadow-lg border-b border-green-100"
        : "bg-green-700"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-3 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-md ring-1 ring-emerald-100">
            <Sprout className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="leading-tight">
            <span className="block text-3xl font-extrabold text-white tracking-tight">
              Plantflix
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="px-3 py-2 rounded-md text-lg font-medium text-white hover:text-emerald-700 hover:bg-emerald-50 transition transform hover:-translate-y-0.5"
            >
              {item.label}
            </Link>
          ))}

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLoginOpen((s) => !s)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white shadow-lg focus:outline-none transition-transform transform hover:scale-105"
              style={{ background: "linear-gradient(90deg,#2f855a,#4aa76b)" }}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">
                {getDisplayName()}
              </span>
              {user?.role && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/20 text-white`}>
                  {user.role}
                </span>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>

            {loginOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 p-2">
                {!user ? (
                  <>
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        router.push("/login");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-emerald-50 rounded-lg transition flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-emerald-600" /> Login
                    </button>
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        router.push("/signup");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-emerald-50 rounded-lg transition flex items-center gap-2 mt-1"
                    >
                      <User className="w-4 h-4 text-blue-600" /> Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    {/* Dashboard Link */}
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        router.push(getDashboardPath());
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-emerald-50 rounded-lg transition flex items-center gap-2 mt-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" /> Dashboard
                    </button>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 rounded-lg transition flex items-center gap-2 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/shop/cart"
            className="relative inline-flex items-center p-2 rounded-full bg-white/90 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-emerald-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-inner">
                {totalQty}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-[500px]" : "max-h-0"
          }`}
      >
        <ul className="flex flex-col px-6 py-4 space-y-3 bg-white/95 border-t border-gray-100">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className="block text-gray-700 hover:text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Cart */}
          <Link
            href="/shop/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
          >
            <span>Cart</span>
            <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
              {totalQty}
            </span>
          </Link>

          {/* Mobile Login / Logout */}
          {!user ? (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/login");
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl shadow-lg"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/signup");
                }}
                className="w-full px-4 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push(getDashboardPath());
                }}
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-3 bg-white border rounded-xl text-gray-700"
              >
                Logout
              </button>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
