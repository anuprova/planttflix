import { useMutation } from "@tanstack/react-query";
import { databases, DATABASE_ID, CONTACT_SUBMISSIONS_COLLECTION_ID, ID } from "@/lib/Appwrite.config";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useSubmitContactForm() {
  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await databases.createDocument(
        DATABASE_ID,
        CONTACT_SUBMISSIONS_COLLECTION_ID,
        ID.unique(),
        {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: "new",
        }
      );
      return response;
    },
  });
}
