
import type { ReactNode } from "react";
import Link from "next/link";
import NurseryadminNavbar from "./_components/NurseryadminNavbar";
import { Leaf } from "lucide-react";

export default function NurseryAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-green-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-6">
          <Leaf size={26} className="text-lime-300" />

          <h2 className="text-2xl font-bold text-white">Nursery Admin</h2>
        </div>

        <nav className="space-y-4">
          <Link href="/" className="block text-white hover:text-green-600">
            Home
          </Link>

          <Link href="/nurseryadmin" className="block text-white hover:text-green-600">
            Dashboard
          </Link>

          <Link href="/nurseryadmin/addproduct" className="block text-white hover:text-green-600">
            Add Plant
          </Link>

          <Link href="/nurseryadmin/orders" className="block text-white hover:text-green-600">
            Orders
          </Link>


          <Link href="/nurseryadmin/inventory" className="block text-white hover:text-green-600">
            Inventory
          </Link>

          <Link href="/nurseryadmin/analytics" className="block text-white hover:text-green-600">
            Analytics
          </Link>

          <Link href="/nurseryadmin/setup-nursery" className="block text-white hover:text-green-600">
            Setup Nursery
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar Component */}

        <NurseryadminNavbar />
        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
