"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/lib/UseUserOrders";
import { Package, ShoppingBag, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
    const { user } = useAuth();
    const { data: ordersData, isLoading } = useUserOrders(user?.$id);

    // Convert ordersData to array (Appwrite returns DocumentList with .documents property)
    const orders = ordersData?.documents || [];

    const stats = [
        {
            name: "Total Orders",
            value: orders.length || 0,
            icon: Package,
            color: "bg-blue-500",
        },
        {
            name: "Pending",
            value: orders.filter((o: any) => o.status === "pending").length || 0,
            icon: Clock,
            color: "bg-yellow-500",
        },
        {
            name: "Completed",
            value: orders.filter((o: any) => o.status === "delivered").length || 0,
            icon: CheckCircle2,
            color: "bg-green-500",
        },
    ];

    const recentOrders = orders.slice(0, 5);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-purple-100 text-purple-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 sm:p-8 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-green-100">
                    Here's what's happening with your orders today
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.name}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/shop"
                    className="bg-white rounded-xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                            <ShoppingBag className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Continue Shopping</h3>
                            <p className="text-sm text-gray-500">Browse our plant collection</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/user/orders"
                    className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">View All Orders</h3>
                            <p className="text-sm text-gray-500">Track your purchases</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Orders
                        </h3>
                        <Link
                            href="/user/orders"
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No orders yet</p>
                        <Link
                            href="/shop"
                            className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {recentOrders.map((order: any) => (
                            <div
                                key={order.$id}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="font-semibold text-gray-900">
                                                Order #{order.$id.slice(-8)}
                                            </p>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            {new Date(order.$createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        {(order.shippingAddress || order.shipping_address || order.address) && (
                                            <p className="text-xs text-gray-400 truncate max-w-md" title={order.shippingAddress || order.shipping_address || order.address}>
                                                📍 {order.shippingAddress || order.shipping_address || order.address}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                ₹{(order.totalAmount || order.total_amount || order.amount || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/user/orders`}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
