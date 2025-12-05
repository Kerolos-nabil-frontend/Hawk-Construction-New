import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import {
  Hammer,
  Building2,
  Layers,
  Ruler,
  Wrench,
  BrickWall,
  Square,
  Grid,
  Circle,
} from "lucide-react";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Services() {
  const { t } = useTranslation();

  const services = [
    { title: "Civil Works", icon: <Building2 size={42} /> },
    { title: "Finish Works", icon: <Hammer size={42} /> },
    { title: "Concrete Forming & Casting", icon: <Layers size={42} /> },
    { title: "EIFS System (ETICS)", icon: <Ruler size={42} /> },
    { title: "Steel Reinforcement", icon: <Wrench size={42} /> },
    { title: "Hard Escape", icon: <Grid size={42} /> },
    { title: "Gypsum Board Floor", icon: <Square size={42} /> },
    { title: "All Types of Rendering Systems", icon: <Layers size={42} /> },
    { title: "Precast Terrazzo Tiles & Cast In-situ", icon: <Circle size={42} /> },
    { title: "Block Work", icon: <BrickWall size={42} /> },
    { title: "Self Leveling", icon: <Grid size={42} /> },
    { title: "Screed", icon: <Layers size={42} /> },
    { title: "Ceramic Tiling", icon: <Square size={42} /> },
    { title: "Maintenance", icon: <Wrench size={42} /> },
    { title: "Marbles & Granite", icon: <Circle size={42} /> },
    { title: "Curb Stone & Interlock Tiles", icon: <Grid size={42} /> },
    { title: "Micro Concrete", icon: <Hammer size={42} /> },
  ];

  return (
    <section className="bg-gray-50 pt-20 overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="max-w-2xl mx-auto text-lg text-blue-100"
        >
          Building excellence through innovation, precision, and craftsmanship.
        </motion.p>

        {/* Subtle wave effect at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            className="relative block w-full h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.19-30.13,172-41.86C655.44-8.44,764.52,3.06,849.73,30.57c72,23.47,146,56.25,222.27,66.58V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#f9fafb"
            ></path>
          </svg>
        </div>
      </div>

      {/* Featured Services Carousel */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-gray-800 mb-10"
        >
          Featured Services
        </motion.h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {services.slice(0, 6).map((service, i) => (
            <SwiperSlide key={i}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform h-full flex flex-col items-center text-center"
              >
                <div className="p-5 rounded-full bg-blue-50 text-blue-600 shadow-inner mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mt-2">
                  {service.title}
                </h3>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* All Services Grid */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            All Our Services
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 8px 25px rgba(59,130,246,0.2)",
                }}
                transition={{ duration: 0.3 }}
                className="p-8 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 transition-all text-center group"
              >
                <div className="flex justify-center mb-4 text-blue-600 group-hover:text-blue-700 transition">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition">
                  {service.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold mb-6"
        >
          Ready to Start Your Next Project?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto"
        >
          Partner with us to turn your vision into reality with quality and innovation.
        </motion.p>
        <motion.a
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 5px 20px rgba(255,255,255,0.3)",
          }}
          href="/contact"
          className="inline-block px-10 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition"
        >
          Contact Us
        </motion.a>
      </div>
    </section>
  );
}
