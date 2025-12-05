import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, XCircle } from "lucide-react";

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ name: "", cv: null, coverLetter: "" });
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const vacancies = [
    { id: 1, title: "Civil Engineer", location: "Kuwait", type: "Full-time" },
    { id: 2, title: "Site Supervisor", location: "Kuwait", type: "Full-time" },
    { id: 3, title: "Project Manager", location: "Kuwait", type: "Full-time" },
    { id: 4, title: "Electrical Engineer", location: "Kuwait", type: "Part-time" },
    { id: 5, title: "Architect", location: "Kuwait", type: "Full-time" },
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cv || !formData.coverLetter) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setShowModal(false);
    setShowSuccess(true);
    setFormData({ name: "", cv: null, coverLetter: "" });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-24 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto px-4"
        >
          <h1 className="text-5xl font-extrabold mb-4">Join Our Team</h1>
          <p className="text-lg text-blue-100">
            Build your career with <span className="font-semibold">HAWK</span> —
            where innovation meets opportunity.
          </p>
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0 w-full h-24 bg-white rounded-t-[50%]"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </section>

      {/* Vacancies Section */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 text-gray-900"
        >
          Current <span className="text-blue-600">Opportunities</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {vacancies.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{job.type}</p>
              <button
                onClick={() => handleApply(job)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Apply Now
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
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Submit
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
