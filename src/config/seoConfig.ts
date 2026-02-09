/**
 * SEO Configuration
 * Centralized configuration for all SEO-related metadata
 * Optimized for: "Hawk", "Hawk Al Ahlia" searches
 */

export const siteConfig = {
  title: 'Hawk Al Ahlia - Construction & Contracting',
  description: 'Hawk Al Ahlia - Professional construction and contracting services in Kuwait. Expert builders delivering quality projects.',
  keywords: 'Hawk, Hawk Al Ahlia, construction, contracting, professional builders, Kuwait',
  url: import.meta.env.VITE_SITE_URL || 'https://yourdomain.com',
  image: 'https://yourdomain.com/og-image.jpg',
  logo: 'https://yourdomain.com/logo.jpg',
  locale: 'en_US',
  author: 'Hawk Al Ahlia',
  twitterHandle: '@HawkAlAhlia',
  type: 'LocalBusiness',
  contactEmail: 'info@hawkalaahlia.com',
  company: 'Hawk Al Ahlia',
};

export const contactInfo = {
  email: 'info@hawkalaahlia.com',
  phone: '+965 XX XXX XXXX',
  address: 'Your address here',
};

// Language-specific configs
export const i18nConfig = {
  en: {
    title: 'Hawk Al Ahlia - Construction & Contracting',
    description: 'Hawk Al Ahlia - Professional construction and contracting services',
  },
  ar: {
    title: 'هوك الأهلية - البناء والمقاولات',
    description: 'هوك الأهلية - خدمات البناء والمقاولات الاحترافية',
  },
};
