import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
  X,
  Loader
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
  const [selectedProject, setSelectedProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [relatedCertificates, setRelatedCertificates] = useState([]);
  const { data: apiCertificates } = getAllCertificates();

  // Combine Static & Dynamic Services (Hidden ones are not filtered on public page unless we persist that state globally)
  // For now, we show all.
  let services = [...staticServices];
  if (apiServices && Array.isArray(apiServices)) {
    services = [...apiServices, ...staticServices];
  }

  const resolveAssetUrl = (proj, path) => {
    if (!path) return "";
    return proj.isDynamic ? getImageUrl(path) : path;
  };

  const getLinkedServicesForProject = (project) => {
    if (!project) return [];
    const projId = project.dbId || project.id;
    const explicitServices = services.filter(s => {
      const linkedIds = (s.linkedProjectIds || s.LinkedProjectIds || "").split(',').filter(Boolean);
      return linkedIds.includes(String(projId)) || linkedIds.includes(String(project.id));
    });
    const scopeLower = (project.scope || "").toLowerCase();
    const matchedServices = services.filter(s => {
      if (!s.title) return false;
      return scopeLower.includes(s.title.toLowerCase());
    });
    return Array.from(new Set([...explicitServices, ...matchedServices]));
  };

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
          id: `api-${p.id}`,
          dbId: p.id,
          isDynamic: true,
          isStatic: false,
          images: [
            p.image || p.Image,
            ...(p.images || p.Images || []).map(img => img?.image || img?.Image || img)
          ].filter(Boolean),
          category: p.category || p.Category || "Commercial",
          scope: p.scope || p.Scope || "",
          description: p.description || p.Description || "",
          area: p.area || p.Area || "",
          contractor: p.contractor || p.Contractor || "",
          owner: p.owner || p.Owner || "",
          video: p.video || p.Video || null,
          isMultiPhase: p.isMultiPhase || p.IsMultiPhase || false,
          phases: p.phases || p.Phases || [],
        }));
        combinedProjects = [...mappedDynamic, ...combinedProjects];
      }

      // Filter logic: Check if project scope includes the service title OR if explicitly linked
      const filtered = combinedProjects.filter(project => {
        const matchesText = project.scope && project.scope.toLowerCase().includes(title.toLowerCase());
        if (matchesText) return true;

        if (currentService?.linkedProjectIds) {
          const linkedIds = Array.isArray(currentService.linkedProjectIds)
            ? currentService.linkedProjectIds
            : String(currentService.linkedProjectIds).split(',').filter(Boolean);

          const projIdStr = String(project.id);
          const rawId = String(project.dbId || project.id).replace('api-', '');

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
        const element = document.getElementById("services-results");
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
                onClick={() => handleServiceClick(service.title)}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform h-full flex flex-col items-center text-center cursor-pointer"
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

      <div id="services-results" className="w-full scroll-mt-24 md:scroll-mt-32">
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-12 bg-gray-50/50 mb-12"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col items-center mb-10">
                <h3 className="text-3xl font-black text-gray-800 text-center">
                  Projects featuring <span className="text-primary">{selectedService}</span>
                </h3>
                <div className="w-20 h-1.5 bg-primary mt-4 rounded-full"></div>
              </div>

              {relatedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedProjects.map((project, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden group cursor-pointer border border-gray-100"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={resolveAssetUrl(project, project.images?.[0])}
                          alt={project.title}
                          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110 rounded-t-3xl"
                          onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-primary/60 transition flex items-end justify-center opacity-0 group-hover:opacity-100 rounded-t-3xl">
                          <span className="bg-white text-primary px-4 py-2 mb-6 rounded-lg text-base font-semibold shadow-lg animate-bounce">
                            View Details
                          </span>
                        </div>
                      </div>
                      <div className="p-7 flex flex-col gap-2">
                        <h3 className="text-2xl font-bold mb-1 text-primary group-hover:opacity-80 transition">
                          {project.title}
                        </h3>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          {project.category || 'General'}
                        </p>
                        <p className="text-gray-600 line-clamp-2 leading-relaxed">
                          {project.scope}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 shadow-inner">
                  <p className="text-gray-500 text-lg">No specific projects found highlighting this exact service yet.</p>
                </div>
              )}

              {/* Related Certificates Section */}
              {relatedCertificates.length > 0 && (
                <div className="mt-20">
                  <div className="flex flex-col items-center mb-10">
                    <h3 className="text-2xl font-bold text-gray-800 text-center">
                      Certificates related to <span className="text-primary">{selectedService}</span>
                    </h3>
                    <div className="w-12 h-1 bg-secondary mt-2 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedCertificates.map((cert, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition hover:shadow-md"
                      >
                        <img
                          src={cert.isDynamic ? getImageUrl(cert.image) : cert.image}
                          alt={cert.title}
                          className="w-full h-44 object-cover rounded-xl mb-4"
                          onError={(e) => { e.target.src = "https://placehold.co/200x150?text=No+Image"; }}
                        />
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{cert.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{cert.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* All Our Services Grid */}
      <div className="bg-white py-20 w-full scroll-mt-24" id="services-grid">
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

      {/* Modal Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl transition-all duration-500 overflow-y-auto">
          <div className="bg-white rounded-[40px] shadow-3xl max-w-7xl w-full my-8 relative animate-fadeInUp overflow-hidden">
            {/* Close Button - Premium Corner Style */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[130] bg-gray-900/90 text-white hover:bg-red-600 p-2 md:p-4 rounded-xl md:rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 group hover:scale-110 active:scale-95"
            >
              <X size={20} strokeWidth={3} className="md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-hidden">
              {/* Left Side: Immersive Centered Images section */}
              <div className="w-full lg:w-3/5 h-[450px] lg:h-auto bg-gray-100 relative overflow-hidden">
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation
                  loop={(selectedProject.images && selectedProject.images.length > 1) || selectedProject.video}
                  className="w-full h-full"
                >
                  {/* Images */}
                  {selectedProject.images?.map((img, i) => (
                    <SwiperSlide key={`img-${i}`}>
                      <div className="relative w-full h-full group">
                        <img
                          src={resolveAssetUrl(selectedProject, img)}
                          alt={selectedProject.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://placehold.co/1200x800?text=No+Image"; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>
                    </SwiperSlide>
                  ))}

                  {/* Video */}
                  {selectedProject.video && (
                    <SwiperSlide key="video">
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <video
                          className="w-full h-full object-cover lg:object-contain"
                          controls
                          playsInline
                        >
                          <source src={resolveAssetUrl(selectedProject, selectedProject.video)} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>

              {/* Right Side: Scrollable Information section */}
              <div className="w-full lg:w-2/5 p-8 lg:p-12 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
                      {selectedProject.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                        {selectedProject.category || 'General'}
                      </span>
                      {selectedProject.area && (
                        <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200 uppercase tracking-tighter">
                          {selectedProject.area}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Technical & Services Tabs */}
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                        Details
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedProject.contractor && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Main Contractor</span>
                            <span className="text-base text-gray-800 font-bold">{selectedProject.contractor}</span>
                          </div>
                        )}
                        {selectedProject.owner && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Project Owner</span>
                            <span className="text-base text-gray-800 font-bold">{selectedProject.owner}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                        Certified Solutions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getLinkedServicesForProject(selectedProject).length > 0 ? (
                          getLinkedServicesForProject(selectedProject).map((service, idx) => (
                            <span key={idx} className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-black text-gray-700 hover:text-primary transition-colors cursor-default">
                              {service.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">{selectedProject.scope || "Consultation & Execution"}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Specialized University Stages logic */}
                  {selectedProject.title?.includes("Sabah Al Salem University") && selectedProject.phases?.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      <h3 className="text-xl font-black text-gray-900 uppercase">Development Stages</h3>
                      <div className="space-y-3">
                        {selectedProject.phases.map((phase, idx) => (
                          <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800">{phase.area}</h4>
                              <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-lg">{phase.year}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-relaxed italic line-clamp-2">{phase.scope}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General Phase logic for other projects */}
                  {selectedProject.isMultiPhase && selectedProject.phases?.length > 0 && !selectedProject.title?.includes("Sabah Al Salem University") && (
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      <h3 className="text-xl font-black text-gray-900 uppercase">Project Phases</h3>
                      <div className="space-y-4">
                        {selectedProject.phases.map((phase, idx) => (
                          <div key={idx} className="p-5 border-l-4 border-primary bg-gray-50 rounded-r-2xl">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-black text-gray-900">{phase.area}</span>
                              <span className="text-xs font-bold text-primary">{phase.year}</span>
                            </div>
                            <p className="text-xs text-gray-600">{phase.scope}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.description && (
                    <div className="pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-black text-gray-900 mb-4 uppercase">Background</h3>
                      <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">{selectedProject.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
