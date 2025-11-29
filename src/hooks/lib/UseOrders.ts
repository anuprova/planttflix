import { databases, DATABASE_ID, ORDERS_COLLECTION_ID, ORDER_ITEMS_COLLECTION_ID } from "@/lib/Appwrite.config";
import { ID, Query } from "appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type OrderItem = {
  productid: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type CreateOrderData = {
  userid: string;
  nurseryid: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  stripeSessionId?: string;
};

// Create order with items
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      // Calculate totals
      const subtotal = data.items.reduce((sum, item) => sum + item.subtotal, 0);
      const commissionRate = 10.0; // Default 10% - can be fetched from settings
      const commissionAmount = Math.round((subtotal * commissionRate) / 100);
      const totalAmount = subtotal;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order
      const order = await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        ID.unique(),
        {
          userid: data.userid,
          nurseryid: data.nurseryid,
          orderNumber,
          status: "pending",
          totalAmount: totalAmount,
          subtotal: subtotal,
          commissionAmount: commissionAmount,
          commissionRate: commissionRate,
          paymentStatus: "pending",
          paymentMethod: "stripe",
          stripeSessionId: data.stripeSessionId || "",
          shippingAddress: data.shippingAddress,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          notes: "",
        }
      );

      // Create order items
      const orderItemsPromises = data.items.map((item) =>
        databases.createDocument(
          DATABASE_ID,
          ORDER_ITEMS_COLLECTION_ID,
          ID.unique(),
          {
            orderid: order.$id,
            productid: item.productid,
            productName: item.productName,
            productImage: item.productImage,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          }
        )
      );

      await Promise.all(orderItemsPromises);

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Fetch orders for a specific nursery
export const useNurseryOrders = (nurseryId: string) => {
  return useQuery({
    queryKey: ["nurseryOrders", nurseryId],
    queryFn: async () => {
      if (!nurseryId) return { documents: [], total: 0 };
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal("nurseryid", nurseryId),
          Query.orderDesc("$createdAt"),
        ]
      );
      return response;
    },
    enabled: !!nurseryId,
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
      const response = await databases.updateDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        orderId,
        { status: newStatus }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurseryOrders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
};
