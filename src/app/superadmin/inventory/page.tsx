"use client";

import { useAllProducts, useDeleteProductMutation } from "@/hooks/lib/UseProduct";
import { useQueryClient } from "@tanstack/react-query";
import { useAllNurseries } from "@/hooks/lib/UseSuperAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, Search, Package, Pencil, X, Save } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { databases, DATABASE_ID, COLLECTION_ID } from "@/lib/Appwrite.config";

export default function GlobalInventoryPage() {
    const queryClient = useQueryClient();
    const { data: products, isLoading: productsLoading } = useAllProducts();
    const { data: nurseries, isLoading: nurseriesLoading } = useAllNurseries();
    const deleteProduct = useDeleteProductMutation();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        price: "",
        stock: "",
        category: "",
        season: "",
        desc: ""
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const nurseryMap = useMemo(() => {
        const map = new Map();
        if (nurseries) {
            nurseries.forEach((n: any) => {
                map.set(n.$id, n.name || "Unknown Nursery");
            });
        }
        return map;
    }, [nurseries]);

    const handleDelete = async (productId: string, productName: string) => {
        if (!confirm(`SUPER ADMIN ACTION: Are you sure you want to delete "${productName}"? This cannot be undone.`)) return;
        try {
            await deleteProduct.mutateAsync(productId);
            toast.success("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name || "",
            price: product.price || "",
            stock: product.stock || "",
            category: product.category || "",
            season: product.season || "",
            desc: product.desc || ""
        });
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setIsUpdating(true);
        try {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, editingProduct.$id, {
                name: editForm.name,
                price: editForm.price,
                stock: parseInt(editForm.stock),
                category: editForm.category,
                season: editForm.season,
                desc: editForm.desc
            });
            toast.success("Product updated successfully!");
            setEditingProduct(null);
            queryClient.invalidateQueries({ queryKey: ["all-products"] });
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product");
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredProducts = products?.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nurseryMap.get(p.nurseryid)?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ) || [];

    if (productsLoading || nurseriesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-green-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">📦 Global Inventory</h1>
                <div className="text-sm text-gray-500">
                    Total Products: <span className="font-bold text-gray-800">{products?.length || 0}</span>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search product, category, or nursery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
            </div>

            <Card className="shadow-md overflow-hidden bg-transparent border-0 sm:bg-white sm:border">
                <CardContent className="p-0">
                    {/* Desktop/Tablet Table View */}
                    <div className="hidden md:block overflow-x-auto bg-white rounded-lg border">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Season</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nursery</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredProducts.map((product: any) => (
                                    <tr key={product.$id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                                                    <Image src={product.imageurl} alt={product.name} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{product.name}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{product.desc}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.season || "N/A"}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">₹{product.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{nurseryMap.get(product.nurseryid) || "Unknown"}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(product)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition" title="Edit Product">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.$id, product.name)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-600" title="Delete Product">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredProducts.map((product: any) => (
                            <div key={product.$id} className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
                                {/* Header: Image + Name + Price */}
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image src={product.imageurl} alt={product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-800 truncate pr-2">{product.name}</h3>
                                            <p className="font-bold text-gray-900">₹{product.price}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.desc}</p>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3 text-sm border-t border-b py-3 border-gray-100">
                                    <div>
                                        <p className="text-gray-500 text-xs">Category</p>
                                        <p className="text-gray-700 font-medium">{product.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Season</p>
                                        <p className="text-gray-700 font-medium">{product.season || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Stock</p>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-block mt-0.5 ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {product.stock} units
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Nursery</p>
                                        <p className="text-gray-700 font-medium truncate">{nurseryMap.get(product.nurseryid) || "Unknown"}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                                    >
                                        <Pencil size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.$id, product.name)}
                                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                            <Package size={48} className="mb-4 text-gray-300" />
                            <p>No products found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Edit Product</h3>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select required value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                    <option value="">Select Category</option>
                                    <option value="Indoor Plants">Indoor Plants</option>
                                    <option value="Outdoor Plants">Outdoor Plants</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                                <select required value={editForm.season} onChange={(e) => setEditForm({ ...editForm, season: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                    <option value="">Select Season</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Monsoon">Monsoon</option>
                                    <option value="Autumn">Autumn</option>
                                    <option value="Winter">Winter</option>
                                    <option value="All Season">All Season</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input type="number" required value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" required value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={3} value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isUpdating} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                                    {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
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
