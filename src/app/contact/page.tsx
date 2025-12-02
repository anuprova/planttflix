"use client";
import Image from "next/image";
import aboutusimg from "../../../public/images/banner/contact-banner.jpg";
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSubmitContactForm } from "@/hooks/lib/UseContact";
import { toast } from "sonner";

// Dynamically import the map component with SSR disabled
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <Loader2 className="animate-spin text-green-600" size={32} />
    </div>
  ),
});

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { mutate: submitForm, isPending } = useSubmitContactForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    submitForm(formData, {
      onSuccess: () => {
        toast.success("Message sent successfully! We'll get back to you soon.");
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      },
      onError: (error: any) => {
        console.error("Contact form error:", error);
        toast.error("Failed to send message. Please try again.");
      },
    });
  };

  return (
    <>
      <Navbar />
      {/* TOP BACKGROUND HERO SECTION */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src={aboutusimg}
          alt="About Background"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
              Contact
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              We'd love to hear from you! Reach out to us for any questions or inquiries
            </p>
          </div>
        </div>
      </div>

      <div className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start mb-12">
          {/* LEFT — Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-3">GET IN TOUCH</h2>
            <p className="text-gray-600 mb-8">
              Send us a message, we will call back later
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows={6}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>

              <button
                type="submit"
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending && <Loader2 className="animate-spin" size={18} />}
                {isPending ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>

          {/* RIGHT — React Leaflet Map */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg z-0">
            <DynamicMap />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
