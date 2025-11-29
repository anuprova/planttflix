"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyNursery } from "@/hooks/lib/UseNursery";
import { useAllProducts, useDeleteProductMutation } from "@/hooks/lib/UseProduct";
import { useQueryClient } from "@tanstack/react-query";
import { databases, DATABASE_ID, COLLECTION_ID } from "@/lib/Appwrite.config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Edit2, Trash2, Package, Search } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: nursery, isLoading: nurseryLoading } = useMyNursery(user?.$id);
  const { data: allProducts, isLoading: productsLoading } = useAllProducts();
  const deleteProduct = useDeleteProductMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter products for this nursery
  const myProducts = allProducts?.filter((p: any) => p.nurseryid === nursery?.$id) || [];

  // Filter by search term
  const filteredProducts = myProducts.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: any) => {
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setIsUpdating(true);

    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        editingProduct.$id,
        {
          name: editingProduct.name,
          desc: editingProduct.desc,
          price: editingProduct.price,
          stock: parseInt(editingProduct.stock),
          category: editingProduct.category,
          careInstructions: editingProduct.careInstructions,
          climateZone: editingProduct.climateZone,
          season: editingProduct.season,
          isAvailable: parseInt(editingProduct.stock) > 0,
        }
      );
      toast.success("Product updated successfully!");
      setShowEditModal(false);
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  if (nurseryLoading || productsLoading) {
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
        <h1 className="text-3xl font-bold text-gray-800">📦 Inventory Management</h1>
        <div className="text-sm text-gray-500">
          Total Products: <span className="font-bold text-gray-800">{myProducts.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? "No Products Found" : "No Products Yet"}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? "Try a different search term" : "Add products to your inventory"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map((product: any) => (
                    <tr key={product.$id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Image
                          src={product.imageurl}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.desc}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.category || "N/A"}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{product.price}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}>
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.$id, product.name)}
                            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingProduct.desc}
                  onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
