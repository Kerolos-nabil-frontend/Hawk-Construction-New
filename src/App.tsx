import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Projects from "./pages/projects";
import CertificatesPage from "./pages/certificates";
import Services from "./pages/services";
import Contact from "./pages/contact";
import { Footer } from "components/Footer";
import Careers from "pages/careers";
import CandidateLogin from "pages/careers";
import SiteMapSwiper from "pages/site-map";



import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = direction;
  }, [i18n.language, direction]);

  // Remove handleLanguageToggle, let Navbar handle language switching directly

  return (
    <Router>
  <Navbar direction={direction} />
      <div className="p-2" dir={direction}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/login" element={<CandidateLogin />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/sitemap" element={<SiteMapSwiper />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
