import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Airport from "../../../assets/images/Airport.jpg";
import Court from "../../../assets/images/Court.jpg";
import Palace from "../../../assets/images/Palace.jpg";

export default function About() {
  return (
  <section className="relative bg-background-color text-text-color font-[Britannic Bold Regular] overflow-hidden pt-20 pb-32 px-6 lg:px-16">
     
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-50"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight font-[Britannic Bold Regular]">
            About <span className="text-secondary">HAWK</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
          Founded in 2015, {" "}<span className="font-semibold text-gray-800">Hawk Al Ahlia Contracting Company </span>
              has built a strong reputation for excellence in construction and specialized contracting across Kuwait and beyond. Guided by a passion for precision, quality, and innovation, we deliver projects that combine engineering expertise with exceptional craftsmanship.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
           Our success is driven by teamwork, careful planning, and an unwavering commitment to exceed client expectations in every detail — from concept to completion.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white shadow-lg rounded-xl text-center"
            >
              <h3 className="text-3xl font-bold text-blue-600">20+</h3>
              <p className="text-gray-500">Years Experience</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white shadow-lg rounded-xl text-center"
            >
              <h3 className="text-3xl font-bold text-blue-600">150+</h3>
              <p className="text-gray-500">Projects Completed</p>
            </motion.div>
          </div>

          <Link
            to="/about"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Learn More
          </Link>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="rounded-2xl shadow-xl overflow-hidden"
          >
            {[Airport, Court, Palace].map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-[420px] md:h-[480px] lg:h-[500px]">
                  <img
                    src={img}
                    alt={`About image ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
