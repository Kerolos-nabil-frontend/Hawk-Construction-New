# SEO Optimization with Helmet/React-Helmet-Async Guide

## Overview
Your project now uses **react-helmet-async** for client-side SEO optimization. This is the recommended approach for React applications since Helmet (Express middleware) is for server-side rendering.

## Setup Status ✅
- ✅ `HelmetProvider` wrapper added to `src/index.tsx`
- ✅ Enhanced `SEO.jsx` component with comprehensive meta tags
- ✅ SEO configuration file created at `src/config/seoConfig.ts`
- ✅ Global SEO setup in `App.tsx` with structured data
- ✅ `usePageSEO` hook created for easy page-level SEO

## Implementation Guide

### 1. **Global SEO (Already Done)**
Your app now has global SEO via App.tsx with organization schema:
```tsx
<SEO 
  structuredData={organizationSchema}
  locale={i18n.language === 'ar' ? 'ar_SA' : 'en_US'}
/>
```

### 2. **Page-Level SEO**
Add SEO to individual pages using the hook:

```jsx
// Example: src/pages/services/index.jsx
import { usePageSEO, createServiceSchema } from '../../hooks/usePageSEO';

export default function Services() {
  const { SEOComponent } = usePageSEO({
    title: 'Our Services',
    description: 'Explore our professional construction and contracting services',
    keywords: 'construction services, contracting, professional',
    path: '/services',
    structuredData: createServiceSchema({
      name: 'Construction Services',
      description: 'Professional construction and contracting',
      provider: 'Hawk Al Ahlia',
      image: 'https://yourdomain.com/services.jpg',
      areaServed: 'Saudi Arabia',
    }),
  });

  return (
    <>
      <SEOComponent />
      {/* Your page content */}
    </>
  );
}
```

### 3. **Update Configuration**
Edit `src/config/seoConfig.ts`:
- Replace `https://yourdomain.com` with your actual domain
- Update site title, description, keywords
- Add your Twitter handle
- Update contact email
- Add your OG image URL

### 4. **Structured Data Schemas**
Use pre-built schemas from `usePageSEO.ts`:
- `createBreadcrumbSchema()` - Breadcrumb navigation
- `createArticleSchema()` - Blog posts/articles
- `createServiceSchema()` - Services
- `createContactSchema()` - Contact information

Example:
```jsx
import { createBreadcrumbSchema } from '../../hooks/usePageSEO';

const breadcrumbs = createBreadcrumbSchema([
  { name: 'Home', url: 'https://yourdomain.com' },
  { name: 'Services', url: 'https://yourdomain.com/services' },
]);
```

## Features Implemented

### Meta Tags
- ✅ Title & Description
- ✅ Keywords
- ✅ Viewport & Charset
- ✅ Canonical URLs
- ✅ Language alternates (en/ar)
- ✅ Robots directives

### Open Graph Tags
- ✅ OG:title, OG:description, OG:image
- ✅ OG:type, OG:url, OG:locale
- ✅ Image dimensions (1200x630)

### Twitter Card Tags
- ✅ Twitter:card, Twitter:title
- ✅ Twitter:description, Twitter:image
- ✅ Twitter:creator (handle)

### JSON-LD Structured Data
- ✅ Organization schema (global)
- ✅ Custom schema support per page
- ✅ Breadcrumb, Article, Service, Contact schemas

### Web App Meta Tags
- ✅ Apple mobile web app capable
- ✅ Theme color
- ✅ App title

## Best Practices Applied

1. **Centralized Configuration** - All site info in one file
2. **Reusable Components** - Easy SEO setup per page
3. **Structured Data** - JSON-LD for better search visibility
4. **Mobile Optimization** - Proper viewport settings
5. **Social Media** - OG tags and Twitter cards
6. **Internationalization** - Language alternates for SEO
7. **Security** - Proper charset and X-UA-Compatible headers

## Usage Examples

### Basic Page SEO
```jsx
import { usePageSEO } from '../../hooks/usePageSEO';

export default function About() {
  const { SEOComponent } = usePageSEO({
    title: 'About Us',
    description: 'Learn about Hawk Al Ahlia company history',
    keywords: 'about, company, history',
    path: '/about',
  });

  return (
    <>
      <SEOComponent />
      {/* Content */}
    </>
  );
}
```

### With Structured Data
```jsx
import { usePageSEO, createBreadcrumbSchema } from '../../hooks/usePageSEO';

const breadcrumbs = createBreadcrumbSchema([
  { name: 'Home', url: 'https://yourdomain.com' },
  { name: 'Projects', url: 'https://yourdomain.com/projects' },
]);

const { SEOComponent } = usePageSEO({
  title: 'Projects',
  description: 'View our completed projects',
  path: '/projects',
  structuredData: breadcrumbs,
});
```

## Next Steps

1. **Update seoConfig.ts** with your actual domain and company info
2. **Add SEO to key pages**: Home, Services, Projects, Contact
3. **Create XML sitemap** at `/public/sitemap.xml`
4. **Submit to Google Search Console** - https://search.google.com/search-console
5. **Monitor rankings** - Use Google Search Console or tools like Ahrefs

## Testing & Validation

### Check Meta Tags
Visit your site and check page source (right-click → View Page Source)

### Validate Structured Data
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

### Preview Social Sharing
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

## Resources
- [React Helmet Async Docs](https://github.com/steverichey/react-helmet-async)
- [Schema.org](https://schema.org)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev - SEO Guide](https://web.dev/lighthouse-seo/)
