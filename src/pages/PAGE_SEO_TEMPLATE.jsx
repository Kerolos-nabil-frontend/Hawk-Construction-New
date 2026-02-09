/**
 * Page SEO Template
 * Copy this template to each page and customize the values
 */

import SEO from '../../components/SEO';

// Example: Home/About/Services pages
export default function PageTemplate() {
  return (
    <>
      <SEO 
        title="Page Title Here"
        description="Page description - should mention Hawk or Hawk Al Ahlia"
        keywords="Hawk, Hawk Al Ahlia, page-specific-keyword, another-keyword"
        ogUrl="/page-path"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://yourdomain.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Page Name",
              "item": "https://yourdomain.com/page-path"
            }
          ]
        }}
      />
      
      {/* Your page content here */}
      <h1>Page Title Here</h1>
      <p>Page content</p>
    </>
  );
}

/**
 * QUICK TEMPLATES
 */

// ===== HOME PAGE =====
// <SEO 
//   title="Hawk Al Ahlia - Construction & Contracting"
//   description="Hawk Al Ahlia - Professional construction and contracting services. Expert builders in Kuwait delivering quality projects."
//   keywords="Hawk, Hawk Al Ahlia, construction, contracting, builders, Kuwait"
//   ogUrl="/"
// />

// ===== SERVICES PAGE =====
// <SEO 
//   title="Professional Construction & Contracting Services"
//   description="Hawk Al Ahlia offers professional construction and contracting services. Explore our expert services in building and infrastructure."
//   keywords="Hawk services, construction services, contracting services, Hawk Al Ahlia"
//   ogUrl="/services"
// />

// ===== ABOUT PAGE =====
// <SEO 
//   title="About Hawk Al Ahlia - Company Profile"
//   description="Learn about Hawk Al Ahlia. Discover our mission, vision, and commitment to excellence in construction and contracting."
//   keywords="Hawk Al Ahlia, about us, company, profile, history"
//   ogUrl="/about"
// />

// ===== PROJECTS PAGE =====
// <SEO 
//   title="Hawk Al Ahlia Projects - Portfolio"
//   description="View Hawk Al Ahlia's completed construction projects. See our expertise and quality work in action."
//   keywords="Hawk projects, Hawk Al Ahlia portfolio, construction projects, completed work"
//   ogUrl="/projects"
// />

// ===== CONTACT PAGE =====
// <SEO 
//   title="Contact Hawk Al Ahlia"
//   description="Get in touch with Hawk Al Ahlia. Contact us for construction and contracting inquiries and quotes."
//   keywords="Hawk contact, Hawk Al Ahlia contact, contact us, inquiry"
//   ogUrl="/contact"
// />
