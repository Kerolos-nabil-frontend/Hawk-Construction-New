import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/seoConfig';

export default function SEO({ 
  title = siteConfig.title,
  description = siteConfig.description,
  keywords = siteConfig.keywords,
  canonical = '',
  ogImage = siteConfig.image,
  ogUrl = '',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  author = siteConfig.author,
  robots = 'index, follow',
  locale = siteConfig.locale,
  structuredData = null,
  noindex = false,
}) {
  const baseUrl = siteConfig.url;
  const fullUrl = ogUrl ? `${baseUrl}${ogUrl}` : baseUrl;
  const fullTitle = title.includes(siteConfig.company) ? title : `${title} | ${siteConfig.company}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={locale.split('_')[0]} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta charSet="UTF-8" />
      
      {/* Brand Keywords - Optimized for "Hawk" and "Hawk Al Ahlia" searches */}
      <meta name="brand" content="Hawk Al Ahlia" />
      <meta name="application-name" content="Hawk Al Ahlia" />
      
      {/* Robots Meta */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : robots} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : robots} />
      <meta name="bingbot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Author and Copyright */}
      <meta name="author" content={author} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${author}. All rights reserved.`} />
      <meta name="creator" content={author} />
      
      {/* Canonical URL */}
      {canonical ? (
        <link rel="canonical" href={canonical} />
      ) : (
        <link rel="canonical" href={fullUrl} />
      )}
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar`} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      
      {/* Open Graph / Facebook - Enhanced for brand visibility */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteConfig.company} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="ar_SA" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {siteConfig.twitterHandle && <meta name="twitter:creator" content={siteConfig.twitterHandle} />}
      <meta name="twitter:site" content={siteConfig.twitterHandle} />
      
      {/* Web App Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteConfig.company} />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Security and Performance Headers */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Verification Tags (Replace with your actual codes) */}
      {/* Google Search Console */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      
      {/* Structured Data (JSON-LD) - Enhanced for Local Business */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Brand Name Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BrandName",
          "name": siteConfig.company,
          "url": baseUrl,
          "logo": siteConfig.logo,
        })}
      </script>
    </Helmet>
  );
}
