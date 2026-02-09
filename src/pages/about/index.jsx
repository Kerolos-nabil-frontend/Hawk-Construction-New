import React from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Library from "../../assets/images/Library.jpg";
import Building from "../../assets/images/Building.jpg";
import Directorate from "../../assets/images/Directorate.jpg";
import Bank from "../../assets/images/Bank.jpg";
import SEO from "../../components/SEO";

export default function AboutIntro() {
  const { t } = useTranslation();

  const slides = [
    {
      text: "Eng /Hany Samir Abdallah began his professional journey in the construction field in 2005, driven by a deep passion for the industry and a strong entrepreneurial spirit. From the beginning, he dedicated himself to expanding his technical knowledge and developing the skills required to lead in project execution and management.",
      img: Library,
    },
    {
      text: "Since the company was founded in 2015, Hawk Al Ahlia has been actively delivering specialized contracting and construction services across a wide range of sectors including commercial centers, banks, hotels, resorts, universities, highways, and bridges.",
      img: Building,
    },
    {
      text: "Our journey began with a focus on finishing works such as painting, gypsum plaster, cement plaster, and fair face. Over time, we expanded our capabilities to include exterior finish systems and exterior insulation finish systems.",
      img: Directorate,
    },
    {
      text: "With a highly skilled team and a proven track record of successful project delivery, Hawk Al Ahlia continues to grow and evolve, and now we are also operating our New branch at Dubai U.A.E. maintaining all our services overseas from Kuwait to United Arab Emirates committed to quality, safety, innovation, and exceeding client expectations in every project we undertake.",
      img: Bank,
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-black">
      <SEO
        title="About Hawk Al Ahlia - Company Profile"
        description="Learn about Hawk Al Ahlia. Discover our mission, vision, and commitment to excellence in construction and contracting."
        keywords="Hawk Al Ahlia, about us, company, profile, history"
        ogUrl="/about"
      />
      <Swiper
        effect="fade"
        navigation
        pagination={{
          type: "progressbar",
        }}
        modules={[EffectFade, Pagination, Navigation]}
        className="w-full h-full about-swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[90vh] md:h-screen overflow-hidden">
              {/* Background Image */}
              <motion.img
                src={slide.img}
                alt={`Slide ${i}`}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6 md:px-20">
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed"
                >
                  {slide.text}
                </motion.p>

                {/* Stats only on last slide */}
                {i === slides.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="mt-12 grid grid-cols-3 gap-6 text-white"
                  >
                    {[
                      { num: "20+", label: t("about.yearsExperience") },
                      { num: "100+", label: t("about.projectsDelivered") },
                      { num: "50+", label: t("about.clients") },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all"
                      >
                        <h3 className="text-3xl md:text-4xl font-bold text-cyan-400">
                          {item.num}
                        </h3>
                        <p className="text-sm md:text-base text-gray-200 mt-2">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
