import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import Mall from "../../../assets/images/Mall.jpg";
import Bank from "../../../assets/images/Bank.jpg";
import Hospital from "../../../assets/images/Hospital.png";
import Aknan from "../../../assets/videos/Aknan.mp4";
import Messila from "../../../assets/videos/Messila-small.mp4";

const HeroCarousel = () => {
  const videoRefs = useRef([]);
  const swiperRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const slides = [
    {
      type: "video",
      video: Aknan,
      heading: "Aknan Tower: From Finish Works to Landmark",
      text: "Our key of success is the integrated daily effort shared by everyone at Hawk Al Ahlia.",
      button: "Our Services",
      path: "/services",
    },
    {
      type: "image",
      image: Bank,
      heading: "Building the Future",
      text: "Our portfolio includes the development of commercial centers, banks, and hotels.",
      button: "Explore Projects",
      path: "/projects",
    },
    {
      type: "image",
      image: Hospital,
      heading: "Innovative Engineering",
      text: "We deliver quality and precision in every project we undertake.",
      button: "Learn More",
      path: "/about",
    },
    {
      type: "video",
      video: Messila,
      heading: "Messila Beach",
      text: "With a skilled team and proven track record, Hawk Al Ahlia continues to grow and innovate.",
      button: "View Certificates",
      path: "/certificates",
    },
    {
      type: "image",
      image: Mall,
      heading: "Trusted Expertise",
      text: "Delivering exceptional quality and sustainable infrastructure.",
      button: "Contact Us",
      path: "/contact",
    },
  ];

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    const handleSlideChange = () => {
      const currentIndex = swiper.realIndex;

      videoRefs.current.forEach((video, i) => {
        if (video) {
          if (i === currentIndex) {
            video.currentTime = 0;
            video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    };

    swiper.on("slideChangeTransitionEnd", handleSlideChange);
    handleSlideChange();

    return () => {
      swiper.off("slideChangeTransitionEnd", handleSlideChange);
    };
  }, []);

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = newMuted;
    });
  };

  const handleVideoPlay = () => {
    const swiper = swiperRef.current?.swiper;
    if (swiper) swiper.autoplay.stop();
  };

  const handleVideoPause = () => {
    const swiper = swiperRef.current?.swiper;
    if (swiper) swiper.autoplay.start();
  };

  return (
    <section className="relative h-screen overflow-hidden font-[Britannic Bold Regular]">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="h-full"
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        speed={1000}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full bg-center bg-cover">
              {slide.type === "image" ? (
                <div
                  className="absolute inset-0 bg-center bg-cover"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              ) : (
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={slide.video}
                  muted={muted}
                  preload="auto"
                  playsInline
                  controls
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex items-center justify-center h-full px-6">
                <div className="text-center max-w-3xl">
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold text-primary drop-shadow-xl mb-4"
                  >
                    {slide.heading}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-lg md:text-2xl text-white mb-6"
                  >
                    {slide.text}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Link
                      to={slide.path}
                      className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
                    >
                      {slide.button}
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Mute Toggle */}
              {slide.type === "video" && (
                <button
                  onClick={toggleMute}
                  className="absolute bottom-6 right-6 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition z-20"
                >
                  {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Arrows */}
        <div className="swiper-button-prev-custom absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-20 text-white text-3xl cursor-pointer hover:text-blue-400">
          ‹
        </div>
        <div className="swiper-button-next-custom absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-20 text-white text-3xl cursor-pointer hover:text-blue-400">
          ›
        </div>
      </Swiper>
    </section>
  );
};

export default HeroCarousel;
