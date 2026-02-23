import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import HeroSlider from "../../components/HeroSlider";

const defaultContactSlide = [
  {
    id: 'static-contact-hero',
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop',
    heading: 'Contact Us',
    text: 'We’d love to hear from you. Reach out and we’ll get back to you promptly.'
  }
];

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState("");
  const [errors, setErrors] = useState({});
  const [contactInfo, setContactInfo] = useState(null);
  const [activeMap, setActiveMap] = useState('kuwait');

  useEffect(() => {
    // Fetch contact details
    api.get("/Contact/GetDetails")
      .then((res) => setContactInfo(res.data))
      .catch((err) => console.error("Failed to fetch contact info", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Email is invalid";
    }
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setErrorSubmit("");
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await api.post("/Contact/Send", {
          Name: formData.name,
          Email: formData.email,
          Subject: formData.subject,
          Message: formData.message,
        });
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } catch (err) {
        console.error(err);
        setErrorSubmit(err.response?.data?.message || "Failed to send message. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <HeroSlider locationId={8} staticSlides={defaultContactSlide} height="h-[50vh]" />

      <div className="py-16 px-4 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">

          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-xl p-8">
            {submitted ? (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-green-600 mb-4">
                  Thank you!
                </h2>
                <p className="text-gray-700">
                  Your message has been sent. We will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {errorSubmit && <p className="text-red-500 text-center">{errorSubmit}</p>}
                {["name", "email", "subject"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${errors[field] ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${errors.message ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Get in Touch
            </h2>

            <p className="text-gray-700">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contactInfo?.email}`} className="text-primary hover:underline">
                {contactInfo?.email || "Loading..."}
              </a>
            </p>

            {/* Kuwait Branch */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kuwait Branch
              </h3>
              <p className="text-gray-700">
                <strong>Phone:</strong>{" "}
                {contactInfo?.kuwaitPhone1 && (
                  <>
                    <a href={`tel:${contactInfo.kuwaitPhone1}`} className="text-primary hover:underline">
                      {contactInfo.kuwaitPhone1}
                    </a>
                    <br />
                  </>
                )}
                {contactInfo?.kuwaitPhone2 && (
                  <a href={`tel:${contactInfo.kuwaitPhone2}`} className="text-primary hover:underline">
                    {contactInfo.kuwaitPhone2}
                  </a>
                )}
              </p>
              {contactInfo?.kuwaitWhatsapp && (
                <p className="text-gray-700 mt-1">
                  <strong>WhatsApp:</strong>{" "}
                  <a
                    href={`https://wa.me/${contactInfo.kuwaitWhatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {contactInfo.kuwaitWhatsapp}
                  </a>
                </p>
              )}
              <p className="text-gray-700 mt-1">
                <strong>Address:</strong>{" "}
                <a
                  href={contactInfo?.kuwaitMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {contactInfo?.kuwaitAddress || "Loading..."}
                </a>
              </p>
            </div>

            {/* UAE Branch */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                U.A.E Branch
              </h3>
              <p className="text-gray-700">
                <strong>Phone:</strong>{" "}
                <a href={`tel:${contactInfo?.uaePhone}`} className="text-primary hover:underline">
                  {contactInfo?.uaePhone || "Loading..."}
                </a>
              </p>
              <p className="text-gray-700 mt-1">
                <strong>Address:</strong>{" "}
                <a
                  href={contactInfo?.uaeMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {contactInfo?.uaeAddress || "Loading..."}
                </a>
              </p>
            </div>

            {/* Additional Branches */}
            {contactInfo?.branches?.map((branch, index) => (
              <div key={branch.id || index} className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {branch.title}
                </h3>
                {branch.phone1 && (
                  <p className="text-gray-700">
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${branch.phone1}`} className="text-primary hover:underline">
                      {branch.phone1}
                    </a>
                    {branch.phone2 && (
                      <>
                        {" / "}
                        <a href={`tel:${branch.phone2}`} className="text-primary hover:underline">
                          {branch.phone2}
                        </a>
                      </>
                    )}
                  </p>
                )}
                {branch.whatsapp && (
                  <p className="text-gray-700 mt-1">
                    <strong>WhatsApp:</strong>{" "}
                    <a
                      href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {branch.whatsapp}
                    </a>
                  </p>
                )}
                {branch.address && (
                  <p className="text-gray-700 mt-1">
                    <strong>Address:</strong>{" "}
                    <a
                      href={branch.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {branch.address}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="max-w-7xl mx-auto px-6 mb-20 relative pt-12">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveMap('kuwait')}
            className={`px-8 py-3 rounded-2xl font-black transition-all shadow-lg ${activeMap === 'kuwait' ? 'bg-primary text-white scale-105' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
          >
            Kuwait Office
          </button>
          <button
            onClick={() => setActiveMap('uae')}
            className={`px-8 py-3 rounded-2xl font-black transition-all shadow-lg ${activeMap === 'uae' ? 'bg-primary text-white scale-105' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
          >
            Dubai Branch
          </button>
        </div>

        <div className="w-full h-[500px] bg-gray-200 relative group overflow-hidden rounded-[40px] shadow-3xl border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMap}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <iframe
                src={activeMap === 'kuwait'
                  ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111248.16335198!2d47.89311449553531!3d29.355523956485852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c83ce455983%3A0xc314841a12068e82!2sKuwait%20City!5e0!3m2!1sen!2skw!4v1700000000000!5m2!1sen!2skw"
                  : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231154.5513837!2d55.20163353!3d25.143715299999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2skw!4v1700000000000!5m2!1sen!2skw"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={activeMap === 'kuwait' ? "HAWK Al Ahlia Kuwait Location" : "HAWK Al Ahlia UAE Location"}
                className="grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-[30px] shadow-2xl border border-white/20 hidden lg:block group-hover:translate-x-4 transition-transform duration-500 z-10">
            <h4 className="font-black text-primary text-xl mb-1">
              {activeMap === 'kuwait' ? 'Visit Our Headquarters' : 'Visit Our UAE Branch'}
            </h4>
            <p className="text-gray-500 text-sm font-medium">
              {activeMap === 'kuwait' ? 'Kuwait City, Capital Governorate' : 'Dubai, United Arab Emirates'}
            </p>
            <div className="w-10 h-1 bg-secondary mt-3 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
