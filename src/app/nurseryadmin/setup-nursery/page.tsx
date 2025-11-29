"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { databases, DATABASE_ID, NURSERIES_COLLECTION_ID, ID } from "@/lib/Appwrite.config";
import { useRouter } from "next/navigation";
import { Loader2, Store, Save } from "lucide-react";
import { Query } from "appwrite";
import { toast } from "sonner";

export default function SetupNursery() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [nurseryId, setNurseryId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        email: "",
        climateZone: "",
    });

    // Check if user already has a nursery and populate form if so
    useEffect(() => {
        const checkExistingNursery = async () => {
            if (!user) return;

            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    NURSERIES_COLLECTION_ID,
                    [Query.equal("ownerid", user.$id)]
                );

                if (response.documents.length > 0) {
                    const nursery = response.documents[0];
                    setNurseryId(nursery.$id);
                    setIsEditing(true);
                    setFormData({
                        name: nursery.name || "",
                        description: nursery.description || "",
                        address: nursery.address || "",
                        city: nursery.city || "",
                        state: nursery.state || "",
                        pincode: nursery.pincode || "",
                        phone: nursery.phone || "",
                        email: nursery.email || "",
                        climateZone: nursery.climateZone || "",
                    });
                    toast.info("Loaded your existing nursery details.");
                }
            } catch (error) {
                console.error("Error checking nursery:", error);
            } finally {
                setChecking(false);
            }
        };

        checkExistingNursery();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login first");
            router.push("/login");
            return;
        }

        setLoading(true);

        try {
            if (isEditing && nurseryId) {
                // UPDATE existing nursery
                await databases.updateDocument(
                    DATABASE_ID,
                    NURSERIES_COLLECTION_ID,
                    nurseryId,
                    {
                        name: formData.name,
                        description: formData.description,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        phone: formData.phone,
                        email: formData.email,
                        climateZone: formData.climateZone,
                    }
                );
                toast.success("Nursery details updated successfully!");
                router.push("/nurseryadmin");
            } else {
                // CREATE new nursery
                // Double check before creation
                const checkResponse = await databases.listDocuments(
                    DATABASE_ID,
                    NURSERIES_COLLECTION_ID,
                    [Query.equal("ownerid", user.$id)]
                );

                if (checkResponse.documents.length > 0) {
                    toast.error("You already have a nursery! Refreshing page...");
                    window.location.reload();
                    return;
                }

                await databases.createDocument(
                    DATABASE_ID,
                    NURSERIES_COLLECTION_ID,
                    ID.unique(),
                    {
                        name: formData.name,
                        ownerid: user.$id,
                        description: formData.description,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        phone: formData.phone,
                        email: formData.email,
                        climateZone: formData.climateZone,
                        isActive: true,
                        commissionRate: 10.0,
                        latitude: 0.0,
                        longitude: 0.0,
                    }
                );

                toast.success("Nursery created successfully!");
                router.push("/nurseryadmin/addproduct");
            }
        } catch (error: any) {
            console.error("Error saving nursery:", error);
            toast.error("Error: " + (error.message || "Failed to save nursery"));
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please login first</p>
            </div>
        );
    }

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-green-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Store className="text-green-600" size={32} />
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isEditing ? "Update Nursery Details" : "Setup Your Nursery"}
                    </h1>
                </div>

                <p className="text-gray-600 mb-6">
                    {isEditing
                        ? "Update your nursery's location, contact info, and other details below."
                        : `Welcome, ${user.name}! Let's set up your nursery so you can start adding products.`
                    }
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nursery Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nursery Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Green Paradise Nursery"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                            placeholder="Tell us about your nursery..."
                            rows={3}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                        </label>
                        <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                            placeholder="Street address"
                        />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                                placeholder="Mumbai"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                                placeholder="Maharashtra"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pincode *
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                required
                                value={formData.pincode}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                                placeholder="400001"
                            />
                        </div>
                    </div>

                    {/* Phone and Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                                placeholder="9876543210"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                                placeholder="contact@nursery.com"
                            />
                        </div>
                    </div>

                    {/* Climate Zone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Climate Zone
                        </label>
                        <select
                            name="climateZone"
                            value={formData.climateZone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select climate zone</option>
                            <option value="Tropical">Tropical</option>
                            <option value="Subtropical">Subtropical</option>
                            <option value="Temperate">Temperate</option>
                            <option value="Arid">Arid</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {isEditing ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            <>
                                {isEditing ? <Save size={20} /> : <Store size={20} />}
                                {isEditing ? "Update Nursery Details" : "Create Nursery"}
                            </>
                        )}
                    </button>
                </form>

                {!isEditing && (
                    <p className="text-sm text-gray-500 mt-4">
                        * Commission rate is set to 10% by default. Super admin can change this later.
                    </p>
                )}
            </div>
        </div>
    );
}
