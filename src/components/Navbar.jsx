import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/images/logo.png";

export default function Navbar({ direction = "ltr" }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Africa/Cairo",
      };

      const dateOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "Asia/Kuwait",
      };

      setCurrentTime(now.toLocaleTimeString([], timeOptions));
      setCurrentDate(now.toLocaleDateString([], dateOptions));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: t('navbar.home'), path: "/" },
    { name: t('navbar.about'), path: "/about" },
    { name: t('navbar.projects'), path: "/projects" },
    { name: t('navbar.certificates'), path: "/certificates" },
    { name: t('navbar.careers'), path: "/careers" },
    { name: t('navbar.services'), path: "/services" },
    { name: "Sitemap", path: "/sitemap" },
    { name: t('navbar.contact'), path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow z-50`} dir={direction}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">

        
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600"
        >
          <img src={logo} alt="HAWK Logo" className="h-25 w-25 object-contain" />
        </Link>

        
        <div className="space-x-6 hidden md:flex items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-medium transition-colors duration-300 ${
                  isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          
          {/* <button
            onClick={() => {
              const newLang = i18n.language === 'en' ? 'ar' : 'en';
              i18n.changeLanguage(newLang);
            }}
            className="ml-4 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            {i18n.language === "ar" ? t('navbar.english') : t('navbar.arabic')}
          </button> */}

          {/* ✅ Kuwait Date & Time */}
          <div className="ml-6 text-sm text-gray-600 text-right">
            <p className="font-semibold">{currentTime} 🇰🇼</p>
            <p>{currentDate}</p>
          </div>
        </div>

        {/* ✅ Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center space-y-4 py-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`relative font-medium ${
                    isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Language Switch */}
            <button
              onClick={() => {
                const newLang = i18n.language === 'en' ? 'ar' : 'en';
                i18n.changeLanguage(newLang);
              }}
              className="mt-4 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition"
            >
              {i18n.language === "ar" ? t('navbar.english') : t('navbar.arabic')}
            </button>

            {/* ✅ Kuwait Time & Date */}
            <div className="mt-4 text-center text-sm text-gray-600">
              <p className="font-semibold">{currentTime} 🇰🇼</p>
              <p>{currentDate}</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
