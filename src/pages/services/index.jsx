import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import {
  Hammer,
  Building2,
  Layers,
  Ruler,
  Wrench,
  BrickWall,
  Square,
  Grid,
  Circle,
} from "lucide-react";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { allProjects as staticProjects } from "../../data/projects";
import HeroSlider from "../../components/HeroSlider";
import { getAllProjects, getAllServices, getAllCertificates } from "../../utils/useServices";
import { staticServices } from "../../data/servicesData";
import { getImageUrl } from "../../utils/imageHelper";

const defaultServiceSlide = [
  {
    id: 'static-service-hero',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
    heading: 'Our Services',
    text: 'Building excellence through innovation, precision, and craftsmanship.'
  }
];

export default function Services() {
  const { t } = useTranslation();
  const { data: apiProjects, isLoading: projectsLoading } = getAllProjects();
  const { data: apiServices, isLoading: servicesLoading } = getAllServices();
  const [selectedService, setSelectedService] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [relatedCertificates, setRelatedCertificates] = useState([]);
  const { data: apiCertificates } = getAllCertificates();

  // Combine Static & Dynamic Services (Hidden ones are not filtered on public page unless we persist that state globally)
  // For now, we show all.
  let services = [...staticServices];
  if (apiServices && Array.isArray(apiServices)) {
    services = [...staticServices, ...apiServices];
  }

  const handleServiceClick = (title) => {
    if (selectedService === title) {
      setSelectedService(null);
      setRelatedProjects([]);
    } else {
      setSelectedService(title);

      // Find current service ID (to match linkedServiceIds in certs)
      const currentService = services.find(s => s.title === title);
      const serviceId = currentService?.id;

      // Combine Static & Dynamic Projects
      let combinedProjects = staticProjects.map((p, i) => ({
        ...p,
        id: `static-${i}`,
        isStatic: true,
        // Normalize images for static
        images: Array.isArray(p.images) ? p.images : [p.images]
      }));

      if (apiProjects && Array.isArray(apiProjects)) {
        const mappedDynamic = apiProjects.map(p => ({
          ...p,
          id: `dynamic-${p.id}`, // specific ID format if needed
          isStatic: false,
          // Normalize images: Backend returns Images as array of objects {image: "url"}
          images: p.Images ? p.Images.map(img => getImageUrl(img.image)) : (p.image ? [getImageUrl(p.image)] : []),
          // Ensure main image is also processed
          image: getImageUrl(p.image)
        }));
        combinedProjects = [...mappedDynamic, ...combinedProjects];
      }

      // Filter logic: Check if project scope includes the service title OR if explicitly linked
      const filtered = combinedProjects.filter(project => {
        // Text based matching
        const matchesText = project.scope && project.scope.toLowerCase().includes(title.toLowerCase());
        if (matchesText) return true;

        // Explicit link matching
        if (currentService?.linkedProjectIds) {
          const linkedIds = Array.isArray(currentService.linkedProjectIds)
            ? currentService.linkedProjectIds
            : currentService.linkedProjectIds.split(',').filter(Boolean);

          const projIdStr = String(project.id);
          const rawId = projIdStr.replace('dynamic-', '');

          return linkedIds.includes(projIdStr) || linkedIds.includes(rawId);
        }
        return false;
      });
      setRelatedProjects(filtered);

      // Filter Certificates
      import('../../data/certificates').then(mod => {
        let combinedCerts = [...mod.certificates];
        if (apiCertificates && Array.isArray(apiCertificates)) {
          const mapped = apiCertificates.map(c => ({ ...c, id: `api-${c.id}`, isDynamic: true }));
          combinedCerts = [...mapped, ...combinedCerts];
        }

        const filteredCerts = combinedCerts.filter(cert => {
          // Check text match
          if (cert.description && cert.description.toLowerCase().includes(title.toLowerCase())) return true;
          if (cert.title && cert.title.toLowerCase().includes(title.toLowerCase())) return true;
          // Check explicit link
          if (cert.linkedServiceIds) {
            const linkedIds = cert.linkedServiceIds.split(',').filter(Boolean);
            if (linkedIds.includes(String(serviceId)) || linkedIds.includes(String(serviceId).replace('static-', ''))) return true;
          }
          return false;
        });
        setRelatedCertificates(filteredCerts);
      });

      // Scroll to the results for better UX
      setTimeout(() => {
        const element = document.getElementById("services-grid");
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <section className="bg-gray-50 pt-20 overflow-hidden">
      <HeroSlider locationId={6} staticSlides={defaultServiceSlide} height="h-[60vh]" />

      {/* Featured Services Carousel */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-gray-800 mb-10"
        >
          Featured Services
        </motion.h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {services.slice(0, 6).map((service, i) => (
            <SwiperSlide key={i}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform h-full flex flex-col items-center text-center"
              >
                <div className="p-5 rounded-full bg-primary/10 text-primary shadow-inner mb-4 flex items-center justify-center">
                  {service.icon ? service.icon : (
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.title}
                      className="w-10 h-10 object-contain"
                      onError={(e) => { e.target.src = "https://placehold.co/100?text=S"; }}
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mt-2">
                  {service.title}
                </h3>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* All Services Grid */}
      <div className="bg-white py-20" id="services-grid">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            All Our Services
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {services.map((service, i) => {
              const isSelected = selectedService === service.title;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 8px 25px rgba(30, 66, 102, 0.2)",
                  }}
                  onClick={() => handleServiceClick(service.title)}
                  transition={{ duration: 0.3 }}
                  className={`p-8 rounded-xl border cursor-pointer transition-all text-center group ${isSelected
                    ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                    : "bg-gray-50 border-gray-100 hover:border-primary/30"
                    }`}
                >
                  <div className={`flex justify-center mb-4 transition ${isSelected ? "text-primary" : "text-primary/70 group-hover:text-primary"}`}>
                    {service.icon ? service.icon : (
                      <img
                        src={getImageUrl(service.image)}
                        alt={service.title}
                        className="w-10 h-10 object-contain"
                        onError={(e) => { e.target.src = "https://placehold.co/100?text=S"; }}
                      />
                    )}
                  </div>
                  <h3 className={`text-lg font-semibold transition ${isSelected ? "text-primary" : "text-gray-800 group-hover:text-primary"}`}>
                    {service.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>

          {/* Related Projects Section */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Projects featuring <span className="text-secondary">{selectedService}</span>
              </h3>

              {relatedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedProjects.map((project, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.scope}</p>
                        <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                          {project.category}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">No specific projects found highlighting this exact service in our showcase yet.</p>
                </div>
              )}

              {/* Related Certificates Section */}
              {relatedCertificates.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Certificates related to <span className="text-primary">{selectedService}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedCertificates.map((cert, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition hover:shadow-md"
                      >
                        <img
                          src={cert.isDynamic ? getImageUrl(cert.image) : cert.image}
                          alt={cert.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                          onError={(e) => { e.target.src = "https://placehold.co/200x150?text=No+Image"; }}
                        />
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{cert.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{cert.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold mb-6"
        >
          Ready to Start Your Next Project?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg mb-8 text-white/90 max-w-2xl mx-auto"
        >
          Partner with us to turn your vision into reality with quality and innovation.
        </motion.p>
        <motion.a
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 5px 20px rgba(255,255,255,0.3)",
          }}
          href="/contact"
          className="inline-block px-10 py-4 bg-white text-primary font-semibold rounded-full shadow-md hover:bg-gray-100 transition"
        >
          Contact Us
        </motion.a>
      </div>
    </section>
  );
}
