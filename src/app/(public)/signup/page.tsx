

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import loginbg from "../../../../public/images/banner/banner-bg-2.jpg";
import { useState, useEffect } from "react";
import { useSignup } from "@/hooks/lib/UseAuth";
import { SignupData } from "@/hooks/lib/AuthService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Signup = () => {
  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "User",
  });

  const signup = useSignup();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      const role = user.role?.toLowerCase();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form data: ", formData);

    signup.mutate(
      { formData, image },
      {
        onSuccess: () => {
          console.log("Signup success! Redirecting to login...");
          toast.success("Account created successfully! Please login.");
          // Use window.location.href for a hard redirect to ensure clean state
          window.location.href = "/login";
        },
        onError: (error: any) => {
          console.error("Signup error:", error);
          toast.error(error.message || "Failed to create account");
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative">
      <Image
        src={loginbg}
        alt="Signup Background"
        fill
        className="object-cover"
        priority
      />

      {/* FORM CARD */}
      <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl p-8 rounded-2xl w-full max-w-md mx-4 relative z-10">
        <h2 className="text-3xl font-bold text-center text-white">
          Sign up
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* ERROR MESSAGE */}
          {signup.isError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded">
              {(signup.error as any)?.message || "Something went wrong!"}
            </div>
          )}

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md"
              placeholder="Enter Name"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
          </div>

          {/* PHONE NUMBER */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Phone Number
            </label>
            <input
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md"
              placeholder="number"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md"
              placeholder="••••••••"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="text-white"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={signup.isPending}
            className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {signup.isPending ? "Creating account..." : "Sign up"}
          </button>

          {/* LOGIN LINK */}
          <p className="mt-3 text-center text-sm text-gray-200">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
