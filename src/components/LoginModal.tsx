"use client";

import { X, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 300); // Wait for animation
        }
    }, [isOpen]);

    if (!visible && !isOpen) return null;

    return (
        <div
            className={`
        fixed inset-0 z-[100] flex items-center justify-center 
        transition-opacity duration-300
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`
          relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4
          transform transition-all duration-300
          ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <LogIn className="w-8 h-8 text-green-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Login Required
                    </h2>

                    <p className="text-gray-600 mb-8">
                        Please log in to add items to your cart and continue shopping.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => router.push("/login")}
                            className="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
