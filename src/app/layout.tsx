import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/hooks/lib/QueryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plantflix – India's Most Trusted Online Plant Nursery",
  description:
    "Buy fresh indoor & outdoor plants, pots, and gardening tools. Order online from top-rated nurseries across India with doorstep delivery.",
  openGraph: {
    title: "Plantflix – India's Most Trusted Online Plant Nursery",
    description:
      "Fresh plants, free cancellation, live tracking & exclusive offers. Shop from 100+ nurseries & 5000+ plant varieties.",
    url: "https://planttflix.vercel.app",
    siteName: "Plantflix",
    images: [
      {
        url: "https://fra.cloud.appwrite.io/v1/storage/buckets/691def7e0017221d1bea/files/6931211b003ddaf54642/view?project=69156882003887d9925c&mode=admin",
        width: 1200,
        height: 630,
        alt: "Plantflix India – Buy Plants Online",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plantflix – India's Most Trusted Online Plant Nursery",
    description:
      "Buy fresh indoor & outdoor plants, pots, and gardening tools. Order online from top-rated nurseries across India.",
    images: [
      {
        url: "https://fra.cloud.appwrite.io/v1/storage/buckets/691def7e0017221d1bea/files/6931211b003ddaf54642/view?project=69156882003887d9925c&mode=admin",
        width: 1200,
        height: 630,
        alt: "Plantflix India – Buy Plants Online",
      },
    ],
  },
  keywords: [
    "buy plants online",
    "online plant nursery",
    "indoor plants India",
    "outdoor plants",
    "flowering plants",
    "garden accessories",
    "plant pots",
    "Plantflix",
  ],
  alternates: { canonical: "https://planttflix.vercel.app" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
