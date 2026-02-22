import React from "react";
import { useTranslation } from 'react-i18next';
import HeroSlider from "../../components/HeroSlider";
import AboutSection from "./components/AboutSection";
import Services from "./components/Services";
import Projects from "./components/Projects";
import SEO from "../../components/SEO";
import { defaultSlides } from "../../data/sliders";

function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-background-color text-text-color font-[Britannic Bold Regular]">
      <SEO
        title="Hawk Al Ahlia - Construction & Contracting"
        description="Hawk Al Ahlia - Professional construction and contracting services. Expert builders in Kuwait delivering quality projects."
        keywords="Hawk, Hawk Al Ahlia, construction, contracting, builders, Kuwait"
        ogUrl="/"
      />
      <HeroSlider locationId={1} staticSlides={defaultSlides} height="h-screen" />
      <Projects />
      <AboutSection />
      <Services />
    </div>
  );
}

export default Home;