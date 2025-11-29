"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import loginbg from "../../../../public/images/banner/banner-bg-2.jpg";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      const role = user.role?.toLowerCase();

      // Redirect based on role (case-insensitive)
      if (role === "superadmin") {
        router.push("/superadmin");
      } else if (role === "nurseryadmin") {
        router.push("/nurseryadmin");
      } else {
        router.push("/user");
      }
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative">
      <Image
        src={loginbg}
        alt="Login Background"
        fill
        className="object-cover"
        priority
      />

      {/* FORM CARD */}
      <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl p-8 rounded-2xl w-full max-w-md mx-4 relative z-10">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Sign In
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* ERROR MESSAGE */}
          {error && (
            <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/50 rounded">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="you@example.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="••••••••"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-white hover:text-green-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* SIGNUP LINK */}
          <p className="text-center text-white mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-white font-semibold">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
