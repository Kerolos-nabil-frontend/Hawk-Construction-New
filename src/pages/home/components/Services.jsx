import React from "react";
import { FaBuilding } from "react-icons/fa";
import { MdEngineering } from "react-icons/md";
import { SiHomeadvisor } from "react-icons/si";
import { IoConstruct } from "react-icons/io5";
import { motion } from "framer-motion";

const Services = () => {
  const services = [
    {
      icon: IoConstruct,
      title: "General Construction",
      desc: "Comprehensive construction services from planning and design to project delivery, built with quality and precision.",
    },
    {
      icon: FaBuilding,
      title: "Project Management",
      desc: "Efficient project management ensuring on-time delivery, cost-control, and full client satisfaction at every stage.",
    },
    {
      icon: MdEngineering,
      title: "Engineering Services",
      desc: "Innovative engineering solutions, advanced modeling, and technical excellence for complex infrastructure projects.",
    },
    {
      icon: SiHomeadvisor,
      title: "Consulting",
      desc: "Trusted advisory services delivering strategic insights, risk analysis, and sustainable design recommendations.",
    },
  ];

  return (
  <section className="relative py-28 bg-background-color text-text-color font-[Britannic Bold Regular] overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl"
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-primary mb-6 font-[Britannic Bold Regular]"
        >
          Our <span className="text-secondary">Services</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gray-600 text-lg max-w-3xl mx-auto mb-16"
        >
          We deliver high-quality engineering and construction solutions built on innovation, integrity, and efficiency.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{
                  scale: 1.07,
                  rotateY: 10,
                  boxShadow: "0 15px 30px rgba(37, 99, 235, 0.2)",
                }}
                className="group bg-white/60 backdrop-blur-lg border border-blue-100 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-10 cursor-pointer transform-gpu"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1.2 }}
                  className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-blue-300 shadow-lg group-hover:from-blue-400 group-hover:to-blue-200"
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {s.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">{s.desc}</p>

                
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
