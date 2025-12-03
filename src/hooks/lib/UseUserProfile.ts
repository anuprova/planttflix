import { tableDb, storage, ID, BUCKET_ID } from "@/lib/Appwrite.config";
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
    mutationFn: async ({ email, data, image }: { email: string; data: { name?: string; phone?: string; address?: string }; image?: File | null }) => {
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
      let imageUrl = profile.rows[0].profileImage;

      // Upload image if provided
      if (image) {
        try {
          const fileId = ID.unique();
          const uploadedFile = await storage.createFile(
            BUCKET_ID,
            fileId,
            image
          );
          
          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        } catch (error) {
          console.error("Error uploading image:", error);
          // Continue with profile update even if image upload fails
        }
      }

      // Update user profile in Authenticationtable
      const response = await tableDb.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        tableId: "Authenticationtable",
        rowId: rowId,
        data: {
          ...data,
          profileImage: imageUrl,
        },
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", variables.email] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
