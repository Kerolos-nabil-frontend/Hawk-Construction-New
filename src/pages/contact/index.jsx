import React, { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 lg:px-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We’d love to hear from you. Reach out and we’ll get back to you promptly.
        </p>
      </div>

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
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors[field] ? "border-red-500" : "border-gray-300"
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
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
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
            <a href="mailto:info@hawkahlia.com" className="text-blue-600 hover:underline">
              info@hawkahlia.com
            </a>
          </p>

          {/* Kuwait Branch - UNCHANGED */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Kuwait Branch
            </h3>
            <p className="text-gray-700">
              <strong>Phone:</strong>{" "}
              <a href="tel:+96522458183" className="text-blue-600 hover:underline">
                +965 22458183
              </a>
              <br />
              <a href="tel:+96590001448" className="text-blue-600 hover:underline">
                +965 90001448
              </a>
            </p>
            <p className="text-gray-700">
              <strong>WhatsApp:</strong>{" "}
              <a
                href="https://wa.me/98765314"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                +98765314
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong>{" "}
              <a
                href="https://www.google.com/maps?q=Al+'Asimah+Governorate,+Sharq,+Mubarak+Al-Kabeer+St.,+Block+No.6,+Maryam+Tower,+14th+Floor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Al 'Asimah Governorate, Sharq, Mubarak Al-Kabeer St., Block No.6,
                Maryam Tower, 14th Floor
              </a>
            </p>
          </div>

          {/* UAE Branch - UPDATED MAP ONLY */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              U.A.E Branch
            </h3>
            <p className="text-gray-700">
              <strong>Phone:</strong>{" "}
              <a href="tel:+971502572582" className="text-blue-600 hover:underline">
                +971 502572582
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong>{" "}
              <a
                href="https://www.google.com/maps?q=Dubai,+United+Arab+Emirates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Dubai, United Arab Emirates
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
