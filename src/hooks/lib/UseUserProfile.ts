import { tableDb } from "@/lib/Appwrite.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Query } from "appwrite";

export const useUserProfile = (userEmail: string | undefined) => {
  return useQuery({
    queryKey: ["userProfile", userEmail],
    queryFn: async () => {
      if (!userEmail) return null;

      const response = await tableDb.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        tableId: "Authenticationtable",
        queries: [Query.equal("email", userEmail)],
      });

      if (response.rows.length === 0) return null;
      return response.rows[0];
    },
    enabled: !!userEmail,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, data }: { email: string; data: { name?: string; phone?: string; address?: string } }) => {
      // First, get the row ID
      const profile = await tableDb.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        tableId: "Authenticationtable",
        queries: [Query.equal("email", email)],
      });

      if (profile.rows.length === 0) {
        throw new Error("User profile not found");
      }

      const rowId = profile.rows[0].$id;

      // Update user profile in Authenticationtable
      const response = await tableDb.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        tableId: "Authenticationtable",
        rowId: rowId,
        data: data,
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", variables.email] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
