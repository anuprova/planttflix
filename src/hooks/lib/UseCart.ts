import { databases, DATABASE_ID, CART_COLLECTION_ID } from "@/lib/Appwrite.config";
import { ID, Query } from "appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type CartItem = {
  $id?: string;
  userid: string;
  productid: string;
  name: string;
  price: number;
  imageurl: string;
  quantity: number;
  category?: string;
  nurseryid?: string;
};

// Fetch user's cart from database
export const useUserCart = (userId: string | null) => {
  return useQuery({
    queryKey: ["user-cart", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        CART_COLLECTION_ID,
        [Query.equal("userid", userId)]
      );
      
      // Map and convert string fields to numbers for the frontend
      return response.documents.map(doc => ({
        ...doc,
        quantity: parseInt(doc.quantity as unknown as string),
        price: parseFloat(doc.price as unknown as string),
      })) as unknown as CartItem[];
    },
    enabled: !!userId, // Only run query if userId exists
  });
};

// Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userid: string;
      productid: string;
      name: string;
      price: number;
      imageurl: string;
      quantity: number;
      category?: string;
    }) => {
      // Check if item already exists in cart
      const existing = await databases.listDocuments(
        DATABASE_ID,
        CART_COLLECTION_ID,
        [
          Query.equal("userid", data.userid),
          Query.equal("productid", data.productid),
        ]
      );

      if (existing.documents.length > 0) {
        // Update quantity if item exists
        const existingItem = existing.documents[0];
        // Parse quantity as integer since it's stored as string in DB
        const currentQty = parseInt(existingItem.quantity as unknown as string);
        
        return await databases.updateDocument(
          DATABASE_ID,
          CART_COLLECTION_ID,
          existingItem.$id,
          {
            quantity: (currentQty + data.quantity).toString(), // Save back as string
          }
        );
      } else {
        // Create new cart item
        return await databases.createDocument(
          DATABASE_ID,
          CART_COLLECTION_ID,
          ID.unique(),
          {
            ...data,
            quantity: data.quantity.toString(), // Save as string
            price: data.price.toString() // Ensure price is string too
          }
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-cart", variables.userid] });
    },
  });
};

// Update cart item quantity
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { documentId: string; quantity: number; userid: string }) => {
      return await databases.updateDocument(
        DATABASE_ID,
        CART_COLLECTION_ID,
        data.documentId,
        { quantity: data.quantity.toString() } // Convert to string
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-cart", variables.userid] });
    },
  });
};

// Remove item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { documentId: string; userid: string }) => {
      return await databases.deleteDocument(
        DATABASE_ID,
        CART_COLLECTION_ID,
        data.documentId
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-cart", variables.userid] });
    },
  });
};

// Clear entire cart for user
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userid: string) => {
      const cartItems = await databases.listDocuments(
        DATABASE_ID,
        CART_COLLECTION_ID,
        [Query.equal("userid", userid)]
      );

      // Delete all cart items
      const deletePromises = cartItems.documents.map((item) =>
        databases.deleteDocument(DATABASE_ID, CART_COLLECTION_ID, item.$id)
      );

      return await Promise.all(deletePromises);
    },
    onSuccess: (_, userid) => {
      queryClient.invalidateQueries({ queryKey: ["user-cart", userid] });
    },
  });
};
