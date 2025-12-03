"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useNurseryOrders } from "@/hooks/lib/UseOrders";
import { useAllProducts } from "@/hooks/lib/UseProduct";
import { useMyNursery } from "@/hooks/lib/UseNursery";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ChevronRight,
  Store
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function NurseryAdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Client-side protection
  useEffect(() => {
    if (!loading && (!user || user.role?.toLowerCase() !== "nurseryadmin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // 1. Fetch Nursery Details first
  const { data: nursery, isLoading: nurseryLoading } = useMyNursery(user?.$id);

  // 2. Fetch Orders using the correct Nursery ID
  const { data: ordersData, isLoading: ordersLoading } = useNurseryOrders(nursery?.$id || "");

  // 3. Fetch Products (we'll filter for this nursery)
  const { data: allProducts, isLoading: productsLoading } = useAllProducts();

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [inventory, setInventory] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    if (ordersData && ordersData.documents) {
      // Calculate Revenue & Orders
      const revenue = ordersData.documents.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      setTotalRevenue(revenue);
      setTotalOrders(ordersData.total);
    }

    if (allProducts && nursery) {
      // Filter products for this nursery using the correct nursery ID
      const myProducts = allProducts.filter((p: any) => p.nurseryid === nursery.$id);

      setTotalProducts(myProducts.length);

      // Inventory
      const invData = myProducts.map((p: any) => ({
        name: p.name,
        stock: p.stock || 0,
      }));
      setInventory(invData);

      // Low Stock
      setLowStock(invData.filter((p: any) => p.stock < 10));
    }
  }, [ordersData, allProducts, nursery]);

  if (nurseryLoading || ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!nursery) {
    return (
      <div className="p-6 text-center text-gray-500">
        <h2 className="text-xl font-bold">Nursery Not Found</h2>
        <p>Please contact support or ensure your account is set up correctly.</p>
      </div>
    )
  }

  const stats = [
    {
      name: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      name: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      name: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || "Nursery Admin"}! 🌿
        </h1>
        <p className="text-gray-500">
          Here's what's happening with <span className="font-semibold text-green-600">{nursery.name}</span> today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Recent Orders
            </h2>
            <Link
              href="/nurseryadmin/orders"
              className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {ordersData?.documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersData?.documents.slice(0, 5).map((order) => (
                  <div
                    key={order.$id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
                        🛒
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.customerName || "Guest"}
                        </p>
                        <p className="text-xs text-gray-500">
                          #{order.orderNumber || order.$id.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Inventory Status
            </h2>
            <Link
              href="/nurseryadmin/inventory"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Manage <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {inventory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No products in inventory</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {inventory.slice(0, 6).map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.stock < 10 ? "bg-red-500" : "bg-green-500"}`} />
                      <p className="font-medium text-gray-700 truncate max-w-[150px] sm:max-w-[200px]">
                        {item.name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${item.stock < 10
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      {item.stock} in stock
                    </span>
                  </div>
                ))}

                {lowStock.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Low Stock Alert ({lowStock.length})
                    </h4>
                    <div className="space-y-1">
                      {lowStock.slice(0, 3).map((p) => (
                        <div key={p.name} className="flex justify-between text-xs text-red-600">
                          <span>{p.name}</span>
                          <span className="font-bold">{p.stock} left</span>
                        </div>
                      ))}
                      {lowStock.length > 3 && (
                        <p className="text-xs text-red-500 mt-1 italic">
                          + {lowStock.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
