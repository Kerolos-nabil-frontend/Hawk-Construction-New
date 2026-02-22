import React, { useState } from "react";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, XCircle } from "lucide-react";
import { vacancies as staticVacancies } from "../../data/careers";
import { getAllCareers } from "../../utils/useServices";
import HeroSlider from "../../components/HeroSlider";

const defaultCareerSlide = [
  {
    id: 'static-career-hero',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop',
    heading: 'Join Our Team',
    text: 'Build your career with HAWK — where innovation meets opportunity.'
  }
];

export default function Careers() {
  const { data: apiVacancies, isLoading: apiLoading } = getAllCareers();
  const [vacancies, setVacancies] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", coverLetter: "", cv: null });
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Submission loading
  const [errorSubmit, setErrorSubmit] = useState("");

  React.useEffect(() => {
    let combined = [...staticVacancies];
    if (apiVacancies && Array.isArray(apiVacancies)) {
      const allApi = apiVacancies.map(v => ({
        ...v,
        id: `api-${v.id}`,
        // Ensure static ones default to active if not specified
        isActive: v.isActive !== false
      }));

      // Filter out static ones that have the same title as an API one (de-duplication)
      const apiTitles = new Set(allApi.map(v => v.title.toLowerCase()));
      const filteredStatic = staticVacancies.map(v => ({
        ...v,
        isActive: true // Static vacancies are always active unless we change the data
      })).filter(v => !apiTitles.has(v.title.toLowerCase()));

      combined = [...allApi, ...filteredStatic];
    } else {
      // Fallback for static vacancies
      combined = staticVacancies.map(v => ({ ...v, isActive: true }));
    }
    setVacancies(combined);
  }, [apiVacancies]);


  const handleApply = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    setErrorSubmit("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorSubmit("");

    if (!formData.name || !formData.email || !formData.cv || !formData.coverLetter) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("Email", formData.email);
    data.append("Subject", `Job Application: ${selectedJob.title}`);
    data.append("Body", `Applicant Name: ${formData.name}\n\nCover Letter:\n${formData.coverLetter}`);
    data.append("CV", formData.cv);

    try {
      await api.post("/Career/Apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowModal(false);
      setShowSuccess(true);
      setFormData({ name: "", email: "", coverLetter: "", cv: null });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setErrorSubmit("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSlider locationId={5} staticSlides={defaultCareerSlide} height="h-[60vh]" />

      {/* Vacancies Section */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 text-gray-900"
        >
          <span className="text-primary">Current Opportunities</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {vacancies.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={job.isActive ? { y: -5, scale: 1.03 } : {}}
              className={`bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-all ${!job.isActive ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-xl'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${job.isActive ? 'bg-primary/10' : 'bg-gray-100'} p-3 rounded-full`}>
                    <Briefcase className={job.isActive ? 'text-primary' : 'text-gray-400'} />
                  </div>
                  <h3 className={`text-xl font-bold ${job.isActive ? 'text-gray-800' : 'text-gray-500'}`}>{job.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {job.isActive ? 'Active' : 'Closed'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{job.type}</p>

              <button
                onClick={() => job.isActive && handleApply(job)}
                disabled={!job.isActive}
                className={`w-full py-2.5 rounded-lg font-medium transition ${job.isActive
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {job.isActive ? "Apply Now" : "Vacancy Closed"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl w-full max-w-lg p-8 relative"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
              >
                <XCircle size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Apply for {selectedJob.title}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {errorSubmit && <p className="text-red-500 text-sm text-center">{errorSubmit}</p>}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload CV
                  </label>
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="mt-1 w-full text-sm text-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    rows="4"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    placeholder="Write your cover letter here..."
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-8 right-8 bg-green-600 text-white py-3 px-5 rounded-xl shadow-lg z-50"
          >
            ✅ Application submitted successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
