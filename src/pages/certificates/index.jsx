import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { certificates as staticCertificates, references } from "../../data/certificates";
import { useTranslation } from "react-i18next";
import { allProjects as staticProjects } from "../../data/projects";
import { getAllCertificates, getAllProjects, getAllServices } from "../../utils/useServices";
import { getImageUrl } from "../../utils/imageHelper";
import HeroSlider from "../../components/HeroSlider";

const CertificatesPage = () => {
  const { t } = useTranslation();
  const { data: apiCertificates, isLoading: certsLoading } = getAllCertificates();
  const { data: apiProjects, isLoading: projectsLoading } = getAllProjects();
  const { data: apiServices, isLoading: servicesLoading } = getAllServices();
  const isLoading = certsLoading || projectsLoading || servicesLoading;

  const [activeTab, setActiveTab] = useState("certificates"); // "certificates" or "approvals"
  const [services, setServices] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [allCertificates, setAllCertificates] = useState([]);
  const [displayReferences, setDisplayReferences] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isReferenceOpen, setIsReferenceOpen] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    let combined = [...staticCertificates, ...references];
    if (apiCertificates && Array.isArray(apiCertificates)) {
      const mapped = apiCertificates.map(c => ({
        ...c,
        id: `api-${c.id}`,
        apiId: c.id,
        image: getImageUrl(c.image),
        category: c.category ? c.category.toLowerCase() : 'certificate'
      }));
      combined = [...mapped, ...staticCertificates, ...references];
    }
    setAllCertificates(combined);
  }, [apiCertificates]);

  useEffect(() => {
    // 1. Set main display items (Certificates or Approvals)
    if (activeTab === "approvals") {
      setCertificates(allCertificates.filter(c => c.category === "approval"));
    } else {
      setCertificates(allCertificates.filter(c => c.category === "certificate"));
    }

    // 2. Set Reference documents
    setDisplayReferences(allCertificates.filter(c => c.category === "reference"));
  }, [activeTab, allCertificates]);

  useEffect(() => {
    import('../../data/servicesData').then(mod => {
      let combined = [...mod.staticServices];
      if (apiServices && Array.isArray(apiServices)) {
        combined = [...apiServices, ...combined];
      }
      setServices(combined);
    });
  }, [apiServices]);

  // Helper to find related projects
  const findRelatedProjects = (certificate) => {
    if (!certificate) return [];

    let combinedProjects = staticProjects.map(p => ({ ...p, isStatic: true }));

    if (apiProjects && Array.isArray(apiProjects)) {
      const mappedDynamic = apiProjects.map(p => {
        const rawImages = p.images || p.Images || [];
        const mappedImages = rawImages.map(img => getImageUrl(typeof img === 'object' ? img.image : img));
        const mainImage = getImageUrl(p.image);

        return {
          ...p,
          id: `dynamic-${p.id}`,
          isStatic: false,
          image: mainImage,
          images: mappedImages.length > 0 ? mappedImages : [mainImage],
          linkedCertificate: p.linkedCertificate
        };
      });
      combinedProjects = [...mappedDynamic, ...combinedProjects];
    }

    return combinedProjects.filter(project => {
      if (project.linkedCertificate) {
        const certIdStr = String(certificate.id);
        const projCertIdStr = String(project.linkedCertificate);
        if (certIdStr === projCertIdStr) return true;
        if (certIdStr.replace('api-', '') === projCertIdStr) return true;
        // Also check apiId if mapped
        if (certificate.apiId && String(certificate.apiId) === projCertIdStr) return true;
      }

      const certificateTitle = certificate.title;
      if (!certificateTitle) return false;

      const searchTerms = certificateTitle.toLowerCase().split(' ').filter(word => word.length > 3 && !['from', 'certificate', 'company', 'ministry'].includes(word));
      if (searchTerms.length === 0) return false;

      const projectTitle = project.title.toLowerCase();
      if (projectTitle.includes(certificateTitle.toLowerCase())) return true;

      const matchCount = searchTerms.reduce((acc, term) => projectTitle.includes(term) ? acc + 1 : acc, 0);
      if (matchCount >= 2) return true;

      if (certificate.linkedProjectIds) {
        const linkedIds = certificate.linkedProjectIds.split(',').filter(Boolean);
        const projIdStr = String(project.id).replace('dynamic-', '').replace('api-', '').replace('static-', '');
        if (linkedIds.includes(projIdStr) || linkedIds.includes(String(project.id))) return true;
      }

      return false;
    });
  };

  const handleCertificateClick = (index) => {
    setSelectedIndex(index);
    const cert = certificates[index];
    setRelatedProjects(findRelatedProjects(cert));
  };

  const handleReferenceClick = (index) => {
    setIsReferenceOpen(index);
    const ref = displayReferences[index];
    setRelatedProjects(findRelatedProjects(ref));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (selectedIndex !== null) {
        if (e.key === "ArrowRight") {
          const nextIndex = (selectedIndex + 1) % certificates.length;
          handleCertificateClick(nextIndex);
        } else if (e.key === "ArrowLeft") {
          const prevIndex = (selectedIndex - 1 + certificates.length) % certificates.length;
          handleCertificateClick(prevIndex);
        } else if (e.key === "Escape") {
          setSelectedIndex(null);
          setRelatedProjects([]);
        }
      }
      if (isReferenceOpen !== null && e.key === "Escape") {
        setIsReferenceOpen(null);
        setRelatedProjects([]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, isReferenceOpen, certificates]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render Linked Services Helper
  const renderLinkedServices = (item) => {
    if (!item) return null;

    // 1. Get services explicitly linked via linkedServiceIds (Certificate -> Service)
    const forwardIds = (item.linkedServiceIds || "").split(',').filter(Boolean);
    const forwardServices = forwardIds.map(id => {
      return services.find(s =>
        String(s.id) === String(id) ||
        String(s.id) === `static-${id}` ||
        (s.id && String(s.id).replace('static-', '') === String(id))
      );
    }).filter(Boolean);

    // 2. Get services that link to this certificate via linkedCertificate (Service -> Certificate)
    const certId = item.apiId || item.id;
    const backwardServices = services.filter(s => {
      const link = s.linkedCertificate || s.LinkedCertificate;
      return String(link) === String(certId) || String(link) === String(item.id);
    });

    // Combine and unique
    const allLinkedServices = Array.from(new Set([...forwardServices, ...backwardServices]));

    if (allLinkedServices.length === 0) return null;

    return (
      <div className="mt-8 pt-8 border-t border-gray-100">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Certified Solutions</h4>
        <div className="flex flex-wrap gap-3">
          {allLinkedServices.map((service, idx) => {
            return (
              <span key={idx} className="bg-gray-50 text-gray-800 px-5 py-2.5 rounded-2xl text-xs font-extrabold border border-gray-100 shadow-sm transition-all hover:border-primary/30 hover:text-primary">
                {service.title}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSlider locationId={4} />

      {/* Tab Switcher */}
      <div className="max-w-4xl mx-auto pt-16 px-4">
        <div className="flex justify-center mt-20 p-1 bg-gray-200/50 rounded-2xl backdrop-blur-sm shadow-inner overflow-hidden">
          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex-1 py-4 px-8 rounded-xl font-bold transition-all duration-300 transform ${activeTab === "certificates"
                ? "bg-white text-primary shadow-xl scale-100"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/30 scale-95"
              }`}
          >
            Certificates
          </button>
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex-1 py-4 px-8 rounded-xl font-bold transition-all duration-300 transform ${activeTab === "approvals"
                ? "bg-white text-primary shadow-xl scale-100"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/30 scale-95"
              }`}
          >
            Approvals
          </button>
        </div>
      </div>

      {/* Section Header */}
      <motion.div
        key={activeTab}
        className="text-center mb-10 pt-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          {activeTab === "certificates" ? "Our Certificates" : "Our Approvals"}
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto px-4 italic font-medium">
          {activeTab === "certificates"
            ? "We are proud to hold international certifications that reflect our commitment to excellence, sustainability, and quality production."
            : "Official approvals and recognition from major public works, governmental bodies, and educational institutions."}
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='wait'>
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                onClick={() => handleCertificateClick(index)}
                className="group cursor-pointer bg-white shadow-md hover:shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 border border-transparent hover:border-primary/20"
              >
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <motion.img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="bg-white/90 text-primary px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{cert.title}</h3>
                  <div className="w-12 h-1 bg-primary/20 mx-auto mt-3 group-hover:w-24 transition-all duration-500" />
                  <p className="text-gray-500 mt-3 text-sm line-clamp-2">{cert.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {certificates.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-400 font-medium">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Reference Documents Section (Always Visible) */}
      <div className="bg-white py-24 border-t border-gray-100">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Reference Documents</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto px-6 italic">
            Explore our technical resources and official company credentials.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500 }}
            loop={displayReferences.length > 1}
            breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {displayReferences.map((ref, index) => (
              <SwiperSlide key={ref.id || index}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition"
                >
                  <motion.img
                    src={ref.image}
                    alt={ref.title}
                    className="h-72 w-full object-cover pointer-events-none select-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                  />
                  <div className="p-5 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{ref.title}</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReferenceClick(index)}
                      className="mt-4 px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
                    >
                      Show Details
                    </motion.button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Modal Components */}
      <AnimatePresence>
        {isReferenceOpen !== null && displayReferences[isReferenceOpen] && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <button
                onClick={() => { setIsReferenceOpen(null); setRelatedProjects([]); }}
                className="absolute top-6 right-6 text-gray-400 hover:text-red-500 z-[110] transition-colors p-2 bg-gray-100 rounded-full"
              >
                <X size={28} />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 h-[400px] md:h-auto bg-gray-50 flex items-center justify-center p-8">
                  <img
                    src={displayReferences[isReferenceOpen]?.image}
                    alt={displayReferences[isReferenceOpen]?.title}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  />
                </div>
                <div className="w-full md:w-1/2 p-10 overflow-y-auto bg-white">
                  <h2 className="text-3xl font-black text-gray-900">{displayReferences[isReferenceOpen]?.title}</h2>
                  <p className="mt-6 text-gray-600 leading-relaxed text-lg">{displayReferences[isReferenceOpen]?.description}</p>

                  {renderLinkedServices(displayReferences[isReferenceOpen])}

                  {relatedProjects.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-100">
                      <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        Related Projects
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedProjects.map((project, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-2xl p-4 flex gap-4 items-center border border-gray-100 hover:shadow-md transition cursor-default">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                              <img src={project.isStatic ? (project.images?.[0] || project.image) : project.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 truncate">{project.title}</h4>
                              <p className="text-xs text-gray-500 truncate">{project.scope}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedIndex !== null && certificates[selectedIndex] && (
          <motion.div
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-7xl w-full bg-white rounded-[40px] shadow-3xl overflow-hidden max-h-[92vh]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                onClick={() => { setSelectedIndex(null); setRelatedProjects([]); }}
                className="absolute top-8 right-8 text-gray-400 hover:text-red-500 z-[110] transition-all p-3 bg-gray-50 rounded-2xl shadow-sm"
              >
                <X size={28} />
              </button>

              <div className="flex flex-col lg:flex-row h-full">
                <div className="w-full lg:w-3/5 h-[450px] lg:h-auto bg-[#f8f9fa] flex items-center justify-center p-12 lg:p-20">
                  <motion.img
                    src={certificates[selectedIndex]?.image}
                    alt={certificates[selectedIndex]?.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                  />
                </div>
                <div className="w-full lg:w-2/5 p-12 lg:p-16 overflow-y-auto bg-white">
                  <h2 className="text-4xl font-black text-gray-900 leading-tight mb-8">{certificates[selectedIndex]?.title}</h2>
                  <p className="text-xl text-gray-500 font-medium italic border-l-4 border-primary/30 pl-6 mb-12">
                    "{certificates[selectedIndex]?.description}"
                  </p>

                  {renderLinkedServices(certificates[selectedIndex])}

                  {relatedProjects.length > 0 && (
                    <div className="mt-12 space-y-6">
                      <h3 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">Real-World Applications</h3>
                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4">
                        {relatedProjects.map((project, idx) => (
                          <div key={idx} className="bg-white rounded-3xl p-5 flex gap-5 items-center border border-gray-100 hover:bg-gray-50/50 hover:shadow-xl transition-all duration-300">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                              <img src={project.isStatic ? (project.images?.[0] || project.image) : project.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-extrabold text-gray-900 line-clamp-1">{project.title}</h4>
                              <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tighter">{project.scope}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificatesPage;
