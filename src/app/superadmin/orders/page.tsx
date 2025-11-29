"use client";

import { useAllOrders, useAllNurseries, useUpdateOrderDetails } from "@/hooks/lib/UseSuperAdmin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Search, Package, ChevronDown, ChevronUp, Pencil, X, Save } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function GlobalOrdersPage() {
  const { data: ordersData, isLoading: ordersLoading } = useAllOrders();
  const { data: nurseries, isLoading: nurseriesLoading } = useAllNurseries();
  const updateOrder = useUpdateOrderDetails();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    status: ""
  });

  // Create a map of Nursery ID -> Nursery Name
  const nurseryMap = useMemo(() => {
    const map = new Map();
    if (nurseries) {
      nurseries.forEach((n: any) => {
        map.set(n.$id, n.name || "Unknown Nursery");
      });
    }
    return map;
  }, [nurseries]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder.mutateAsync({ orderId, data: { status: newStatus } });
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const openEditModal = (order: any) => {
    setEditingOrder(order);
    setEditForm({
      customerName: order.customerName || "",
      customerEmail: order.customerEmail || "",
      customerPhone: order.customerPhone || "",
      shippingAddress: order.shippingAddress || "",
      status: order.status || "pending"
    });
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      await updateOrder.mutateAsync({
        orderId: editingOrder.$id,
        data: editForm
      });
      toast.success("Order details updated successfully!");
      setEditingOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order details.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredOrders = ordersData?.documents.filter((order: any) =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.$id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (ordersLoading || nurseriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">🌍 Global Orders</h1>
        <div className="text-sm text-gray-500">
          Total Orders: <span className="font-bold text-gray-800">{ordersData?.total || 0}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search order #, customer, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No orders found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order: any) => (
            <Card key={order.$id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50 border-b py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-gray-500 bg-white px-2 py-1 border rounded">
                      {order.orderNumber || order.$id.substring(0, 8)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(order.$createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-700">₹{order.totalAmount}</span>

                    <button
                      onClick={() => openEditModal(order)}
                      className="p-1 hover:bg-blue-100 text-blue-600 rounded transition"
                      title="Edit Order"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.$id ? null : order.$id)}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      {expandedOrder === order.$id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Customer</p>
                    <p className="font-semibold text-gray-800">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Nursery</p>
                    <p className="font-semibold text-gray-700">{nurseryMap.get(order.nurseryid) || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Shipping To</p>
                    <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.$id, e.target.value)}
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

                {expandedOrder === order.$id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Commission: ₹{order.commissionAmount} ({order.commissionRate}%)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Edit Order Details</h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editForm.customerName}
                  onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={editForm.customerEmail}
                  onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                <input
                  type="tel"
                  value={editForm.customerPhone}
                  onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea
                  rows={3}
                  value={editForm.shippingAddress}
                  onChange={(e) => setEditForm({ ...editForm, shippingAddress: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateOrder.isPending}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  {updateOrder.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
