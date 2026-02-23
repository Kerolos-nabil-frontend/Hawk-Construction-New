import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/images/logo.jpg";
import logo2 from "../assets/images/Logo2.jpeg";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ direction = "ltr" }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth(); // Access auth user

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

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
        timeZone: "Asia/Kuwait",
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

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navItems = [
    { name: t('navbar.home'), path: "/" },
    { name: t('navbar.about'), path: "/about" },
    { name: t('navbar.projects'), path: "/projects" },
    { name: t('navbar.certificates'), path: "/certificates" },
    { name: t('navbar.careers'), path: "/careers" },
    { name: t('navbar.services'), path: "/services" },
    { name: t('navbar.contact'), path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full bg-gray-50 shadow z-50`} dir={direction}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20 lg:h-24">


        <Link
          to="/"
          className="flex items-center"
        >
          <div className="flex items-center gap-0.5 lg:gap-1 select-none">
            <img
              src={logo}
              alt="HAWK Logo Image"
              className="h-10 lg:h-14 w-auto object-contain"
            />
            <img
              src={logo2}
              alt="HAWK Logo Text"
              className="h-9 lg:h-12 w-auto object-contain"
            />
          </div>
        </Link>


        <div className="space-x-6 hidden lg:flex items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-medium nav-link-custom ${isActive ? "active" : ""}`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Auth Buttons */}
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-lg text-gray-700 font-medium hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : null}


          {/* Language Toggle */}
          <div className="flex items-center gap-2 border-l border-gray-200 pl-6 ml-4">
            <button
              onClick={() => i18n.changeLanguage('en')}
              className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage('ar')}
              className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'ar' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}
            >
              عربي
            </button>
          </div>

          {/* ✅ Kuwait Date & Time */}
          <div className="ml-6 text-sm text-gray-600 text-right">
            <p className="font-semibold">{currentTime} 🇰🇼</p>
            <p>{currentDate}</p>
          </div>
        </div>

        {/* ✅ Mobile Menu Button */}
        <button
          className="lg:!hidden flex items-center justify-center text-primary hover:text-secondary transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:!hidden bg-white shadow-md">
          <div className="flex flex-col items-center space-y-4 py-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`relative font-medium nav-link-custom ${isActive ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2 rounded-lg text-red-600 font-medium hover:bg-red-50 transition w-3/4 text-center"
                >
                  Logout
                </button>
              </>
            ) : null}

            {/* Mobile Language Toggle */}
            <div className="flex items-center gap-4 py-4 border-t border-gray-100 w-3/4 justify-center">
              <button
                onClick={() => { i18n.changeLanguage('en'); setIsOpen(false); }}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition ${i18n.language === 'en' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
              >
                English
              </button>
              <button
                onClick={() => { i18n.changeLanguage('ar'); setIsOpen(false); }}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition ${i18n.language === 'ar' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
              >
                العربية
              </button>
            </div>

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
