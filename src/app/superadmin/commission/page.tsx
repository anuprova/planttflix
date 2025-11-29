"use client";

import { useSuperAdminStats } from "@/hooks/lib/UseSuperAdmin";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Loader2, DollarSign, Settings, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CommissionPage() {
    const { data: stats, isLoading } = useSuperAdminStats();
    const [commissionRate, setCommissionRate] = useState(10); // Default 10%
    const [isSaving, setIsSaving] = useState(false);

    // Load saved rate from localStorage on mount (simulating DB fetch)
    useEffect(() => {
        const savedRate = localStorage.getItem("globalCommissionRate");
        if (savedRate) {
            setCommissionRate(parseFloat(savedRate));
        }
    }, []);

    const handleSaveRate = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save to localStorage for persistence in this demo
        localStorage.setItem("globalCommissionRate", commissionRate.toString());

        toast.success("Global commission rate updated successfully!");
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-green-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">💰 Commission Management</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Total Earnings Card */}
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-100">
                            <DollarSign className="w-6 h-6" />
                            Total Commission Earned
                        </CardTitle>
                        <CardDescription className="text-blue-200">
                            Cumulative earnings from all platform orders.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold mt-2">₹{stats?.totalCommission?.toLocaleString()}</p>
                        <p className="text-sm text-blue-200 mt-4">
                            Based on {stats?.totalOrders} total orders processed.
                        </p>
                    </CardContent>
                </Card>

                {/* Settings Card */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-800">
                            <Settings className="w-6 h-6 text-gray-600" />
                            Global Commission Settings
                        </CardTitle>
                        <CardDescription>
                            Set the default commission percentage deducted from each order.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commission Rate (%)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={commissionRate}
                                        onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <span className="text-gray-500 font-bold">%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    This rate will be applied to all new orders created after this update.
                                </p>
                            </div>

                            <button
                                onClick={handleSaveRate}
                                disabled={isSaving}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Update Rate
                                    </>
                                )}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
