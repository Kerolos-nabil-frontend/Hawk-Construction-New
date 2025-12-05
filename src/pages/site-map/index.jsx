import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import {
  Home,
  Info,
  Briefcase,
  FileText,
  Settings,
  Phone,
  Award,
} from "lucide-react";

export default function SiteMapSwiper() {
  const pages = [
    { name: "Home", path: "/", icon: <Home size={36} /> },
    { name: "About Us", path: "/about", icon: <Info size={36} /> },
    { name: "Projects", path: "/projects", icon: <Briefcase size={36} /> },
    { name: "Certificates", path: "/certificates", icon: <Award size={36} /> },
    { name: "Careers", path: "/careers", icon: <FileText size={36} /> },
    { name: "Services", path: "/services", icon: <Settings size={36} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={36} /> },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-20 px-6 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-sm mb-6">
          Explore Our Sitemap
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-12">
          Find everything you need in one interactive view — swipe or click through to explore our main sections.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={40}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14"
        >
          {pages.map((page, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotateY: 8,
                  boxShadow: "0 20px 35px rgba(59, 130, 246, 0.25)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-400 transform-gpu"
              >
                <Link
                  to={page.path}
                  className="flex flex-col items-center justify-center text-center p-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-tr from-blue-500 to-blue-300 text-white rounded-full shadow-lg mb-6 hover:from-blue-400 hover:to-blue-200"
                  >
                    {page.icon}
                  </motion.div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {page.name}
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base max-w-xs">
                    Learn more about our {page.name.toLowerCase()} section .
                  </p>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Animated background glow */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </section>
  );
}
