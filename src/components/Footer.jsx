import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-primary text-gray-300 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-secondary mb-4">HAWK</h2>
            <p className="max-w-md mb-6">
              Leading Global Engineering and Construction Contractor Focused on
              Infrastructure, Industrial, and High-End Commercial Projects.
            </p>

          </div>

          {/* Services */}
          <div>
            <h5 className="font-semibold text-white mb-4">Services</h5>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services"
                  className="hover:text-secondary transition-colors"
                >
                  General Construction
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-secondary transition-colors"
                >
                  Project Management
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-secondary transition-colors"
                >
                  Engineering
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-secondary transition-colors"
                >
                  Consulting
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-semibold text-white mb-4">Company</h5>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="hover:text-secondary transition-colors"
                >
                  Our Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-secondary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-secondary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary/30 pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} HAWK. All rights reserved. |{" "}
            <a
              href="/privacy"
              className="hover:text-secondary transition-colors"
            >
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:text-secondary transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
