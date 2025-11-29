"use client";
import Image from "next/image";
import aboutusimg from "../../../public/images/banner/contact-banner.jpg";

import contactImg from "../../../public/images/about/contact-touch.jpg";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ContactSection() {
  return (
    <>
    <Navbar/>
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
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            Contact
          </h1>
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

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <textarea
                placeholder="Message"
                rows={6}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-md shadow"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>

          {/* RIGHT — React Leaflet Map */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg z-0">
            <MapContainer
              center={[34.0522, -118.2437]}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <Marker position={[34.0522, -118.2437]} icon={markerIcon}>
                <Popup>Los Angeles, California, USA</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 flex items-center">
          <div className="w-full h-[350px] md:h-[450px] relative rounded-2xl shadow-lg overflow-hidden">
            <Image
              src={contactImg}
              alt="Contact Us"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              CONTACT US
            </h2>
            <p className="text-gray-600 mb-8">
              We are improving our services to serve you better.
            </p>

            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold">Address:</span> 505 Silk Rd, New
                York
              </p>

              <p>
                <span className="font-semibold">Phone:</span> +1 234 122 122
              </p>

              <p>
                <span className="font-semibold">Email:</span>{" "}
                info.deercreative@gmail.com
              </p>

              <p>
                <span className="font-semibold">Open hours:</span> Mon – Sun: 8
                AM to 9 PM
              </p>

              <p>
                <span className="font-semibold">Happy hours:</span> Sat: 2 PM to
                4 PM
              </p>
            </div>
          </div>

       
        </div> */}
      </div>
      <Footer/>
    </>
  );
}
