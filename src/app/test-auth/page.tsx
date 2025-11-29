"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function TestAuth() {
    const { user, loading } = useAuth();

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
                <p><strong>User:</strong> {user ? "Logged In" : "Not Logged In"}</p>

                {user && (
                    <div className="mt-4">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>ID:</strong> {user.$id}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
