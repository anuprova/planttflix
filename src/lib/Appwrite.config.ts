import { Client, Databases, Storage, ID, Account, TablesDB } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const tableDb = new TablesDB(client);


export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;

// Collection IDs
export const COLLECTION_ID = "plantdetail" // Products/Plants
export const CART_COLLECTION_ID = "plantcart" // Shopping cart
export const NURSERIES_COLLECTION_ID = "nurseries" // Nurseries
export const ORDERS_COLLECTION_ID = "orders" // Orders
export const ORDER_ITEMS_COLLECTION_ID = "orderItems" // Order items
export const COMMISSION_SETTINGS_COLLECTION_ID = "commissionSettings" // Commission settings
export const REVIEWS_COLLECTION_ID = "reviews" // Product reviews (optional)

export const BUCKET_ID = "691def7e0017221d1bea";
export {ID, client}