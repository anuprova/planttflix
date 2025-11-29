"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyNursery } from "@/hooks/lib/UseNursery";
import { useNurseryOrders, useUpdateOrderStatus } from "@/hooks/lib/UseOrders";
import { useOrderItems } from "@/hooks/lib/UseOrderItems";
import { useUpdateStock } from "@/hooks/lib/UseProduct";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ChevronDown, ChevronUp, Package } from "lucide-react";
import { toast } from "sonner";

export default function OrdersPage() {
  const { user } = useAuth();
  const { data: nursery, isLoading: nurseryLoading } = useMyNursery(user?.$id);
  const { data: ordersData, isLoading: ordersLoading } = useNurseryOrders(nursery?.$id || "");
  const updateStatus = useUpdateOrderStatus();
  const updateStock = useUpdateStock();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // 1. Update status
      await updateStatus.mutateAsync({ orderId, newStatus });

      // 2. If cancelled, restore stock
      if (newStatus === "cancelled") {
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
            quantityChange: item.quantity // Add back quantity
          })
        ));

        toast.success("Order cancelled and stock restored!");
      } else {
        toast.success("Order status updated!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

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

  if (nurseryLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  if (!nursery) {
    return (
      <div className="p-6 text-center text-gray-500">
        <h2 className="text-xl font-bold">Nursery Not Found</h2>
        <p>Please contact support or ensure your account is set up correctly.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📦 Order Management</h1>
        <div className="text-sm text-gray-500">
          Total Orders: <span className="font-bold text-gray-800">{ordersData?.total || 0}</span>
        </div>
      </div>

      {ordersData?.documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
            <p className="text-gray-500">Orders from customers will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ordersData?.documents.map((order) => (
            <OrderCard
              key={order.$id}
              order={order}
              isExpanded={expandedOrder === order.$id}
              onToggleExpand={() => setExpandedOrder(expandedOrder === order.$id ? null : order.$id)}
              onStatusChange={handleStatusChange}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  isExpanded,
  onToggleExpand,
  onStatusChange,
  getStatusColor,
}: any) {
  const { data: orderItems, isLoading: itemsLoading } = useOrderItems(isExpanded ? order.$id : "");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Order #{order.orderNumber || order.$id.substring(0, 8)}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.$createdAt).toLocaleDateString()} at {new Date(order.$createdAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-green-700">₹{order.totalAmount}</p>
            </div>

            <button
              onClick={onToggleExpand}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Customer</p>
            <p className="font-semibold text-gray-800">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.customerEmail}</p>
            <p className="text-sm text-gray-600">{order.customerPhone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
            <p className="text-sm text-gray-700">{order.shippingAddress}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Order Status</p>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.$id, e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border font-semibold text-sm uppercase tracking-wider ${getStatusColor(order.status)}`}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-gray-800 mb-4">Order Items</h4>
            {itemsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-green-600" size={32} />
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems?.map((item: any) => (
                  <div
                    key={item.$id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{item.subtotal}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
