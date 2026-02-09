import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { X } from "lucide-react";
import SEO from "../../components/SEO";
import { allProjects, featuredProjects, Back } from "../../data/projects";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = allProjects.filter((proj) => {
    const matchesCategory =
      category === "All" ||
      (proj.category && proj.category.toLowerCase() === category.toLowerCase());

    const matchesSearch =
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proj.category && proj.category.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50">
      <SEO
        title="Hawk Al Ahlia Projects - Portfolio"
        description="View Hawk Al Ahlia's completed construction projects. See our expertise and quality work in action."
        keywords="Hawk projects, Hawk Al Ahlia portfolio, construction projects, completed work"
        ogUrl="/projects"
      />
      {/* Hero */}
      <section
        className="relative h-[70vh] flex items-center justify-center bg-gray-900 text-white"
        style={{
          backgroundImage: `url(${Back})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Projects</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Explore our featured and completed projects below.
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Featured Projects
          </h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="rounded-2xl shadow-lg"
          >
            {featuredProjects.map((proj, index) => (
              <SwiperSlide key={proj.id || index}>
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedProject(proj)}
                >
                  <img
                    src={proj.images?.[0]}
                    alt={proj.title}
                    className="w-full h-[450px] object-cover rounded-2xl transform group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition rounded-2xl flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white">
                      {proj.title}
                    </h3>
                    <span className="inline-block bg-blue-600/90 text-white text-xs px-2 py-1 rounded mt-2 mb-1">
                      {proj.category}
                    </span>
                    <p className="text-sm mt-2 line-clamp-2 text-white">
                      {proj.scope}
                    </p>
                    <button className="mt-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-gray-200">
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
              "Recently Added",
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
                  ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj, index) => (
            <div
              key={proj.id || index}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden group cursor-pointer border border-gray-100"
              onClick={() => setSelectedProject(proj)}
            >
              <div className="relative">
                {proj.images && proj.images.length > 0 ? (
                  <img
                    src={proj.images[0]}
                    alt={proj.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-500 rounded-t-3xl"
                  />
                ) : (
                  <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-blue-700/60 transition flex items-end justify-center opacity-0 group-hover:opacity-100 rounded-t-3xl">
                  <span className="bg-white text-blue-700 px-4 py-2 mb-6 rounded-lg text-base font-semibold shadow-lg animate-bounce">
                    View Details
                  </span>
                </div>
              </div>
              <div className="p-7 flex flex-col gap-2">
                <h3 className="text-2xl font-bold mb-1 text-blue-700 group-hover:text-blue-900 transition">
                  {proj.title}
                </h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {proj.category}
                </p>
                <p className="text-gray-600 line-clamp-2 leading-relaxed">
                  {proj.scope}
                </p>
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

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeInUp">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition z-10"
              onClick={() => setSelectedProject(null)}
            >
              <X className="text-gray-600" size={24} />
            </button>

            <div className="p-6 md:p-10">
              {/* Determine media type */}
              {selectedProject.isMultiPhase ? (
                <div className="rounded-2xl overflow-hidden mb-6 bg-gray-50 p-4">
                  <h3 className="text-xl font-bold mb-4 text-center">Project Phases</h3>
                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation
                    spaceBetween={20}
                    className="rounded-xl"
                  >
                    {selectedProject.phases?.map((phase, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h4 className="font-bold text-lg text-blue-600">Phase {idx + 1}</h4>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{phase.year}</span>
                          </div>
                          <div className="space-y-3">
                            <div className="border-l-4 border-blue-500 pl-4">
                              <p className="text-sm text-gray-500 font-semibold uppercase">Area</p>
                              <p className="text-lg text-gray-700">{phase.area}</p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-4">
                              <p className="text-sm text-gray-500 font-semibold uppercase">Contractor</p>
                              <p className="text-lg text-gray-700">{phase.contractor}</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-4">
                              <p className="text-sm text-gray-500 font-semibold uppercase">Scope of Work</p>
                              <p className="text-lg text-gray-700">{phase.scope}</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden mb-6">
                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation
                    loop
                    className="rounded-2xl overflow-hidden"
                  >
                    {/* Images */}
                    {selectedProject.images?.map((img, i) => (
                      <SwiperSlide key={`img-${i}`}>
                        <img
                          src={img}
                          alt={selectedProject.title}
                          className="w-full h-[550px] object-cover"
                        />
                      </SwiperSlide>
                    ))}

                    {/* Video */}
                    {selectedProject.video && (
                      <SwiperSlide key="video">
                        <div className="relative w-full h-[550px] bg-black flex items-center justify-center">
                          <video
                            className="w-full h-full object-contain"
                            controls
                            playsInline
                            controlsList="nodownload"
                          >
                            <source src={selectedProject.video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </SwiperSlide>
                    )}
                  </Swiper>
                </div>
              )}

              {/* Content */}
              <div className="px-2">
                <h2 className="text-3xl font-bold mb-2 text-blue-700">
                  {selectedProject.title}
                </h2>
                <div className="mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200 uppercase tracking-wide">
                    {selectedProject.category}
                  </span>
                </div>

                {!selectedProject.isMultiPhase && (
                  <>
                    <p className="text-gray-700 mb-2 text-lg">
                      <strong className="text-gray-900">Area:</strong> {selectedProject.area}
                    </p>

                    {selectedProject.scope && (
                      <p className="text-gray-700 mb-2 text-lg leading-relaxed">
                        <strong className="text-gray-900">Scope:</strong> {selectedProject.scope}
                      </p>
                    )}

                    {selectedProject.contractor && (
                      <p className="text-gray-700 text-lg">
                        <strong className="text-gray-900">Contractor:</strong>{" "}
                        {selectedProject.contractor}
                      </p>
                    )}
                  </>
                )}

                {selectedProject.isMultiPhase && (
                  <div className="bg-blue-50 rounded-xl p-6 mt-4">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      <strong className="text-gray-900">Project Overview:</strong> This project was completed across multiple phases from 2017 to 2019, involving several contractors and covering various areas including Cup 1, 2, 3, Parcel 800 Series, and SAAF Packages 1 & 2.
                    </p>
                    <p className="text-gray-700 text-lg mt-3">
                      <strong className="text-gray-900">Total Scope:</strong> {selectedProject.scope}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;