/**
 * useGlobalSEO Hook
 * Applies global SEO metadata on page load
 */

import { useEffect } from 'react';
import { siteConfig } from '../config/seoConfig';

export function useGlobalSEO() {
  useEffect(() => {
    // Set base meta tags
    updateMetaTag('name', 'description', siteConfig.description);
    updateMetaTag('name', 'keywords', siteConfig.keywords);
    updateMetaTag('name', 'author', siteConfig.author);
    updateMetaTag('property', 'og:title', siteConfig.title);
    updateMetaTag('property', 'og:description', siteConfig.description);
    updateMetaTag('property', 'og:url', siteConfig.url);
    updateMetaTag('property', 'og:site_name', siteConfig.company);
    updateMetaTag('name', 'twitter:creator', siteConfig.twitterHandle);

    // Set page title
    document.title = siteConfig.title;

    // Add organization schema
    addSchemaScript({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": siteConfig.url,
      "name": siteConfig.company,
      "alternateName": ["Hawk", "Hawk Al Ahlia"],
      "description": siteConfig.description,
      "url": siteConfig.url,
      "logo": siteConfig.logo,
      "image": siteConfig.image,
      "email": siteConfig.contactEmail,
      "areaServed": "Kuwait",
      "priceRange": "$$",
      "knowsAbout": ["construction", "contracting", "building", "architecture"],
      "sameAs": [
        "https://www.facebook.com/hawkalaahlia",
        "https://twitter.com/HawkAlAhlia",
        "https://www.linkedin.com/company/hawk-al-ahlia",
      ],
    });
  }, []);
}

function updateMetaTag(attrType: string, attrName: string, content: string) {
  let element = document.querySelector(`meta[${attrType}="${attrName}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrType, attrName);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

function addSchemaScript(schema: any) {
  // Remove old schema if exists
  const oldScript = document.querySelector('script[type="application/ld+json"]');
  if (oldScript) {
    oldScript.remove();
  }

  // Add new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
