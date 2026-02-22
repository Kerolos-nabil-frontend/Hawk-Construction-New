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

import { defaultSlides } from "../../../data/sliders";

const HeroCarousel = ({ apiSliders }) => {
  const videoRefs = useRef([]);
  const swiperRef = useRef(null);
  const [muted, setMuted] = useState(true);

  // Base URL for API images
  const API_HOST = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5026';

  // Determine which slides to show
  // Filter for home page sliders (Location ID 1 or missing/0)
  const homeSliders = apiSliders?.filter(s => {
    const loc = s.SliderLocationID || s.sliderLocationID || 1;
    return loc == 1;
  });

  const slides = (homeSliders && homeSliders.length > 0)
    ? homeSliders.map(s => ({
      type: s.video ? "video" : "image",
      image: s.image ? (s.image.startsWith('http') ? s.image : `${API_HOST}${s.image}`) : null,
      video: s.video ? (s.video.startsWith('http') ? s.video : `${API_HOST}${s.video}`) : null,
      heading: s.heading,
      text: s.text,
      button: "Learn More",
      path: "/contact"
    }))
    : defaultSlides;

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    const handleSlideChange = () => {
      const currentIndex = swiper.realIndex;

      videoRefs.current.forEach((video, i) => {
        if (video) {
          if (i === currentIndex) {
            video.currentTime = 0;
            video.play().catch(() => { });
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
                      className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition"
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
        <div className="swiper-button-prev-custom absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-20 text-white text-3xl cursor-pointer hover:text-secondary">
          ‹
        </div>
        <div className="swiper-button-next-custom absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-20 text-white text-3xl cursor-pointer hover:text-secondary">
          ›
        </div>
      </Swiper>
    </section>
  );
};

export default HeroCarousel;
