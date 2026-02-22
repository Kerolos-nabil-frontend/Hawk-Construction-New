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
    return () => clearInterval(timer);
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
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20 md:h-24">


        <Link
          to="/"
          className="flex items-center"
        >
          <div className="flex items-center gap-0.5 md:gap-1 select-none">
            <img
              src={logo}
              alt="HAWK Logo Image"
              className="h-10 md:h-14 w-auto object-contain"
            />
            <img
              src={logo2}
              alt="HAWK Logo Text"
              className="h-9 md:h-12 w-auto object-contain"
            />
          </div>
        </Link>


        <div className="space-x-6 hidden md:flex items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-medium transition-colors duration-300 ${isActive ? "text-primary" : "text-gray-700 hover:text-primary"
                  }`}
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


          {/* ✅ Kuwait Date & Time */}
          <div className="ml-6 text-sm text-gray-600 text-right">
            <p className="font-semibold">{currentTime} 🇰🇼</p>
            <p>{currentDate}</p>
          </div>
        </div>

        {/* ✅ Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-primary"
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
                  className={`relative font-medium ${isActive ? "text-primary" : "text-gray-700 hover:text-primary"
                    }`}
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
