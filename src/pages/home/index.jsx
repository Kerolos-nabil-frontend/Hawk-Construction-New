import React from "react";
import { useTranslation } from 'react-i18next';
import HeroCarousel from "./components/HeroCarousel";
import AboutSection from "./components/AboutSection";
import Services from "./components/Services";
import Projects from "./components/Projects";
import SEO from "../../components/SEO";
import { getAllCertificates, getAllSliders } from "../../utils/useServices";

function Home() {
  const { t } = useTranslation();
  const { data: allCertificates, isLoading: certificatesLoading, error: certificatesError } = getAllCertificates();
  const { data: sliderData, isLoading: sliderLoading, error: sliderError } = getAllSliders();
  console.log("data", allCertificates);
  console.log("isLoading", certificatesLoading);
  console.log("error", certificatesError);

  return (
    <div className="bg-background-color text-text-color font-[Britannic Bold Regular]">
      <SEO
        title="Hawk Al Ahlia - Construction & Contracting"
        description="Hawk Al Ahlia - Professional construction and contracting services. Expert builders in Kuwait delivering quality projects."
        keywords="Hawk, Hawk Al Ahlia, construction, contracting, builders, Kuwait"
        ogUrl="/"
      />
      <HeroCarousel />
      <Projects />
      <AboutSection />
      <Services />
    </div>
  );
}

export default Home;