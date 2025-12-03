"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/lib/UseUserOrders";
import { useUpdateOrderStatus } from "@/hooks/lib/UseOrders";
import {
    Package,
    ChevronDown,
    ChevronUp,
    XCircle,
    Loader2,
    Calendar,
    MapPin,
    CreditCard,
} from "lucide-react";
import { toast } from "sonner";

export default function UserOrdersPage() {
    const { user } = useAuth();
    const { data: ordersData, isLoading } = useUserOrders(user?.$id);
    const updateStatus = useUpdateOrderStatus();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Convert ordersData to array (Appwrite returns DocumentList with .documents property)
    const orders = ordersData?.documents || [];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "processing":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "shipped":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
            await updateStatus.mutateAsync({ orderId, newStatus: "cancelled" });
            toast.success("Order cancelled successfully");
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Failed to cancel order");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
                <p className="text-gray-500 mt-1">
                    Track and manage your plant orders
                </p>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No orders yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Start shopping to see your orders here
                    </p>
                    <a
                        href="/shop"
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Browse Plants
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <div
                            key={order.$id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Order Header */}
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.$id.slice(-8).toUpperCase()}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(order.$createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <CreditCard className="w-4 h-4" />
                                                <span>{order.payment_method || "Online Payment"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                ₹{(order.totalAmount || order.total_amount || order.amount || 0).toLocaleString()}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setExpandedOrder(
                                                    expandedOrder === order.$id ? null : order.$id
                                                )
                                            }
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            {expandedOrder === order.$id ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Order Details */}
                            {expandedOrder === order.$id && (
                                <div className="border-t border-gray-200 bg-gray-50 p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Shipping Address */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Shipping Address
                                            </h4>
                                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                <p className="text-gray-700">
                                                    {order.shippingAddress || order.shipping_address || order.address || "No address provided"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Actions */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Actions
                                            </h4>
                                            {order.status === "pending" && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.$id)}
                                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                    Cancel Order
                                                </button>
                                            )}
                                            {order.status === "cancelled" && (
                                                <p className="text-red-600 font-medium">
                                                    This order has been cancelled
                                                </p>
                                            )}
                                            {order.status === "delivered" && (
                                                <p className="text-green-600 font-medium">
                                                    ✓ Order delivered successfully
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
