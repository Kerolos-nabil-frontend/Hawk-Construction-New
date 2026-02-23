import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { X, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import HeroSlider from "../../components/HeroSlider";
import { getAllCertificates, getAllProjects, getAllServices } from "../../utils/useServices";
import { certificates as staticCerts, references as staticRefs } from "../../data/certificates";
import { allProjects as staticProjects } from "../../data/projects";
import { projectSlides as defaultProjectSlides } from "../../data/sliders";
import { getImageUrl } from "../../utils/imageHelper";

const Projects = () => {
  const navigate = useNavigate();
  const { data: apiProjects, isLoading: projectsLoading } = getAllProjects();
  const { data: apiServices, isLoading: servicesLoading } = getAllServices();
  const { data: apiCertificates, isLoading: certsLoading } = getAllCertificates();
  const isLoading = projectsLoading || servicesLoading || certsLoading;

  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let combined = [...staticCerts, ...staticRefs].map(c => ({ ...c, isStatic: true }));
    if (apiCertificates && Array.isArray(apiCertificates)) {
      const mapped = apiCertificates.map(c => ({
        ...c,
        id: `api-${c.id}`,
        apiId: c.id,
        image: getImageUrl(c.image),
        category: c.category ? c.category.toLowerCase() : 'certificate'
      }));
      combined = [...mapped, ...combined];
    }
    setCertificates(combined);
  }, [apiCertificates]);

  useEffect(() => {
    import('../../data/servicesData').then(mod => {
      let combined = [...mod.staticServices];
      if (apiServices && Array.isArray(apiServices)) {
        combined = [...apiServices, ...combined];
      }
      setServices(combined);
    });
  }, [apiServices]);

  useEffect(() => {
    let combinedProjects = [...staticProjects];

    if (apiProjects && Array.isArray(apiProjects)) {
      const formattedApiProjects = apiProjects.map(proj => ({
        ...proj,
        // API projects have specific handling
        id: `api-${proj.id}`, // Ensure unique IDs to avoid conflict with static IDs
        dbId: proj.id, // Keep the original database ID for matching
        images: [
          proj.image || proj.Image,
          ...(proj.images || proj.Images || []).map(img => img?.image || img?.Image || img)
        ].filter(Boolean),
        category: proj.category || proj.Category || proj.projectCategory || proj.ProjectCategory || proj.categoryName || "Commercial",
        scope: proj.scope || proj.Scope || "",
        area: proj.area || proj.Area || "",
        contractor: proj.contractor || proj.Contractor || "",
        owner: proj.owner || proj.Owner || proj.projectOwner || proj.ProjectOwner || "",
        description: proj.description || proj.Description || "",
        video: proj.video || proj.Video || null,
        isMultiPhase: proj.isMultiPhase || proj.IsMultiPhase || false,
        phases: proj.phases || proj.Phases || [],
        isDynamic: true
      }));

      // Combine: API projects first (newest), then static
      combinedProjects = [...formattedApiProjects, ...staticProjects];
    }

    setProjects(combinedProjects);
  }, [apiProjects]);

  const featuredProjects = projects.slice(0, 5);

  const filteredProjects = projects.filter((proj) => {
    const matchesCategory =
      category === "All" ||
      (proj.category && proj.category.toLowerCase() === category.toLowerCase());

    const matchesSearch =
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proj.category && proj.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proj.scope && proj.scope.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const resolveAssetUrl = (proj, path) => {
    if (!path) return "";
    return proj.isDynamic ? getImageUrl(path) : path;
  };

  // Helper to get linked services for a project
  const getLinkedServicesForProject = (project) => {
    if (!project) return [];

    // 1. Find services that explicitly link to this project ID
    const projId = project.dbId || project.id;
    const explicitServices = services.filter(s => {
      const linkedIds = (s.linkedProjectIds || s.LinkedProjectIds || "").split(',').filter(Boolean);
      return linkedIds.includes(String(projId)) || linkedIds.includes(String(project.id));
    });

    // 2. Find services whose title is in the project's scope string
    const scopeLower = (project.scope || "").toLowerCase();
    const matchedServices = services.filter(s => {
      if (!s.title) return false;
      return scopeLower.includes(s.title.toLowerCase());
    });

    // Combine and unique
    const unique = Array.from(new Set([...explicitServices, ...matchedServices]));
    return unique;
  };

  // Helper to get linked certificates for a project
  const getLinkedCertificatesForProject = (project) => {
    if (!project || !certificates.length) return [];
    const projId = project.dbId || project.id;
    const certIdFromProject = project.linkedCertificate || project.LinkedCertificate;

    // 1. Explicit link from Project -> Certificate
    const explicitCerts = certificates.filter(c => {
      const cId = c.apiId || c.id;
      return String(cId) === String(certIdFromProject);
    });

    // 2. Explicit link from Certificate -> Project
    const reverseLinkedCerts = certificates.filter(c => {
      const linkedProjIds = (c.linkedProjectIds || c.LinkedProjectIds || "").split(',').filter(Boolean);
      // Strip prefixes so stored raw DB id "5" matches "api-5", "dynamic-5", etc.
      const rawProjId = String(projId).replace('api-', '').replace('dynamic-', '').replace('static-', '');
      return linkedProjIds.includes(String(projId)) ||
        linkedProjIds.includes(String(project.id)) ||
        linkedProjIds.includes(rawProjId);
    });

    // 3. Text based matching (Title matching)
    const matchedCerts = certificates.filter(c => {
      const cTitle = (c.title || "").toLowerCase();
      const pTitle = (project.title || "").toLowerCase();
      if (!cTitle || !pTitle) return false;

      // Check if project title contains certificate title or vice versa
      if (pTitle.includes(cTitle) || cTitle.includes(pTitle)) return true;

      // Term based match
      const cTerms = cTitle.split(' ').filter(word => word.length > 3 && !['from', 'certificate', 'company', 'ministry'].includes(word));
      if (cTerms.length === 0) return false;
      const matchCount = cTerms.reduce((acc, term) => pTitle.includes(term) ? acc + 1 : acc, 0);
      return matchCount >= 2;
    });

    return Array.from(new Set([...explicitCerts, ...reverseLinkedCerts, ...matchedCerts]));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <SEO
        title="Hawk Al Ahlia Projects - Portfolio"
        description="View Hawk Al Ahlia's completed construction projects. See our expertise and quality work in action."
        keywords="Hawk projects, Hawk Al Ahlia portfolio, construction projects, completed work"
        ogUrl="/projects"
      />
      <HeroSlider locationId={3} staticSlides={defaultProjectSlides} height="h-[70vh]" />

      {/* Featured Projects */}
      {featuredProjects.length > 0 && category === "All" && searchTerm === "" && (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Featured Projects
          </h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={featuredProjects.length > 1}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="rounded-2xl shadow-lg"
          >
            {featuredProjects.map((proj) => (
              <SwiperSlide key={proj.id}>
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedProject(proj)}
                >
                  <img
                    src={resolveAssetUrl(proj, proj.images?.[0])}
                    alt={proj.title}
                    className="w-full h-[450px] object-cover rounded-2xl transform group-hover:scale-105 transition duration-500"
                    onError={(e) => { e.target.src = "https://placehold.co/800x450?text=No+Image"; }}
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition rounded-2xl flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white">
                      {proj.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-block bg-primary/90 text-white text-xs px-2 py-1 rounded">
                        {proj.category || 'General'}
                      </span>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2 text-white">
                      {proj.scope}
                    </p>
                    <button className="mt-4 w-fit bg-white text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-gray-200">
                      View Details
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* All Projects */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          All Projects
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "All",
              "Commercial",
              "Educational",
              "Governmental",
              "Healthcare",
              "Residential Buildings",
              "Villas",
              "Hotels",
              "Maintenance and Repair",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold border transition ${category === cat
                  ? "bg-primary text-white border-primary shadow-md scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search projects by title, category, scope..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden group cursor-pointer border border-gray-100"
              onClick={() => setSelectedProject(proj)}
            >
              <div className="relative">
                <img
                  src={resolveAssetUrl(proj, proj.images?.[0])}
                  alt={proj.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition duration-500 rounded-t-3xl"
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
                  {proj.title}
                </h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {proj.category || 'General'}
                </p>
                <p className="text-gray-600 line-clamp-2 leading-relaxed">
                  {proj.scope}
                </p>

                {/* Linked Services (Scope of Work) Section */}
                {(() => {
                  const linkedServices = getLinkedServicesForProject(proj);
                  if (linkedServices.length === 0) return null;
                  return (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block w-full">Scope of Work</span>
                      {linkedServices.map(service => (
                        <button
                          key={service.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/services', { state: { openServiceTitle: service.title } });
                          }}
                          className="text-[11px] font-bold text-secondary hover:text-white hover:bg-secondary bg-secondary/10 px-2 py-1 rounded-lg transition-all"
                        >
                          {service.title}
                        </button>
                      ))}
                    </div>
                  );
                })()}

                {/* Certificate link in card */}
                {(() => {
                  const certs = getLinkedCertificatesForProject(proj);
                  if (certs.length === 0) return null;
                  return (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block w-full">Linked Certificate</span>
                      {certs.map(c => (
                        <button
                          key={c.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedCert(c); }}
                          className="text-[11px] font-bold text-primary hover:underline bg-primary/5 px-2 py-1 rounded"
                        >
                          {c.title}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No projects found.
          </p>
        )}
      </section>

      {/* Modal Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl transition-all duration-500 overflow-y-auto">
          <div className="bg-white rounded-[40px] shadow-3xl max-w-7xl w-full my-8 relative animate-fadeInUp overflow-hidden">
            {/* Close Button - Premium Corner Style */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[130] close-premium-overlay p-2 md:p-4 rounded-xl md:rounded-2xl shadow-2xl backdrop-blur-md group hover:scale-110 active:scale-95"
            >
              <X size={20} strokeWidth={3} className="md:w-6 md:h-6 transition-transform duration-300 group-hover:rotate-90" />
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
                        {/* Soft overlay to make white text readable if pagination/nav is over it */}
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
                        Scope of Work
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getLinkedServicesForProject(selectedProject).length > 0 ? (
                          getLinkedServicesForProject(selectedProject).map((service, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedProject(null);
                                navigate('/services', { state: { openServiceTitle: service.title } });
                              }}
                              className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-black text-gray-700 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                            >
                              {service.title}
                            </button>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">{selectedProject.scope || "Consultation & Execution"}</span>
                        )}
                      </div>
                    </div>

                    {/* Linked Certificates Section in Modal */}
                    {getLinkedCertificatesForProject(selectedProject).length > 0 && (
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
                          Official Credentials
                        </h3>
                        <div className="space-y-3">
                          {getLinkedCertificatesForProject(selectedProject).map((cert, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedCert(cert)}
                              className="w-full flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:shadow-md transition-all group text-left"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" onError={(e) => { e.target.src = "https://placehold.co/100?text=Cert" }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-black text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{cert.title}</h4>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">
                                  {cert.category === "official_approval" ? "Official Approval" :
                                    cert.category === "approval" ? "Client & Partner" :
                                      cert.category || "Certificate"}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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

      {/* Certificate Detail Modal Overlay */}
      {selectedCert && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl transition-all duration-500">
          <div className="bg-white rounded-[40px] shadow-3xl max-w-4xl w-full relative animate-fadeInUp overflow-hidden max-h-[92vh]">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-6 right-6 z-[310] close-premium-overlay p-3 rounded-2xl shadow-sm group hover:scale-110 active:scale-95"
            >
              <X size={24} strokeWidth={3} className="transition-transform duration-300 group-hover:rotate-90" />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-10 h-[300px] md:h-auto">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Certificate"; }}
                />
              </div>
              <div className="w-full md:w-1/2 p-10 md:p-12 overflow-y-auto bg-white flex flex-col justify-center">
                <div className="mb-6">
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                    {selectedCert.category || 'Official Credential'}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 leading-tight mb-6">
                  {selectedCert.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-primary/20 pl-6">
                  {selectedCert.description}
                </p>

                <div className="mt-10 pt-8 border-t border-gray-100 italic text-[11px] text-gray-400">
                  Confirmed through official HAWK Al Ahlia documentation.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;