"use client";

import Image from "next/image";
import aboutusimg from "../../../public/images/banner/contact-banner.jpg";

import aboutimg from "../../../public/images/about/about-us-img.jpg"
import { Sprout, Leaf, Flower2, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutSection() {
  const aboutfeatures = [
    {
      title: "Quality Products",
      desc: "Intiam eu sagittis est, at commodo lacini libero. Praesent dignissim sed odio vel aliquam manta lagorn.",
      icon: Sprout,
    },
    {
      title: "Perfect Service",
      desc: "Intiam eu sagittis est, at commodo lacini libero. Praesent dignissim sed odio vel aliquam manta lagorn.",
      icon: HeartHandshake,
    },
    {
      title: "100% Natural",
      desc: "Intiam eu sagittis est, at commodo lacini libero. Praesent dignissim sed odio vel aliquam manta lagorn.",
      icon: Flower2,
    },
    {
      title: "Environmentally friendly",
      desc: "Intiam eu sagittis est, at commodo lacini libero. Praesent dignissim sed odio vel aliquam manta lagorn.",
      icon: Leaf,
    },
  ];

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
              About
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Discover our passion for bringing nature closer to you through quality plants and exceptional service
            </p>
          </div>
        </div>
      </div>

      {/* ABOUT SECTION CONTENT */}
      <section className="w-full py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16">
          {/* LEFT SIDE */}
          <div>
            <div className="relative w-full h-[350px] md:h-[450px]">
              <Image
                src={aboutimg}
                alt="About Plant Nursery"
                fill
                className="object-cover rounded-2xl shadow-lg"
                priority
              />

              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 dark:bg-green-900 rounded-full blur-2xl opacity-60"></div>
            </div>
          </div>

          {/* RIGHT SIDE FEATURES */}
          <div className="grid grid-cols-2 gap-6 justify-items-center content-center text-center">
            {aboutfeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-4"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-50 mb-3">
                    <Icon className="w-10 h-10 text-green-500" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {f.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
