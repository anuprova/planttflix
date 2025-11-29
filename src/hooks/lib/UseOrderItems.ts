import { databases, DATABASE_ID, ORDER_ITEMS_COLLECTION_ID } from "@/lib/Appwrite.config";
import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";

export const useOrderItems = (orderId: string) => {
  return useQuery({
    queryKey: ["orderItems", orderId],
    queryFn: async () => {
      if (!orderId) return [];

      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDER_ITEMS_COLLECTION_ID,
        [Query.equal("orderid", orderId)]
      );

      return response.documents;
    },
    enabled: !!orderId,
  });
};
