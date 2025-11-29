import { databases, storage } from "@/lib/Appwrite.config";
import { ID, Query } from "appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//  MUST IMPORT THESE VALUES FROM YOUR CONFIG FILE
import {
  DATABASE_ID,
  COLLECTION_ID,
  BUCKET_ID,
} from "@/lib/Appwrite.config";


// -------------------------------------
// 🔹 1. GET ALL PRODUCTS
// -------------------------------------

export const useProductList = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      return res.documents;
    },
  });
};



// -------------------------------------
// 🔹 2. CREATE PRODUCT (fixed + matches Register code)
// -------------------------------------

export const useProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {

      // console.log("Data from Mutation", data);

      let imageurl = null;

      if (data.imageurl?.length > 0) {
        const uploaded = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          data.imageurl[0]
        );

        imageurl = storage.getFileView(BUCKET_ID, uploaded.$id);
        // console.log("Mutation image Url: ", imageurl);
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          name: data.name,
          price: data.price.toString(), // Keep as string
          desc: data.desc,
          category: data.category,
          imageurl: imageurl,
          userid: data.userid,
          // New fields
          nurseryid: data.nurseryid,
          stock: data.stock || 0,
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
          careInstructions: data.careInstructions || "",
          climateZone: data.climateZone || "",
          season: data.season || "",
          sku: data.sku || "",
        }
      );

      // console.log({ response });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};




// -------------------------------------
// 🔹 3. GET PRODUCT BY ID
// -------------------------------------

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
      return res;
    },
    enabled: !!id,
  });
};



// -------------------------------------
// 🔹 4. UPDATE PRODUCT
// -------------------------------------

// export const useUpdateProduct = (id: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data: any) => {
//       let imageId = data.oldImage;

//       // Upload new image if provided
//       if (data.image?.length > 0) {
//         const img = await storage.createFile(
//           BUCKET_ID,
//           ID.unique(),
//           data.image[0]
//         );
//         imageId = img.$id;
//       }

//       const res = await databases.updateDocument(
//         DATABASE_ID,
//         COLLECTION_ID,
//         id,
//         {
//           name: data.name,
//           price: data.price,
//           desc: data.desc,
//           category: data.category,
//           image: imageId,
//         }
//       );

//       return res;
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries(["products"]);
//       queryClient.invalidateQueries(["product", id]);
//     },
//   });
// };

// -------------------------------------
// 🔹 EDIT / UPDATE PRODUCT (Final Version)
// -------------------------------------

// -------------------------------------
// 🔹 EDIT PRODUCT HOOK (Final)
// -------------------------------------

export const useEditProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {

      let imageurl = data.oldImage; // keep old image if no new image selected

      // Upload new image
      if (data.image && data.image.length > 0) {
        const uploaded = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          data.image[0]
        );

        imageurl = storage.getFileView(BUCKET_ID, uploaded.$id);
      }

      const res = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        {
          name: data.name,
          price: data.price,
          desc: data.desc,
          category: data.category,
          imageurl: imageurl,
        }
      );

      return res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
};


// -------------------------------------
// 🔹 5. DELETE PRODUCT
// -------------------------------------

export const useDeleteById = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
      return res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};


export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const response = await databases.listDocuments(
        DATABASE_ID, 
        COLLECTION_ID,
        [
          Query.limit(1000),
          Query.orderDesc("$createdAt")
        ]
      )
      // console.log("All produts from mutate: ", response);
      
      
      return response.documents
    }
  })
}



// -------------------------------------
// 🔹 6. PAGINATION SUPPORT
// -------------------------------------

export const usePaginatedProducts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["products-paginated", page, limit],
    queryFn: async () => {
      const offset = (page - 1) * limit;

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc("$createdAt"),
        ]
      );

      return {
        documents: response.documents,
        total: response.total,       // total count from Appwrite
        pageCount: Math.ceil(response.total / limit),
      };
    },
  });
};

// -------------------------------------
// 🔹 7. UPDATE STOCK
// -------------------------------------

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantityChange }: { productId: string; quantityChange: number }) => {
      // 1. Get current product to check stock
      const product = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        productId
      );

      const currentStock = product.stock || 0;
      const newStock = currentStock + quantityChange;

      if (newStock < 0) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      // 2. Update stock
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        productId,
        {
          stock: newStock,
        }
      );

      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};
