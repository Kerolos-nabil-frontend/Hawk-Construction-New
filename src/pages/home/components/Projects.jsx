import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects } from '../../../utils/useServices';
import { allProjects as staticProjects } from '../../../data/projects';
import { getImageUrl } from '../../../utils/imageHelper';

const Projects = () => {
  const { data: apiProjects, isLoading, error } = getAllProjects();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let combinedProjects = [...staticProjects];

    if (apiProjects && Array.isArray(apiProjects)) {
      const formattedApiProjects = apiProjects.map(proj => ({
        ...proj,
        id: `api-${proj.id}`,
        images: (proj.image || proj.Image) ? [proj.image || proj.Image] : [],
        category: proj.category || proj.Category || proj.projectCategory || proj.ProjectCategory || proj.categoryName || "Commercial",
        scope: proj.scope || proj.Scope || "",
        owner: proj.owner || proj.Owner || "",
        isDynamic: true
      }));

      // Combine: API projects first
      combinedProjects = [...formattedApiProjects, ...staticProjects];
    }
    setProjects(combinedProjects.slice(0, 3)); // Show top 3
  }, [apiProjects]);

  const resolveAssetUrl = (proj, path) => {
    if (!path) return "";
    return proj.isDynamic ? getImageUrl(path) : path;
  };

  if (isLoading) return <div className="py-20 text-center">Loading Projects...</div>;

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-[Britannic Bold Regular]">Our Latest Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most recent construction and contracting achievements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={resolveAssetUrl(proj, proj.images?.[0])}
                  alt={proj.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Link to="/projects" className="bg-white text-primary px-4 py-2 rounded-full font-semibold">View Details</Link>
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">{proj.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2 group-hover:text-primary transition">{proj.title}</h3>
                <p className="text-gray-600 line-clamp-2 text-sm">{proj.scope}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/projects" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold shadow hover:opacity-90 transition">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Projects
