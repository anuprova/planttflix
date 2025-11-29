"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNurseryOrders } from "@/hooks/lib/UseOrders";
import { useAllProducts } from "@/hooks/lib/UseProduct";
import { useMyNursery } from "@/hooks/lib/UseNursery";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function NurseryAdminDashboard() {
  const { user } = useAuth();

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
    )
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">🌱 {nursery.name || "Nursery"} Dashboard</h1>

      {/* ======================
            TOP METRIC CARDS
      ======================= */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-100 font-medium text-sm uppercase tracking-wider">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-l-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-800">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-l-4 border-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-800">{totalProducts}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ======================
              RECENT ORDERS
        ======================= */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">🛒 Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersData?.documents.length === 0 ? (
              <p className="text-gray-500 italic">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {ordersData?.documents.slice(0, 5).map((order) => (
                  <div
                    key={order.$id}
                    className="p-4 rounded-xl border border-gray-100 flex justify-between items-center bg-gray-50 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{order.customerName || "Guest"}</p>
                      <p className="text-xs text-gray-500">Order #{order.orderNumber || order.$id.substring(0, 8)}</p>
                      <p className="text-xs text-gray-400">{new Date(order.$createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-green-700 text-lg">
                        ₹{order.totalAmount}
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ======================
              INVENTORY STATUS
        ======================= */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">📦 Inventory Levels</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {inventory.length === 0 ? (
              <p className="text-gray-500 italic">No products found.</p>
            ) : (
              inventory.map((item) => (
                <div
                  key={item.name}
                  className="p-3 border-b border-gray-100 flex justify-between items-center last:border-0"
                >
                  <p className="font-medium text-gray-700">{item.name}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.stock < 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                    {item.stock} in stock
                  </span>
                </div>
              ))
            )}

            {lowStock.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl mt-6">
                <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                  ⚠ Low Stock Alert
                </h4>
                <div className="space-y-1">
                  {lowStock.map((p) => (
                    <p key={p.name} className="text-sm text-red-600 flex justify-between">
                      <span>{p.name}</span>
                      <span className="font-bold">{p.stock} left</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
