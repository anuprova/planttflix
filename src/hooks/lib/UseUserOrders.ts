import { databases, DATABASE_ID, ORDERS_COLLECTION_ID } from "@/lib/Appwrite.config";
import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";

export const useUserOrders = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userOrders", userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };

      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal("userid", userId),
          Query.orderDesc("$createdAt")
        ]
      );

      return response;
    },
    enabled: !!userId,
  });
};
