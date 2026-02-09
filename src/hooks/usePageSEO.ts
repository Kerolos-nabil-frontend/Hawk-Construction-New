/**
 * usePageSEO Hook
 * Simplifies SEO setup for individual pages
 */
import { useEffect } from 'react';
import SEO from '../components/SEO';
import { siteConfig } from '../config/seoConfig';

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
  ogType?: string;
  author?: string;
  structuredData?: Record<string, any> | null;
}

export function usePageSEO({
  title,
  description,
  keywords = siteConfig.keywords,
  path = '',
  image = siteConfig.image,
  ogType = 'website',
  author = siteConfig.author,
  structuredData = null,
}: PageSEOProps) {
  useEffect(() => {
    // Update document title for better UX
    const fullTitle = `${title} | ${siteConfig.title}`;
    document.title = fullTitle;
  }, [title]);

  // Return SEO component for use in page
  return {
    SEOComponent: () =>
      SEO({
        title,
        description,
        keywords,
        canonical: '',
        ogImage: image,
        ogUrl: path,
        ogType,
        author,
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        locale: 'en_US',
        structuredData,
        noindex: false,
      } as any),
  };
}

// Pre-built structured data schemas
export const createBreadcrumbSchema = (items: any[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url,
  })),
});

export const createArticleSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": image,
  "datePublished": datePublished,
  "dateModified": dateModified,
  "author": {
    "@type": "Person",
    "name": author,
  },
  "mainEntity": {
    "@type": "Article",
    "url": url,
  },
});

export const createServiceSchema = ({
  name,
  description,
  provider,
  image,
  areaServed,
}: any) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": name,
  "description": description,
  "provider": {
    "@type": "LocalBusiness",
    "name": provider,
  },
  "image": image,
  "areaServed": areaServed,
});

export const createContactSchema = ({
  name,
  telephone,
  email,
  address,
}: any) => ({
  "@context": "https://schema.org",
  "@type": "ContactPoint",
  "contactType": "Customer Service",
  "name": name,
  "telephone": telephone,
  "email": email,
  "address": address,
});
