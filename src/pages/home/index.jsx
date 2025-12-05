import React from "react";
import { useTranslation } from 'react-i18next';
import HeroCarousel from "./components/HeroCarousel";
import AboutSection from "./components/AboutSection";
import Services from "./components/Services";
import Projects from "./components/Projects";
import { getAllCertificates, getAllSliders } from "../../utils/useServices";

function Home() {
  const { t } = useTranslation();
  const {data: allCertificates, isLoading:certificatesLoading, error:certificatesError} = getAllCertificates();
  const {data: sliderData, isLoading:sliderLoading, error:sliderError} = getAllSliders();
  console.log("data", allCertificates);
  console.log("isLoading", certificatesLoading);
  console.log("error", certificatesError);

  return (
    <div className="bg-background-color text-text-color font-[Britannic Bold Regular]">
      <HeroCarousel />
      <Projects />
      <AboutSection />
      <Services />
    </div>
  );
}

export default Home;