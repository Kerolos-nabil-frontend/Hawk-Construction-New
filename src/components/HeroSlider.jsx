import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { getAllSliders } from '../utils/useServices';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const API_HOST = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5026';

const HeroSlider = ({ locationId, staticSlides = [], height = "h-[60vh] md:h-[90vh]" }) => {
    const { data: apiSliders, isLoading } = getAllSliders();

    const allHeroSlides = useMemo(() => {
        let slidesData = [];

        if (apiSliders) {
            const dynamicForLocation = apiSliders.filter(s => {
                const loc = s.SliderLocationID || s.sliderLocationID || 1;
                return loc == locationId;
            });
            if (dynamicForLocation.length > 0) {
                slidesData = dynamicForLocation;
            }
        }

        // Combine dynamic and static slides
        if (staticSlides.length > 0) {
            const safeStatic = staticSlides.map(s => ({
                ...s,
                id: s.id && String(s.id).startsWith('static') ? s.id : `static-${s.id || Math.random()}`,
                isStatic: true
            }));
            slidesData = [...slidesData, ...safeStatic];
        }

        const slides = [];
        slidesData.forEach(s => {
            // Main media
            if (s.image || s.video) {
                slides.push({
                    id: s.id + '-main',
                    type: s.video ? 'video' : 'image',
                    url: s.video || s.image,
                    heading: s.heading,
                    text: s.text,
                    isStatic: s.isStatic
                });
            }

            // Gallery images (Only for dynamic, usually static doesn't have gallery in this app structure yet)
            const gallery = s.images || s.Images || [];
            gallery.forEach((img, idx) => {
                slides.push({
                    id: s.id + '-gallery-' + idx,
                    type: 'image',
                    url: img.image,
                    heading: s.heading,
                    text: s.text,
                    isStatic: s.isStatic
                });
            });
        });

        return slides;
    }, [apiSliders, locationId, staticSlides]);

    // If loading dynamic and we have static, we could show static instantly? 
    // But isLoading is true initially. 
    // If we have staticSlides, we can render them while loading? 
    // Only if apiSliders is undefined. 
    // Let's stick to simple logic: Only render if we have slides.

    if (allHeroSlides.length === 0 && isLoading) return null; // Or skeleton?
    if (allHeroSlides.length === 0) return null;

    return (
        <section className={`relative w-full ${height} bg-black`}>
            <Swiper
                effect="fade"
                navigation
                pagination={{ clickable: true }}
                modules={[EffectFade, Pagination, Navigation, Autoplay]}
                autoplay={{ delay: 5000 }}
                className="w-full h-full"
            >
                {allHeroSlides.map((slide, i) => (
                    <SwiperSlide key={slide.id || i}>
                        <div className="relative w-full h-full">
                            {/* Background Image/Video */}
                            {slide.type === 'video' ? (
                                <video
                                    src={slide.url.startsWith('http') || slide.isStatic ? slide.url : `${API_HOST}${slide.url}`}
                                    className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={slide.url && (slide.url.startsWith('http') || slide.isStatic ? slide.url : `${API_HOST}${slide.url}`)}
                                    alt={slide.heading}
                                    className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
                                    onError={(e) => { e.target.src = "https://placehold.co/1920x1080?text=No+Image"; }}
                                />
                            )}

                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-20 z-10">
                                {slide.heading && (
                                    <motion.h2
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
                                    >
                                        {slide.heading}
                                    </motion.h2>
                                )}
                                {slide.text && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-md"
                                    >
                                        {slide.text}
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default HeroSlider;
