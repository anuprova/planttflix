"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyNursery } from "@/hooks/lib/UseNursery";
import { useNurseryOrders } from "@/hooks/lib/UseOrders";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, TrendingUp, Award } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

export default function AnalyticsPage() {
    const { user } = useAuth();
    const { data: nursery, isLoading: nurseryLoading } = useMyNursery(user?.$id);
    const { data: ordersData, isLoading: ordersLoading } = useNurseryOrders(nursery?.$id || "");

    const [salesData, setSalesData] = useState<any[]>([]);
    const [popularPlants, setPopularPlants] = useState<any[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        const calculateStats = async () => {
            if (!ordersData || !ordersData.documents) return;

            setIsLoadingStats(true);

            // 1. Calculate Sales Trends (Last 7 Days)
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0];
            }).reverse();

            const salesMap = new Map();
            last7Days.forEach(date => salesMap.set(date, 0));

            ordersData.documents.forEach((order: any) => {
                const orderDate = new Date(order.$createdAt).toISOString().split('T')[0];
                if (salesMap.has(orderDate)) {
                    salesMap.set(orderDate, salesMap.get(orderDate) + order.totalAmount);
                }
            });

            const chartData = Array.from(salesMap.entries()).map(([date, total]) => ({
                date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                total
            }));

            setSalesData(chartData);

            // 2. Calculate Popular Plants
            // Note: Ideally we should fetch all order items, but for now we'll fetch items for the recent 20 orders to avoid N+1 issues
            // In a real app, we'd have a dedicated aggregation query or backend function
            const recentOrders = ordersData.documents.slice(0, 20);
            const productCounts = new Map();

            try {
                const { databases, DATABASE_ID, ORDER_ITEMS_COLLECTION_ID } = await import("@/lib/Appwrite.config");
                const { Query } = await import("appwrite");

                // We have to fetch items for each order. 
                // Optimization: Fetch all items for these orders in parallel
                const itemsPromises = recentOrders.map(order =>
                    databases.listDocuments(
                        DATABASE_ID,
                        ORDER_ITEMS_COLLECTION_ID,
                        [Query.equal("orderid", order.$id)]
                    )
                );

                const itemsResponses = await Promise.all(itemsPromises);

                itemsResponses.forEach(response => {
                    response.documents.forEach((item: any) => {
                        const current = productCounts.get(item.productName) || {
                            name: item.productName,
                            count: 0,
                            image: item.productImage,
                            revenue: 0
                        };
                        productCounts.set(item.productName, {
                            ...current,
                            count: current.count + item.quantity,
                            revenue: current.revenue + item.subtotal
                        });
                    });
                });

                const sortedProducts = Array.from(productCounts.values())
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setPopularPlants(sortedProducts);

            } catch (error) {
                console.error("Error calculating popular plants:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };

        if (ordersData) {
            calculateStats();
        }
    }, [ordersData]);

    if (nurseryLoading || ordersLoading || isLoadingStats) {
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
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">📊 Analytics Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Trends Chart */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-800">
                            <TrendingUp className="text-green-600" />
                            Sales Trends (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) => [`₹${value}`, 'Revenue']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                    {salesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#16a34a" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Popular Plants List */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-800">
                            <Award className="text-yellow-500" />
                            Top Selling Plants
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {popularPlants.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No sales data available yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {popularPlants.map((plant, index) => (
                                    <div key={plant.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                                            #{index + 1}
                                        </div>
                                        <img
                                            src={plant.image}
                                            alt={plant.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{plant.name}</p>
                                            <p className="text-xs text-gray-500">{plant.count} sold</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-700">₹{plant.revenue}</p>
                                            <p className="text-xs text-gray-400">Revenue</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
