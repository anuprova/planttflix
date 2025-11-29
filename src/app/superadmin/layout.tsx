import type { ReactNode } from "react";
import Link from "next/link";
import SuperadminNavbar from "./_components/SuperadminNavbar";
import { TreeDeciduous } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-green-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-6">
          <TreeDeciduous size={26} className="text-lime-300" />

          <h2 className="text-2xl font-bold text-white">Super Admin</h2>
        </div>

        <nav className="space-y-4">
          <Link href="/" className="block text-white hover:text-green-400 transition-colors">
            Home
          </Link>

          <Link href="/superadmin" className="block text-white hover:text-green-400 transition-colors">
            Dashboard
          </Link>

          <Link href="/superadmin/users" className="block text-white hover:text-green-400 transition-colors">
            User Management
          </Link>

          <Link href="/superadmin/inventory" className="block text-white hover:text-green-400 transition-colors">
            Global Inventory
          </Link>

          <Link href="/superadmin/orders" className="block text-white hover:text-green-400 transition-colors">
            Global Orders
          </Link>

          <Link href="/superadmin/commission" className="block text-white hover:text-green-400 transition-colors">
            Commission
          </Link>

          <Link href="/superadmin/analytics" className="block text-white hover:text-green-400 transition-colors">
            Analytics
          </Link>
        </nav>
      </aside>


      <div className="flex-1">
        {/* Navbar Component */}
        <SuperadminNavbar />

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
