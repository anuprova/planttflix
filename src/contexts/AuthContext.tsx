"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { account, tableDb } from "@/lib/Appwrite.config";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

type User = {
    $id: string;
    email: string;
    name: string;
    role: string;
} | null;

type AuthContextType = {
    user: User;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch user on mount
    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            console.log("AuthContext: Checking user...");
            const accountData = await account.get();
            console.log("AuthContext: Account data:", accountData);

            let role = "User"; // Default role

            try {
                // Try to fetch role from database
                const profile = await tableDb.listRows({
                    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                    tableId: "Authenticationtable",
                    queries: [Query.equal("email", accountData.email)],
                });

                console.log("AuthContext: Profile data:", profile);
                role = profile?.rows?.[0]?.role || "User";
                console.log("AuthContext: User role:", role);
            } catch (roleError) {
                console.warn("AuthContext: Could not fetch role, using default:", roleError);
                // Continue with default role
            }

            setUser({
                $id: accountData.$id,
                email: accountData.email,
                name: accountData.name,
                role,
            });
            console.log("AuthContext: User set successfully");
        } catch (error) {
            console.log("AuthContext: No user logged in or error:", error);
            setUser(null);
        } finally {
            setLoading(false);
            console.log("AuthContext: Loading complete");
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // Create session
            await account.createEmailPasswordSession(email, password);

            // Get user data
            const accountData = await account.get();

            // Fetch role
            const profile = await tableDb.listRows({
                databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                tableId: "Authenticationtable",
                queries: [Query.equal("email", email)],
            });

            const role = profile?.rows?.[0]?.role || "User";

            setUser({
                $id: accountData.$id,
                email: accountData.email,
                name: accountData.name,
                role,
            });

            // Redirect based on role
            if (role === "superadmin") {
                router.push("/superadmin");
            } else if (role === "nurseryadmin") {
                router.push("/nurseryadmin");
            } else {
                router.push("/user/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const refreshUser = async () => {
        await checkUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
