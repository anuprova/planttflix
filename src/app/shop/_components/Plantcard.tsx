"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ FIXED

import { useAuth } from "@/contexts/AuthContext";
import { useAddToCart } from "@/hooks/lib/UseCart";
import { toast } from "sonner";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";

type PlantCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  season?: string;
  description?: string;
  isAvailable?: boolean;
};

export default function PlantCard({
  id,
  name,
  price,
  imageUrl,
  category,
  season,
  description,
  isAvailable = true,
}: PlantCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const addToCart = useAddToCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to detail page if card is clickable

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsAdding(true);
    try {
      await addToCart.mutateAsync({
        userid: user.$id,
        productid: id,
        name: name,
        price: price,
        imageurl: imageUrl,
        quantity: 1,
        category: category || "General",
      });
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <div
        className="
        bg-white 
        rounded-2xl 
        shadow-lg 
        hover:shadow-2xl 
        transition-all 
        duration-300 
        p-4
        flex 
        flex-col 
        border 
        border-green-100
        relative
        group
      "
      >
        {/* Image Container */}
        <div className="w-full h-56 relative overflow-hidden rounded-xl mb-4 bg-gray-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="
              object-cover 
              w-full 
              h-full 
              transition-all 
              duration-500 
              group-hover:scale-110
            "
          />

          {/* Category Badge */}
          {category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {category}
            </span>
          )}

          {/* Season Badge */}
          {season && (
            <span className="absolute top-3 left-28 bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {season}
            </span>
          )}

          {/* Stock Badge */}
          {!isAvailable && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1" title={name}>
              {name}
            </h3>
            <p className="text-green-700 font-bold text-xl whitespace-nowrap">
              ₹{price}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
            {description || "No description available for this plant."}
          </p>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => router.push(`/shop/${id}`)}
              className="
                flex-1
                bg-gray-50 
                text-gray-700 
                py-2.5 
                rounded-xl 
                hover:bg-gray-100 
                active:scale-95
                transition-all 
                duration-200
                font-medium
                text-sm
              "
            >
              Details
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || !isAvailable}
              className={`
                flex-1
                py-2.5 
                rounded-xl 
                text-white 
                font-medium
                text-sm
                shadow-md
                active:scale-95
                transition-all 
                duration-200
                ${!isAvailable
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-lg shadow-green-200"
                }
              `}
            >
              {isAdding ? "Adding..." : isAvailable ? "Add to Cart" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
