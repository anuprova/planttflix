"use client";

import { useSuperAdminStats, useAllOrders, useAllNurseries } from "@/hooks/lib/UseSuperAdmin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, TrendingUp, DollarSign, Store } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useMemo } from "react";

export default function SuperAdminAnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useSuperAdminStats();
  const { data: ordersData, isLoading: ordersLoading } = useAllOrders();
  const { data: nurseries, isLoading: nurseriesLoading } = useAllNurseries();

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

  // Process Data for Charts
  const chartData = useMemo(() => {
    if (!ordersData) return [];

    // Group by date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = ordersData.documents.filter((o: any) =>
        o.$createdAt.startsWith(date)
      );

      const revenue = dayOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
      const commission = dayOrders.reduce((sum: number, o: any) => sum + (o.commissionAmount || 0), 0);

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
        commission
      };
    });
  }, [ordersData]);

  // Top Performing Nurseries
  const topNurseries = useMemo(() => {
    if (!ordersData) return [];

    const nurseryRevenue: Record<string, number> = {};

    ordersData.documents.forEach((order: any) => {
      if (order.nurseryid) {
        nurseryRevenue[order.nurseryid] = (nurseryRevenue[order.nurseryid] || 0) + (order.totalAmount || 0);
      }
    });

    return Object.entries(nurseryRevenue)
      .map(([id, revenue]) => ({
        id,
        name: nurseryMap.get(id) || "Unknown Nursery", // Use Name from Map
        revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [ordersData, nurseryMap]);

  if (statsLoading || ordersLoading || nurseriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">📊 Analytics Dashboard</h1>

      {/* Global Sales Trends */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-600" /> Global Sales Trends (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="commission" stroke="#3b82f6" strokeWidth={3} name="Commission" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Performing Nurseries */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="text-purple-600" /> Top Performing Nurseries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topNurseries.map((nursery, index) => (
                <div key={nursery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-green-600'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{nursery.name}</p>
                      <p className="text-xs text-gray-500">Revenue Generated</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-700">₹{nursery.revenue.toLocaleString()}</span>
                </div>
              ))}
              {topNurseries.length === 0 && (
                <p className="text-center text-gray-500 py-4">No data available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for Popular Plants */}
        <Card className="shadow-md opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-500">
              <DollarSign className="text-gray-400" /> Popular Plants (Coming Soon)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px] text-gray-400">
            Requires detailed order item analysis.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
