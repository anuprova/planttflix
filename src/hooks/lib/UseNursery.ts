import { databases, DATABASE_ID, NURSERIES_COLLECTION_ID } from "@/lib/Appwrite.config";
import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";

export const useMyNursery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["myNursery", userId],
    queryFn: async () => {
      if (!userId) return null;

      const response = await databases.listDocuments(
        DATABASE_ID,
        NURSERIES_COLLECTION_ID,
        [Query.equal("ownerid", userId)]
      );

      if (response.documents.length === 0) return null;

      return response.documents[0];
    },
    enabled: !!userId,
  });
};
