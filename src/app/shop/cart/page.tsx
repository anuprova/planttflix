"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { account } from "@/lib/Appwrite.config";
import {
  useUserCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "@/hooks/lib/UseCart";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
      } catch (error) {
        console.error("User not logged in:", error);
        router.push("/login");
      }
    };
    getCurrentUser();
  }, [router]);

  // Fetch cart from database
  const { data: cartItems = [], isLoading: cartLoading } = useUserCart(userId);
  const updateQuantity = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleIncrease = async (documentId: string) => {
    if (!userId) return;
    const item = cartItems.find((i) => i.$id === documentId);
    if (item) {
      await updateQuantity.mutateAsync({
        documentId,
        quantity: item.quantity + 1,
        userid: userId,
      });
    }
  };

  const handleDecrease = async (documentId: string) => {
    if (!userId) return;
    const item = cartItems.find((i) => i.$id === documentId);
    if (item && item.quantity > 1) {
      await updateQuantity.mutateAsync({
        documentId,
        quantity: item.quantity - 1,
        userid: userId,
      });
    }
  };

  const handleRemove = async (documentId: string) => {
    if (!userId) return;
    await removeItem.mutateAsync({ documentId, userid: userId });
  };

  const handleCheckout = async () => {
    console.log("Checkout button clicked");
    setLoading(true);
    try {
      console.log("Sending request to /api/checkout_sessions");

      // Convert database cart items to the format expected by Stripe
      const stripeItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageurl,
      }));

      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: stripeItems }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.url) {
        console.log("Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        console.error("Stripe Checkout Error:", data.error);
       toast.error("Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout Request Error:", error);
       toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <>
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-100 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-lg">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Fixed Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Background Gradient */}
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold mb-8 text-green-800">
            🛒 Your Cart
          </h3>

          {cartItems.length === 0 && (
            <p className="text-lg text-gray-600 bg-white/80 p-6 rounded-xl shadow text-center">
              Your cart is empty.
            </p>
          )}

          {/* Cart Items */}
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.$id}
                className="flex justify-between items-center bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">Price: ₹{item.price}</p>

                  {/* Qty + Remove */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleDecrease(item.$id!)}
                      className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                      disabled={updateQuantity.isPending}
                    >
                      -
                    </button>

                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncrease(item.$id!)}
                      className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 text-lg font-bold"
                      disabled={updateQuantity.isPending}
                    >
                      +
                    </button>

                    <button
                      onClick={() => handleRemove(item.$id!)}
                      className="ml-4 text-red-600 hover:text-red-700 font-semibold"
                      disabled={removeItem.isPending}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="w-24 h-24 relative ml-4">
                  <Image
                    src={item.imageurl}
                    alt={item.name}
                    fill
                    className="object-cover rounded-xl shadow"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          {cartItems.length > 0 && (
            <div className="mt-10 p-6 bg-white rounded-xl shadow-md text-right">
              <p className="text-2xl font-bold text-gray-800">
                Total: ₹{total}
              </p>

              <button
                disabled={cartItems.length === 0 || loading}
                onClick={handleCheckout}
                className={`mt-5 px-6 py-3 rounded-lg text-white font-medium text-lg transition-all 
                ${cartItems.length === 0 || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90"
                  }`}
              >
                {loading ? "Processing..." : "Proceed to Checkout →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
