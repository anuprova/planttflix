"use client";

import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useClearCart, useUserCart } from "@/hooks/lib/UseCart";
import { useCreateOrder } from "@/hooks/lib/UseOrders";
import { useUpdateStock } from "@/hooks/lib/UseProduct";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Query } from "appwrite";

function OrderSuccessContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const { data: cartItems = [], isLoading: cartLoading } = useUserCart(user?.$id || null);
    const clearCart = useClearCart();
    const createOrder = useCreateOrder();
    const updateStock = useUpdateStock();

    const [orderCreated, setOrderCreated] = useState(false);
    const [creating, setCreating] = useState(true);
    const hasCreatedOrder = useRef(false); // Track if we've already created the order

    useEffect(() => {
        const createOrderAndClearCart = async () => {
            // Prevent duplicate execution
            if (hasCreatedOrder.current) {
                setCreating(false);
                return;
            }

            // Wait for user and session ID
            if (!user || !sessionId) return;

            // Wait for cart to finish loading
            if (cartLoading) return;

            // If cart is empty after loading, it might be already processed or empty
            if (cartItems.length === 0) {
                console.log("Cart is empty, assuming order processed or empty cart");
                setCreating(false);
                return;
            }

            // Mark as creating to prevent duplicate calls
            hasCreatedOrder.current = true;

            try {
                // Get nursery ID from the first product
                const firstProductId = cartItems[0]?.productid;
                if (!firstProductId) {
                    console.error("No product ID found in cart items");
                    setCreating(false);
                    return;
                }

                // Import Appwrite config
                const { databases, tableDb, DATABASE_ID, COLLECTION_ID } = await import("@/lib/Appwrite.config");

                // 1. Fetch Product to get Nursery ID
                const product = await databases.getDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    firstProductId
                );

                const nurseryid = product.nurseryid || "";

                if (!nurseryid) {
                    console.error("No nursery ID found for product");
                    setCreating(false);
                    return;
                }

                // 2. Fetch User Profile to get Address
                let customerPhone = "";
                let shippingAddress = "Address not provided";

                try {
                    const profileResponse = await tableDb.listRows({
                        databaseId: DATABASE_ID,
                        tableId: "Authenticationtable",
                        queries: [Query.equal("email", user.email)],
                    });

                    if (profileResponse.rows.length > 0) {
                        const profile = profileResponse.rows[0];
                        customerPhone = profile.phone || "";
                        shippingAddress = profile.address || "Address not provided";
                    }
                } catch (err) {
                    console.error("Error fetching user profile:", err);
                }

                // Prepare order items
                const orderItems = cartItems.map((item) => ({
                    productid: item.productid,
                    productName: item.name,
                    productImage: item.imageurl,
                    price: parseInt(item.price.toString()), // Ensure string -> int
                    quantity: item.quantity,
                    subtotal: parseInt(item.price.toString()) * item.quantity,
                }));

                // Create order
                await createOrder.mutateAsync({
                    userid: user.$id,
                    nurseryid,
                    items: orderItems,
                    customerName: user.name,
                    customerEmail: user.email,
                    customerPhone: customerPhone,
                    shippingAddress: shippingAddress,
                    stripeSessionId: sessionId,
                });

                // Deduct stock for each item
                await Promise.all(orderItems.map(item =>
                    updateStock.mutateAsync({
                        productId: item.productid,
                        quantityChange: -item.quantity
                    })
                ));

                // Clear cart
                await clearCart.mutateAsync(user.$id);

                setOrderCreated(true);
            } catch (error) {
                console.error("Error creating order:", error);
                // Reset the flag if there was an error so user can retry
                hasCreatedOrder.current = false;
            } finally {
                setCreating(false);
            }
        };

        createOrderAndClearCart();
    }, [user, sessionId, cartItems, cartLoading]); // Removed createOrder and clearCart from dependencies

    if (creating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-100 flex items-center justify-center px-4">
                <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full text-center">
                    <Loader2 className="animate-spin text-green-600 mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Processing your order...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full text-center">
                {/* Green success icon */}
                <div className="flex justify-center mb-4">
                    <CheckCircle className="text-green-600" size={70} />
                </div>

                <h1 className="text-3xl font-bold text-gray-800">
                    Order Successfully Placed!
                </h1>

                <p className="text-gray-600 mt-3 leading-relaxed">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-6">
                    <Link
                        href="/shop"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Continue Shopping
                    </Link>

                    <Link
                        href="/"
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-green-600" size={48} />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
