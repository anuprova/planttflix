"use client";
import { useSuperAdminStats } from "@/hooks/lib/UseSuperAdmin";
import { Loader2, TrendingUp, Users, Store, ShoppingBag, DollarSign, Package } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: stats, isLoading } = useSuperAdminStats();

  // Client-side protection
  useEffect(() => {
    if (!loading && (!user || user.role?.toLowerCase() !== "superadmin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      name: "Commission Earned",
      value: `₹${stats?.totalCommission?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      name: "Total Nurseries",
      value: stats?.totalNurseries || 0,
      icon: Store,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      name: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, {user?.name || "Super Admin"}! 👑
        </h2>
        <p className="text-green-100">
          Here's an overview of the platform's performance today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            Recent Orders
          </h3>
          <Link
            href="/superadmin/orders"
            className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
          >
            View all orders →
          </Link>
        </div>

        <div className="divide-y divide-gray-200">
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order: any) => (
              <div
                key={order.$id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.customerName || "Unknown Customer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order #{order.orderNumber || order.$id.substring(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.$createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No recent orders</h3>
              <p className="text-gray-500 mt-1">New orders will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
