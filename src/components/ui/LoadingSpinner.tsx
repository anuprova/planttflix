import { Loader2, Leaf } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-3 rounded-full shadow-lg border border-green-100">
                    <Loader2 className={`${sizeClasses[size]} animate-spin text-green-600`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Leaf className="w-3 h-3 text-green-600 opacity-0 animate-pulse" />
                    </div>
                </div>
            </div>
            <p className="text-sm font-medium text-green-800 animate-pulse">
                Loading Planttflix...
            </p>
        </div>
    );
}
