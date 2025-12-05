import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Ministry from "./../../assets/images/Ministry.jpg";
import Guard from "./../../assets/images/Guard.png";
import University from "./../../assets/images/University.jpg";
import Jotun from "./../../assets/images/Jotun.png";
import Sika from "./../../assets/images/Sika.png";
import Basf from "./../../assets/images/Basf.png";
import Hempel from "./../../assets/images/Hempel.png";
import Weber from "./../../assets/images/Weber.jpg";
import Sto from "./../../assets/images/Sto.ico";
import License1 from "./../../assets/images/License1.jpg";
import License2 from "./../../assets/images/License2.png";
import License3 from "./../../assets/images/License3.png";


const certificates = [
  { id: 1, title: "Ministry of Public Works", description: "Certificate from Ministry Of Public Works For General Finish Scope", image: Ministry },
  { id: 2, title: "Kuwait National Guard", description: "Certificate from Kuwait National Guard", image: Guard },
  { id: 3, title: "Sabah Al Salem University", description: "Certificate from Sabah Al Salem University", image: University },
  { id: 4, title: "Jotun Paints", description: "Certificate from Jotun Paints", image: Jotun },
  { id: 5, title: "Sika", description: "Certificate from Sika", image: Sika },
  { id: 6, title: "BASF", description: "Certificate from BASF Company", image: Basf },
  { id: 7, title: "HEMPEL", description: "Certificate from HEMPEL Company", image: Hempel },
  { id: 8, title: "Sodamco Weber", description: "Certificate from Sodamco Weber Company", image: Weber },
  { id: 9, title: "Sto Construction", description: "Certificate from Sto Construction Company", image: Sto },
];

const references = [
  { id: 1, title: "Trading license.", description: "Official trading license approved by authorities.", image: License1 },
  { id: 2, title: "Kuwait chamber of commerce & industry certificate", description: "Certificate issued by the Kuwait Chamber of Commerce.", image: License2 },
  { id: 3, title: "Ministry of public works credence.", description: "Credence document by Ministry of Public Works.", image: License3 },
];

const CertificatesPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isReferenceOpen, setIsReferenceOpen] = useState(null);

  
  useEffect(() => {
    const handleKey = (e) => {
      if (selectedIndex !== null) {
        if (e.key === "ArrowRight") {
          setSelectedIndex((prev) => (prev + 1) % certificates.length);
        } else if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
        } else if (e.key === "Escape") {
          setSelectedIndex(null);
        }
      }
      if (isReferenceOpen !== null && e.key === "Escape") {
        setIsReferenceOpen(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, isReferenceOpen]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      {/* Certificates Section */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 pt-10">Our Certificates</h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          We are proud to hold international certifications that reflect our commitment to excellence, sustainability, and safety.
        </p>
      </motion.div>

      
      <div className="max-w-6xl mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
        >
          {certificates.map((cert, index) => (
            <SwiperSlide key={cert.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedIndex(index)}
                className="cursor-pointer bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition"
              >
                <motion.img
                  src={cert.image}
                  alt={cert.title}
                  className="h-64 w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800">{cert.title}</h3>
                  <p className="text-gray-600 mt-2">{cert.description}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      
      <motion.div
        className="text-center mt-20 mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Reference Documents</h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Explore our technical and company reference documents.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500 }}
          loop
          breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
        >
          {references.map((ref, index) => (
            <SwiperSlide key={ref.id}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition"
              >
                <motion.img
                  src={ref.image}
                  alt={ref.title}
                  className="h-72 w-full object-cover pointer-events-none select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="p-5 flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{ref.title}</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsReferenceOpen(index)}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    Show Details
                  </motion.button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

  
      <AnimatePresence>
        {isReferenceOpen !== null && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-3xl w-full bg-white rounded-xl shadow-lg p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setIsReferenceOpen(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <X size={32} />
              </button>
              <img
                src={references[isReferenceOpen].image}
                alt={references[isReferenceOpen].title}
                className="w-full max-h-[60vh] object-contain rounded-lg shadow-md mb-6"
              />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{references[isReferenceOpen].title}</h2>
                <p className="mt-4 text-gray-600">{references[isReferenceOpen].description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-4xl w-full flex flex-col items-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button onClick={() => setSelectedIndex(null)} className="absolute -top-12 right-0 text-white hover:text-gray-300">
                <X size={32} />
              </button>
              <img
                src={certificates[selectedIndex].image}
                alt={certificates[selectedIndex].title}
                className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />
              <div className="mt-4 text-center text-white">
                <h2 className="text-2xl font-bold">{certificates[selectedIndex].title}</h2>
                <p className="mt-2 text-gray-300">{certificates[selectedIndex].description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificatesPage;
