// src/services/authService.ts
import { account, storage, ID, tableDb } from "@/lib/Appwrite.config";
import Cookies from "js-cookie";

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

export async function signupService(formData: SignupData, image?: File | null) {
  // Validate envs early
  ensureEnv("NEXT_PUBLIC_APPWRITE_DATABASE_ID", process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);

  // 1) create account (Appwrite will handle password)
  const acc = await account.create(ID.unique(), formData.email, formData.password, formData.name);

  // 2) create profile row (do NOT store password in production!)
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
    },
  });

  // Do not create client-side cookie for auth here; let login flow handle sessions explicitly
  return { account: acc, profileRow: rowResponse };
}

export async function loginService(email: string, password: string) {
  // create session - method name depends on SDK version: createEmailSession / createEmailPasswordSession
  console.log("I am in Login service");
  
  const session = await account.createEmailPasswordSession(email, password);
  
  // Cookie options for production (Vercel HTTPS)
  const cookieOptions = {
    expires: 7,
    secure: true, // Required for HTTPS (production)
    sameSite: 'lax' as const, // Prevents CSRF attacks
    path: '/', // Available across entire site
  };
  
  // Fetch user role from database
  try {
    const profile = await tableDb.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "Authenticationtable",
      queries: [`equal("email", "${email}")`],
    });
    
    const role = profile?.rows?.[0]?.role || "User";
    
    // Set all required cookies for middleware with proper attributes
    Cookies.set(COOKIE_NAMES.loggedIn, "1", cookieOptions);
    Cookies.set(COOKIE_NAMES.session, session.$id, cookieOptions);
    Cookies.set(COOKIE_NAMES.role, role, cookieOptions);
    
    console.log("Login cookies set - Role:", role, "Session:", session.$id);
  } catch (error) {
    console.error("Error fetching user role:", error);
    // Set default cookies even if role fetch fails
    Cookies.set(COOKIE_NAMES.loggedIn, "1", cookieOptions);
    Cookies.set(COOKIE_NAMES.session, session.$id, cookieOptions);
    Cookies.set(COOKIE_NAMES.role, "User", cookieOptions);
  }
  
  return session;
}

export async function logoutService() {
  console.log("Logout service: Starting logout...");
  try {
    await account.deleteSession("current");
    console.log("Logout service: Session deleted successfully");
  } catch (error) {
    console.error("Logout service: Error deleting session:", error);
  } finally {
    Cookies.remove(COOKIE_NAMES.loggedIn);
    Cookies.remove(COOKIE_NAMES.session);
    Cookies.remove(COOKIE_NAMES.role);
    console.log("Logout service: Cookies cleared");
  }
}

export async function getAccount() {
  try {
    const acc = await account.get();
    console.log("Account", acc);
    
    return acc;
  } catch (err) {
    return null;
  }
}
