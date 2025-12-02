"use client";
import { motion } from "framer-motion";
import Image from "next/image";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

import testimonial1 from "../../public/images/testimonial/testimonial-img-1.jpg";
import testimonial3 from "../../public/images/testimonial/testimonial-img-3.jpg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import banner1 from "../../public/images/banner/banner-bg-1.jpg";

import banner2 from "../../public/images/banner/banner-bg-2.jpg";

import banner3 from "../../public/images/banner/banner-bg-3.jpg";

import indoorplant from "../../public/images/plant/indoor-plant-cat.jpg";
import outdoorplant from "../../public/images/plant/outdoor-plant-cat.jpg";
import seasonalplant from "../../public/images/plant/seasonalplant1.jpg";

import aboutimg from "../../public/images/about/about-us-img.jpg";

import {
  Leaf,
  Truck,
  DollarSign,
  CloudSun,
  Sprout,
  Flower2,
  Droplets,
  HeartHandshake,
} from "lucide-react";

import { useState } from "react";

import serviceposter from "../../public/images/about/service-poster.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";


export default function Home() {
  interface Plant {
    id: number;
    name: string;
    price: number;
    image: string;
  }

  // Correct public image paths
  const categories = [
    { title: "Indoor Plants", img: indoorplant },
    { title: "Outdoor Plants", img: outdoorplant },
    { title: "Seasonal Plants", img: seasonalplant },
  ];

  const features = [
    {
      title: "100% Fresh Plants",
      icon: Leaf,
      description: "We provide the healthiest and most vibrant plants.",
    },
    {
      title: "Fast Delivery",
      icon: Truck,
      description: "Quick and safe delivery right to your doorstep.",
    },
    {
      title: "Affordable Pricing",
      icon: DollarSign,
      description: "High-quality plants at pocket-friendly prices.",
    },
    {
      title: "Climate-Based Suggestions",
      icon: CloudSun,
      description: "Plant recommendations based on your climate.",
    },
  ];

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

  const services = [
    {
      title: "Plants Care",
      desc: "Customized plant care schedules, watering & fertilization tips.",
      icon: Sprout,
    },
    {
      title: "Pressure Washing",
      desc: "Exterior and patio cleaning to restore surfaces.",
      icon: Droplets,
    },
    {
      title: "Tree Service & Trimming",
      desc: "Professional trimming, pruning and tree health checks.",
      icon: Flower2,
    },
  ];

  const router = useRouter();

  const goToShop = () => {
    router.push("/shop");
  };


  // YouTube video id (your video)
  const videoId = "qb4gIVXHtRw";

  const [isPlaying, setIsPlaying] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <>
      <Navbar />
      <div className="bg-black dark:bg-black">
        {/* Banner start */}
        <section className="relative">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            navigation
            loop
            effect="fade"
            fadeEffect={{ crossFade: true }}
            className="h-screen"
          >
            {/* SLIDE 1 */}
            <SwiperSlide>
              <div className="relative h-full flex items-center justify-center">
                <Image
                  src={banner1}
                  alt="Slide 1"
                  fill
                  className="object-cover opacity-70"
                />

                <motion.div
                  initial={{ opacity: 10, y: 70 }}
                  // animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-3xl px-6"
                >
                  <h1 className="text-5xl md:text-6xl font-bold text-white">
                    Bring Nature To Your Home
                  </h1>
                  <p className="mt-4 text-lg text-white mb-4">
                    Explore fresh indoor & outdoor plants from trusted
                    nurseries.
                  </p>

                  <div className="flex gap-4 mt-14  justify-center items-center">
                    <button className="px-10 py-3 text-lg font-semibold rounded-lg bg-green-700 text-white hover:bg-green-800 transition-all shadow-md">
                      Get Started
                    </button>

                    <button className="px-10 py-3 text-lg font-semibold rounded-lg bg-white text-green-700 border border-green-700 hover:bg-green-50 transition-all shadow-md">
                      Contact Us
                    </button>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>

            {/* SLIDE 2 */}
            <SwiperSlide>
              <div className="relative h-full flex items-center justify-center">
                <Image
                  src={banner2}
                  alt="Slide 2"
                  fill
                  className="object-cover opacity-70"
                />

                <motion.div
                  initial={{ opacity: 10, y: 70 }}
                  // animate={{ opacity: 10, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-3xl px-6"
                >
                  <h1 className="text-5xl md:text-6xl font-bold text-white">
                    Fresh Indoor Plants
                  </h1>

                  <p className="mt-4 text-lg text-white mb-4">
                    Keep your home fresh with our indoor collections.
                  </p>

                  <div className="flex gap-4 mt-14  justify-center items-center">
                    <button className="px-10 py-3 text-lg font-semibold rounded-lg bg-green-700 text-white hover:bg-green-800 transition-all shadow-md">
                      Get Started
                    </button>

                    <button className="px-10 py-3 text-lg font-semibold rounded-lg bg-white text-green-700 border border-green-700 hover:bg-green-50 transition-all shadow-md">
                      Contact Us
                    </button>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>

            {/* SLIDE 3 */}
            <SwiperSlide>
              <div className="relative h-full flex items-center justify-center">
                <Image
                  src={banner3}
                  alt="Slide 3"
                  fill
                  className="object-cover opacity-80"
                />

                <motion.div
                  initial={{ opacity: 10, y: 70 }}
                  // animate={{ opacity: 8, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-3xl px-6"
                >
                  <h1 className="text-5xl md:text-6xl font-bold text-white">
                    Outdoor Greenery
                  </h1>

                  <p className="mt-4 text-lg text-white mb-4">
                    Enhance your garden with vibrant outdoor plants.
                  </p>

                  <div className="flex gap-4 mt-14 justify-center items-center">
                    <button className="px-10 py-3 text-lg font-semibold rounded-lg bg-green-700 text-white hover:bg-green-800 transition-all shadow-md">
                      Get Started
                    </button>

                    <button className="px-10 py-3 text-lg font-semibold rounded-lg bg-white text-green-700 border border-green-700 hover:bg-green-50 transition-all shadow-md">
                      Contact Us
                    </button>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Banner end */}

        {/*why choose us start  */}

        <section className="py-16 bg-green-100">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 mb-10">
              We offer the best quality plants with amazing service features.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-green-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer "
                  >
                    <div className="flex justify-center mb-4">
                      <Icon className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-700">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose us end */}

        {/* About Section start */}

        <section className="w-full py-20 bg-white dark:bg-gray-950">
          <h2 className="text-4xl font-bold mb-8 text-green-600 dark:text-white text-center ">
            ABOUT US
          </h2>
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

                {/* Decorative Glow */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 dark:bg-green-900 rounded-full blur-2xl opacity-60"></div>
              </div>
            </div>

            {/* RIGHT SIDE FEATURES */}
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

        {/* About Section end */}

        {/* Service section  start*/}

        <section className="w-full bg-gradient-to-br from-green-200 via-white to-green-100 py-12 overflow-hidden">
          <div className="text-center mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-green-600 dark:text-white">
              OUR SERVICES
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              We provide high-quality gardening & exterior services tailored to
              your needs.
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* LEFT - Services List */}
              <div className="flex justify-center items-center order-2 lg:order-1">
                <div className="space-y-6 sm:space-y-8 w-full">
                  {services.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 sm:gap-6">
                      {/* Icon circle */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                        {s.icon && (
                          <s.icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-900 dark:text-white mb-1">
                          {s.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT - Video Player */}
              <div className="order-1 lg:order-2">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black max-w-2xl mx-auto lg:max-w-none">
                  {!isPlaying ? (
                    // Poster thumbnail with play button overlay
                    <div
                      className="w-full h-full relative cursor-pointer"
                      role="button"
                      aria-label="Play video"
                      onClick={() => setIsPlaying(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setIsPlaying(true);
                      }}
                      tabIndex={0}
                    >
                      {/* Poster image */}
                      <Image
                        src={serviceposter}
                        alt="Video poster"
                        fill
                        className="object-cover"
                      />

                      {/* dark overlay for better contrast */}
                      <div className="absolute inset-0 bg-black/30" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105"
                          aria-hidden
                        >
                          {/* simple play icon */}
                          <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 ml-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5 3.868v16.264A1 1 0 0 0 6.537 21.6L19.5 12.999 6.537 2.4A1 1 0 0 0 5 3.868z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // iframe player (autoplay enabled via query params)
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={embedUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Service section  end*/}

        {/* category section */}

        <section className="w-full bg-gradient-to-br from-green-700 via-white to-green-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-900 tracking-wide drop-shadow-sm">
              Plant Categories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className=" bg-white/80  backdrop-blur-xl rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]  hover:shadow-[0_12px_35px_rgba(0,0,0,0.15)]  border border-green-100  hover:border-green-300 transition-all duration-500 p-6 flex flex-col items-center text-center hover:-translate-y-2"
                >
                  {/* IMAGE */}
                  <div className="w-full h-64 mb-5 overflow-hidden rounded-2xl group shadow-md">
                    <Image
                      src={cat.img}
                      alt={cat.title}
                      width={300}
                      height={300}
                      className=" w-full h-full object-cover  transition-all duration-500   group-hover:scale-110 group-hover:opacity-90" />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-2xl font-semibold text-gray-900 tracking-wide mb-4">
                    {cat.title}
                  </h3>

                  {/* VIEW CATEGORY BUTTON */}
                  <button
                    onClick={goToShop}
                    className="
              px-6 
              py-2.5 
              rounded-xl 
              bg-gradient-to-r from-green-600 to-green-700 
              text-white 
              font-medium 
              hover:from-green-700 
              hover:to-green-800 
              transition-all 
              duration-300
              shadow-md 
              hover:shadow-lg 
              active:scale-95
            "
                  >
                    View Category
                  </button>
                </div>
              ))}
            </div>

            {/* SHOP NOW BUTTON */}
            <div className="text-center mt-16">
              <button
                onClick={() => router.push("/shop")}
                className="
          px-12 
          py-3.5 
          text-lg 
          font-semibold 
          rounded-xl 
          bg-green-700 
          text-white 
          shadow-lg 
          hover:bg-green-800 
          hover:shadow-xl 
          transition-all 
          duration-300 
          active:scale-95
        "
              >
                Shop Now
              </button>
            </div>
          </div>
        </section>

        {/* testimonial section start */}
        <section className=" w-full bg-gradient-to-br from-green-200 via-white to-green-100 py-12">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-700">TESTIMONIAL</h2>
              <p className="text-gray-600 mt-2">
                Some kind words from clients about Plantflix
              </p>
            </div>

            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              navigation
              loop
              className="w-full"
            >
              {/* SLIDE 1 */}
              <SwiperSlide>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  {/* Image */}
                  <div className="flex justify-center">
                    <Image
                      src={testimonial1}
                      alt="Client"
                      className="w-80 h-80 object-cover rounded-full shadow-lg"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      “Plantflix is a pleasure to work with. Their ideas are
                      creative, they came up with imaginative solutions to
                      tricky issues, their landscaping and planting contacts are
                      equally excellent. We now have a beautiful but also
                      manageable garden as a result. Thank you!”
                    </p>

                    <h3 className="text-xl font-semibold mt-6 text-gray-800">
                      Mr. Jonas Nick
                    </h3>

                    <p className="text-green-600 font-semibold">
                      CEO of NAVATECH
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Duplicate more slides as needed */}
              <SwiperSlide>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div className="flex justify-center">
                    <Image
                      src={testimonial3}
                      alt="Client"
                      className="w-80 h-80 object-cover rounded-full shadow-lg"
                    />
                  </div>

                  <div>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      “Plantflix is a pleasure to work with. Their ideas are
                      creative, they came up with imaginative solutions to
                      tricky issues, their landscaping and planting contacts are
                      equally excellent. We now have a beautiful but also
                      manageable garden as a result. Thank you!”
                    </p>

                    <h3 className="text-xl font-semibold mt-6 text-gray-800">
                      Sarah Johnson
                    </h3>

                    <p className="text-green-600 font-semibold">
                      Founder of GreenCo
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        {/* testimonial section end */}
      </div>
      <Footer />
    </>
  );
}
