"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/lib/UseUserOrders";
import { useOrderItems } from "@/hooks/lib/UseOrderItems";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/lib/UseUserProfile";
import { useUpdateOrderStatus } from "@/hooks/lib/UseOrders";
import { useUpdateStock } from "@/hooks/lib/UseProduct";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, User, Package, Edit2, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const { data: userProfile, isLoading: profileLoading } = useUserProfile(user?.email);
    const { data: ordersData, isLoading: ordersLoading } = useUserOrders(user?.$id);
    const updateProfile = useUpdateUserProfile();
    const updateStatus = useUpdateOrderStatus();
    const updateStock = useUpdateStock();

    const [isEditing, setIsEditing] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        address: "",
    });

    // Update profileData when userProfile loads
    useEffect(() => {
        if (userProfile) {
            setProfileData({
                name: userProfile.name || user?.name || "",
                phone: userProfile.phone || "",
                address: userProfile.address || "",
            });
        } else if (user) {
            setProfileData({
                name: user.name || "",
                phone: "",
                address: "",
            });
        }
    }, [userProfile, user]);

    const handleSaveProfile = async () => {
        if (!user) return;

        try {
            await updateProfile.mutateAsync({
                email: user.email,
                data: profileData,
            });
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
            // 1. Update status to cancelled
            await updateStatus.mutateAsync({ orderId, newStatus: "cancelled" });

            // 2. Restore stock
            const { databases, DATABASE_ID, ORDER_ITEMS_COLLECTION_ID } = await import("@/lib/Appwrite.config");
            const { Query } = await import("appwrite");

            // Fetch items for this order
            const itemsResponse = await databases.listDocuments(
                DATABASE_ID,
                ORDER_ITEMS_COLLECTION_ID,
                [Query.equal("orderid", orderId)]
            );

            // Restore stock for each item
            await Promise.all(itemsResponse.documents.map(item =>
                updateStock.mutateAsync({
                    productId: item.productid,
                    quantityChange: item.quantity
                })
            ));

            toast.success("Order cancelled successfully");
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Failed to cancel order");
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Please log in to view your dashboard</p>
            </div>
        );
    }

    if (profileLoading || ordersLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-green-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">👤 My Dashboard</h1>
                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to logout?")) {
                                logout();
                            }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Profile Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <User size={24} />
                            Profile Information
                        </CardTitle>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                <Edit2 size={16} />
                                Edit Profile
                            </button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={updateProfile.isPending}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setProfileData({
                                                name: userProfile?.name || user.name,
                                                phone: userProfile?.phone || "",
                                                address: userProfile?.address || "",
                                            });
                                        }}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-800">{userProfile?.name || user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-800">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold text-gray-800">{userProfile?.phone || "Not provided"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-semibold text-gray-800">{userProfile?.address || "Not provided"}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Order History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package size={24} />
                            Order History ({ordersData?.total || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {ordersData?.documents.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="mx-auto mb-4 text-gray-400" size={64} />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                                <p className="text-gray-500">Start shopping to see your orders here!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ordersData?.documents.map((order: any) => (
                                    <OrderCard
                                        key={order.$id}
                                        order={order}
                                        isExpanded={expandedOrder === order.$id}
                                        onToggleExpand={() => setExpandedOrder(expandedOrder === order.$id ? null : order.$id)}
                                        onCancelOrder={handleCancelOrder}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function OrderCard({ order, isExpanded, onToggleExpand, onCancelOrder }: any) {
    const { data: orderItems, isLoading: itemsLoading } = useOrderItems(isExpanded ? order.$id : "");

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
        <div className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition" onClick={onToggleExpand}>
                <div className="flex-1">
                    <p className="font-semibold text-gray-800">Order #{order.orderNumber || order.$id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.$createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-green-700">₹{order.totalAmount}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 border-t">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800">Order Items</h4>
                        {order.status === "pending" && (
                            <button
                                onClick={() => onCancelOrder(order.$id)}
                                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition"
                            >
                                <XCircle size={16} />
                                Cancel Order
                            </button>
                        )}
                    </div>
                    {itemsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-green-600" size={32} />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orderItems?.map((item: any) => (
                                <div key={item.$id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg group">
                                    <Link href={`/shop/${item.productid}`} className="block shrink-0">
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded-lg group-hover:opacity-80 transition"
                                        />
                                    </Link>
                                    <div className="flex-1">
                                        <Link href={`/shop/${item.productid}`} className="font-semibold text-gray-800 hover:text-green-600 transition block">
                                            {item.productName}
                                        </Link>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity} × ₹{item.price}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">₹{item.subtotal}</p>
                                        <Link href={`/shop/${item.productid}`} className="text-xs text-green-600 hover:underline mt-1 block">
                                            View Product
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
