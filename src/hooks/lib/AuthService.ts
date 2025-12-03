// src/services/authService.ts
import { account, storage, ID, tableDb, BUCKET_ID } from "@/lib/Appwrite.config";

export type SignupData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: "User" | "nurseryadmin" | "superadmin";
  inviteToken?: string | null;
};

const COOKIE_NAMES = {
  loggedIn: "isLoggedIn",
  session: "app_session",
  role: "role",
};

function ensureEnv(name: string, value?: string | undefined) {
  if (!value) throw new Error(`${name} is not defined in environment variables`);
  return value;
}

// Helper to set cookies that work with middleware
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Set cookie with all necessary attributes for production
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
  console.log(`Cookie set: ${name}=${value}`);
}

export async function signupService(formData: SignupData, image?: File | null) {
  // Validate envs early
  ensureEnv("NEXT_PUBLIC_APPWRITE_DATABASE_ID", process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);

  // 1) create account (Appwrite will handle password)
  const acc = await account.create(ID.unique(), formData.email, formData.password, formData.name);

  // 2) Upload image to storage if provided
  let imageUrl = "";
  if (image) {
    try {
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(
        BUCKET_ID, // Use the exported BUCKET_ID from config
        fileId,
        image
      );
      
      // Get the file URL
      imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      
      console.log("Image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Continue with signup even if image upload fails
    }
  }

  // 3) create profile row with image URL
  const rowResponse = await tableDb.createRow({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
    tableId: "Authenticationtable",
    rowId: ID.unique(),
    data: {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || "",
      role: formData.role || "User",
      profileImage: imageUrl, // Save the image URL to profileImage field
    },
  });

  // Do not create client-side cookie for auth here; let login flow handle sessions explicitly
  return { account: acc, profileRow: rowResponse };
}

export async function loginService(email: string, password: string) {
  console.log("I am in Login service");
  
  const session = await account.createEmailPasswordSession(email, password);
  
  // Fetch user role from database
  try {
    const profile = await tableDb.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "Authenticationtable",
      queries: [`equal("email", "${email}")`],
    });
    
    const role = profile?.rows?.[0]?.role || "User";
    
    // Set cookies using native document.cookie for better compatibility
    setCookie(COOKIE_NAMES.loggedIn, "1", 7);
    setCookie(COOKIE_NAMES.session, session.$id, 7);
    setCookie(COOKIE_NAMES.role, role, 7);
    
    console.log("Login cookies set - Role:", role, "Session:", session.$id);
    
    // Verify cookies were set
    console.log("All cookies:", document.cookie);
  } catch (error) {
    console.error("Error fetching user role:", error);
    // Set default cookies even if role fetch fails
    setCookie(COOKIE_NAMES.loggedIn, "1", 7);
    setCookie(COOKIE_NAMES.session, session.$id, 7);
    setCookie(COOKIE_NAMES.role, "User", 7);
  }
  
  return session;
}

export async function logoutService() {
  console.log("[AuthService] Starting logout...");
  
  try {
    // Delete Appwrite session
    await account.deleteSession("current");
    console.log("[AuthService] Appwrite session deleted");
  } catch (err) {
    console.error("[AuthService] Error deleting Appwrite session:", err);
  }

  // Clear all auth cookies
  const cookiesToClear = [COOKIE_NAMES.loggedIn, COOKIE_NAMES.session, COOKIE_NAMES.role];
  
  cookiesToClear.forEach(cookieName => {
    // Set cookie with past expiration date to delete it
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`;
    console.log(`[AuthService] Cleared cookie: ${cookieName}`);
  });

  console.log("[AuthService] Logout complete");
}

// Get current account
export async function getAccount() {
  try {
    return await account.get();
  } catch (error) {
    console.error("[AuthService] Error getting account:", error);
    return null;
  }
}
