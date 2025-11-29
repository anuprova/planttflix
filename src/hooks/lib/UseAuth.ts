"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getAccount,
  loginService,
  logoutService,
  SignupData,
  signupService,
} from "./AuthService";

import { tableDb } from "@/lib/Appwrite.config";
import { Query } from "appwrite";


// -----------------------------
// SIGNUP HOOK
// -----------------------------
export function useSignup() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, image }: { formData: SignupData; image?: File | null }) =>
      signupService(formData, image),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}


// -----------------------------
// LOGIN HOOK
// -----------------------------
export function useLogin() {
  const qc = useQueryClient();
  const router = useRouter();

  console.log("I am in userLogin");
  
  return useMutation({
  
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginService(email, password),

    onSuccess: async (_, variables) => {
      console.log("I am on success");
      await qc.invalidateQueries({ queryKey: ["currentUser"] });

      // 1) Get logged in Appwrite account
      const accountData = await getAccount();
      if (!accountData) return router.push("/login");

      // 2) Fetch user's role from your Authenticationtable
      const profile = await tableDb.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: "Authenticationtable",
        queries: [Query.equal("email", variables.email)],

      });

      console.log({profile});
      

      const role = profile?.rows?.[0]?.role || "User";
      console.log({role});
      

      // 3) Redirect by role
      if (role === "superadmin")
        router.push("/superadmin");
      else if (role === "nurseryadmin")
        router.push("/nurseryadmin");
      else router.push("/user/dashboard");
    },
  });
}


// -----------------------------
// LOGOUT HOOK
// -----------------------------
export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logoutService(),

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/login");
    },
  });
}

// -----------------------------
// CURRENT USER FETCHER
// -----------------------------
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const acc = await getAccount();
        if (!acc) return null;

        // Fetch user profile row
        const profile = await tableDb.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          tableId: "Authenticationtable",
          queries: [`equal("email", "${acc.email}")`],
        });

        return {
          ...acc,
          role: profile?.rows?.[0]?.role || "User",
        };
      } catch (err) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

