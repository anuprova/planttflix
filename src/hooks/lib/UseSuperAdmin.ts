import { databases, DATABASE_ID, ORDERS_COLLECTION_ID, NURSERIES_COLLECTION_ID, COLLECTION_ID as PRODUCT_COLLECTION_ID } from "@/lib/Appwrite.config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Query } from "appwrite";

// Fetch Global Stats
export const useSuperAdminStats = () => {
  return useQuery({
    queryKey: ["superAdminStats"],
    queryFn: async () => {
      // 1. Total Orders & Revenue
      const orders = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [Query.limit(5000)] // Fetch a large batch for calculation
      );
      
      const totalOrders = orders.total;
      const totalRevenue = orders.documents.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalCommission = orders.documents.reduce((sum, order) => sum + (order.commissionAmount || 0), 0);

      // 2. Total Nurseries
      const nurseries = await databases.listDocuments(
        DATABASE_ID,
        NURSERIES_COLLECTION_ID,
        [Query.limit(1)] // Just need the total count
      );

      // 3. Total Users (We'll use Authenticationtable)
      // Note: We need to import tableDb dynamically or assume a collection exists. 
      // Since we are using tableDb for users elsewhere, let's try to list rows.
      let totalUsers = 0;
      try {
          const { tableDb } = await import("@/lib/Appwrite.config");
          const users = await tableDb.listRows({
              databaseId: DATABASE_ID,
              tableId: "Authenticationtable",
              queries: [Query.limit(1)]
          });
          totalUsers = users.total;
      } catch (e) {
          console.error("Error fetching user count", e);
      }

      return {
        totalOrders,
        totalRevenue,
        totalCommission,
        totalNurseries: nurseries.total,
        totalUsers,
        recentOrders: orders.documents.slice(0, 5)
      };
    },
  });
};

// Fetch All Users
export const useAllUsers = () => {
    return useQuery({
        queryKey: ["allUsers"],
        queryFn: async () => {
            const { tableDb } = await import("@/lib/Appwrite.config");
            const response = await tableDb.listRows({
                databaseId: DATABASE_ID,
                tableId: "Authenticationtable",
                queries: [Query.limit(100)]
            });
            return response;
        }
    });
};

// Update User Role
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ rowId, newRole }: { rowId: string, newRole: string }) => {
            const { tableDb } = await import("@/lib/Appwrite.config");
            const response = await tableDb.updateRow({
                databaseId: DATABASE_ID,
                tableId: "Authenticationtable",
                rowId: rowId,
                data: { role: newRole }
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        }
    });
};

// Delete User
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (rowId: string) => {
            const { tableDb } = await import("@/lib/Appwrite.config");
            const response = await tableDb.deleteRow({
                databaseId: DATABASE_ID,
                tableId: "Authenticationtable",
                rowId: rowId
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        }
    });
};

// Update User Details
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ rowId, data }: { rowId: string, data: any }) => {
            const { tableDb } = await import("@/lib/Appwrite.config");
            const response = await tableDb.updateRow({
                databaseId: DATABASE_ID,
                tableId: "Authenticationtable",
                rowId: rowId,
                data: data
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        }
    });
};

// Fetch All Orders (Global)
export const useAllOrders = () => {
    return useQuery({
        queryKey: ["allOrders"],
        queryFn: async () => {
            const response = await databases.listDocuments(
                DATABASE_ID,
                ORDERS_COLLECTION_ID,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );
            return response;
        }
    });
};

// Fetch All Nurseries
export const useAllNurseries = () => {
    return useQuery({
        queryKey: ["allNurseries"],
        queryFn: async () => {
            const response = await databases.listDocuments(
                DATABASE_ID,
                NURSERIES_COLLECTION_ID,
                [Query.limit(100)]
            );
            return response.documents;
        }
    });
};

// Update Order Details (Generic)
export const useUpdateOrderDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderId, data }: { orderId: string, data: any }) => {
            const response = await databases.updateDocument(
                DATABASE_ID,
                ORDERS_COLLECTION_ID,
                orderId,
                data
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allOrders"] });
        }
    });
};
