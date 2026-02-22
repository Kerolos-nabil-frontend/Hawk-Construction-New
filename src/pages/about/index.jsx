import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";
import HeroSlider from "../../components/HeroSlider";
import { aboutSlides as defaultAboutSlides } from "../../data/sliders";

export default function AboutIntro() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full bg-black">
      <SEO
        title="About Hawk Al Ahlia - Company Profile"
        description="Learn about Hawk Al Ahlia. Discover our mission, vision, and commitment to excellence in construction and contracting."
        keywords="Hawk Al Ahlia, about us, company, profile, history"
        ogUrl="/about"
      />

      <HeroSlider locationId={2} staticSlides={defaultAboutSlides} height="h-screen" />

      {/* Stats Section - Moved from inside slider to here */}
      <div className="bg-neutral-900 py-12 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white"
          >
            {[
              { num: "20+", label: t("about.yearsExperience") },
              { num: "100+", label: t("about.projectsDelivered") },
              { num: "50+", label: t("about.clients") },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 hover:bg-white/10 transition-all text-center border border-white/10"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                  {item.num}
                </h3>
                <p className="text-lg text-gray-300">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
