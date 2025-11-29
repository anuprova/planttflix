"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { Sprout } from "lucide-react";

import cactus from "../../public/images/footer/footer-flower-1.jpg";
import tulip from "../../public/images/footer/footer-flower-2.jpg";
import footerbg from "../../public/images/banner/banner-bg-3.jpg";

export default function Footer() {
  return (
    <footer
      className="w-full bg-cover bg-center text-white relative"
      style={{
        backgroundImage: `url(${footerbg.src})`,
      }}
    >
      {/* Dark green overlay */}
      <div className="absolute inset-0 bg-[#05240A]/80"></div>

      {/* Optional pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/footer-bg.png')",
          backgroundSize: "cover",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* LOGO + TEXT + SOCIALS */}
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-md ring-1 ring-emerald-100">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="leading-tight">
              <span className="block text-3xl font-extrabold text-white tracking-tight">
                Plantflix
              </span>
              {/* <span className="block text-xs text-gray-500 -mt-1">Green living · Shop</span> */}
            </div>
          </Link>

          <div className="flex items-center gap-4 mt-6">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <div
                key={i}
                className="w-10 h-10 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <Icon size={18} />
              </div>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">QUICK LINK</h2>

          <ul className="space-y-3 text-gray-300">
            <li>Purchase</li>
            <li>Payment</li>
            <li>Return</li>
            <li>Shipping</li>
            <li>Orders</li>
          </ul>
        </div>

        {/* BEST SELLER */}
        <div>
          <h2 className="text-xl font-semibold mb-4">BEST SELLER</h2>

          <div className="flex items-center gap-4 mb-6">
            <Image
              src={cactus}
              alt="Cactus Flower"
              width={70}
              height={70}
              className="rounded-md"
            />
            <div>
              <p>Cactus Flower</p>
              <p className="font-bold">$10.99</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src={tulip}
              alt="Tulip Flower"
              width={70}
              height={70}
              className="rounded-md"
            />
            <div>
              <p>Tulip Flower</p>
              <p className="font-bold">$11.99</p>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h2 className="text-xl font-semibold mb-4">CONTACT</h2>

          <p className="text-gray-300">Address: 505 Silk Rd, New York</p>
          <p className="text-gray-300 mt-2">Phone: +1 234 122 122</p>
          <p className="text-gray-300 mt-2">Email: plantflix@gmail.com</p>

          <p className="text-gray-300 mt-4">
            Open hours: Mon - Sun: 8 AM to 9 PM
          </p>

          <p className="text-gray-300">Happy hours: Sat: 2 PM to 4 PM</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 mt-10 relative z-10"></div>

      <div className="text-center text-white py-4 relative z-10">
        © Copyright 2025 All rights reserved
      </div>
    </footer>
  );
}
