"use client";

import { useProductById } from "@/hooks/lib/UseProduct";
import { useAddToCart } from "@/hooks/lib/UseCart";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { toast } from "sonner";

export default function SinglePlantPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const { data, isLoading } = useProductById(id as string);
  const addToCart = useAddToCart();

  if (isLoading) return <p className="text-center py-20">Loading...</p>;
  if (!data)
    return <p className="text-center py-20 text-red-600">Plant not found</p>;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    setIsAdding(true);
    try {
      // Add to database cart
      await addToCart.mutateAsync({
        userid: user.$id,
        productid: data.$id,
        name: data.name,
        price: parseInt(data.price), // Convert string to integer
        imageurl: data.imageurl,
        quantity: 1,
        category: data.category,
      });

      toast.success("Added to cart!");
      router.push("/shop/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* FULL PAGE SECTION WITH GRADIENT INCLUDING BEHIND CONTENT */}
      <section className="block w-full min-h-screen bg-gradient-to-br from-green-200 via-white to-green-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-10
        bg-white/80 backdrop-blur-xl
        border border-green-200/50
        shadow-[0_8px_30px_rgb(0,0,0,0.08)]
        rounded-3xl p-8 
        hover:shadow-2xl transition-all duration-300"
          >
            {/* IMAGE */}
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg group">
              <Image
                src={data.imageurl}
                alt={data.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* DETAILS */}
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold text-green-900">{data.name}</h1>

              <span
                className="inline-block bg-green-100 text-green-700
            px-3 py-1 rounded-full text-sm font-medium w-fit"
              >
                {data.category}
              </span>

              <p className="text-4xl font-bold text-green-700 drop-shadow-sm">
                ₹{data.price}
              </p>

              <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-green-500 pl-4">
                {data.desc}
              </p>

              {/* ADD TO CART BUTTON */}
              <button
                className="w-full bg-gradient-to-r from-green-600 to-green-700 
              hover:from-green-700 hover:to-green-800
              text-white py-4 rounded-xl text-lg 
              shadow-xl hover:shadow-2xl transition-all duration-300
              hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
