"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TreeDeciduous, Upload, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/lib/UseProduct";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { databases, DATABASE_ID, NURSERIES_COLLECTION_ID } from "@/lib/Appwrite.config";
import { Query } from "appwrite";
import { toast } from "sonner";

type ProductForm = {
  name: string;
  desc: string;
  price: string;
  category: string;
  stock: string;
  careInstructions: string;
  climateZone: string;
  season: string;
  imageurl: FileList | undefined;
};

export default function AddProduct() {
  const router = useRouter();
  const { user } = useAuth();
  const [nurseryId, setNurseryId] = useState<string>("");
  const [loadingNursery, setLoadingNursery] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>();

  const { mutate, isPending } = useProducts();

  // Get nursery ID for the logged-in nursery admin
  useEffect(() => {
    const getNursery = async () => {
      if (!user) {
        alert("Please login as a nursery admin");
        router.push("/login");
        return;
      }

      if (user.role?.toLowerCase() !== "nurseryadmin") {
        alert("Only nursery admins can add products");
        router.push("/");
        return;
      }

      try {
        // Find nursery owned by this user
        const response = await databases.listDocuments(
          DATABASE_ID,
          NURSERIES_COLLECTION_ID,
          [Query.equal("ownerid", user.$id)]
        );

        if (response.documents.length === 0) {
          toast.error("No nursery found for your account. Please contact admin.");
          router.push("/nurseryadmin");
          return;
        }

        setNurseryId(response.documents[0].$id);
      } catch (error) {
        console.error("Error fetching nursery:", error);
       toast.error("Error loading nursery information");
      } finally {
        setLoadingNursery(false);
      }
    };

    getNursery();
  }, [user, router]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onSubmit = async (data: ProductForm) => {
    if (!data.imageurl || data.imageurl.length === 0) {
      alert("Please upload an image!");
      return;
    }

    if (!nurseryId) {
      alert("Nursery not found");
      return;
    }

    // Prepare product data with new fields
    const productData = {
      ...data,
      nurseryid: nurseryId,
      stock: parseInt(data.stock),
      isAvailable: parseInt(data.stock) > 0,
    };

    mutate(productData, {
      onSuccess: () => {
        toast.success("Product added successfully!");
        router.push("/shop");
      },
      onError: (err) => {
        console.error(err);
        alert("Failed to add product");
      },
    });
  };

  if (loadingNursery) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 font-inter bg-gradient-to-br from-green-100 to-green-50">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TreeDeciduous size={28} className="text-green-700" />
          <h2 className="text-2xl font-bold text-green-700">Add New Plant</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plant Name *
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Monstera Deliciosa"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register("desc", { required: "Description is required" })}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Describe the plant..."
              rows={3}
            />
            {errors.desc && <p className="text-red-500 text-sm mt-1">{errors.desc.message}</p>}
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="299"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                {...register("stock", { required: "Stock is required" })}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="50"
                defaultValue="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Category and Season */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select category</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Seasonal">Seasonal</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Season
              </label>
              <select
                {...register("season")}
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
              >
                <option value="">Any season</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Monsoon">Monsoon</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
          </div>

          {/* Climate Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Climate Zone
            </label>
            <select
              {...register("climateZone")}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select climate zone</option>
              <option value="Tropical">Tropical</option>
              <option value="Subtropical">Subtropical</option>
              <option value="Temperate">Temperate</option>
              <option value="Arid">Arid</option>
            </select>
          </div>

          {/* Care Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Care Instructions
            </label>
            <textarea
              {...register("careInstructions")}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Watering, sunlight, soil requirements..."
              rows={3}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plant Image *
            </label>

            {!preview ? (
              <label className="flex flex-col items-center justify-center gap-3 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 p-8 rounded-lg hover:bg-gray-100 transition">
                <div className="p-3 bg-green-100 rounded-full">
                  <Upload size={24} className="text-green-600" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700">Click to upload</span>
                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  {...register("imageurl", {
                    required: "Image is required",
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreview(url);
                      }
                    }
                  })}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      // Reset the file input if needed, though react-hook-form handles the state
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition transform hover:scale-105"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
            {errors.imageurl && <p className="text-red-500 text-sm mt-1">{errors.imageurl.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
