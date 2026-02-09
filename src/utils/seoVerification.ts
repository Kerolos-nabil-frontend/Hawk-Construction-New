/**
 * SEO Verification Utilities
 * Use this to test your SEO setup without deploying to Google
 */

export function verifySEOTags() {
  const checks = {
    title: checkTitle(),
    description: checkDescription(),
    keywords: checkKeywords(),
    schema: checkSchema(),
    ogTags: checkOGTags(),
    robotsMeta: checkRobotsMeta(),
  };

  console.log('=== SEO Verification Results ===');
  console.log(checks);
  return checks;
}

function checkTitle() {
  const title = document.title;
  const hasHawk = title.includes('Hawk');
  const hasAlAhlia = title.includes('Al Ahlia');
  
  return {
    title,
    status: hasHawk && hasAlAhlia ? '✅ PASS' : '❌ FAIL',
    message: hasHawk && hasAlAhlia 
      ? 'Title contains "Hawk Al Ahlia"'
      : 'Title missing "Hawk" or "Al Ahlia"',
  };
}

function checkDescription() {
  const meta = document.querySelector('meta[name="description"]');
  const description = meta?.getAttribute('content') || '';
  const hasHawk = description.includes('Hawk');
  
  return {
    description: description.substring(0, 80) + '...',
    status: hasHawk ? '✅ PASS' : '❌ FAIL',
    message: hasHawk 
      ? 'Description contains "Hawk"'
      : 'Description missing "Hawk"',
  };
}

function checkKeywords() {
  const meta = document.querySelector('meta[name="keywords"]');
  const keywords = meta?.getAttribute('content') || '';
  const hasHawk = keywords.includes('Hawk');
  const hasAlAhlia = keywords.includes('Hawk Al Ahlia');
  
  return {
    keywords: keywords.substring(0, 100) + '...',
    status: hasHawk && hasAlAhlia ? '✅ PASS' : '❌ FAIL',
    message: hasHawk && hasAlAhlia
      ? 'Keywords optimized for "Hawk" and "Hawk Al Ahlia"'
      : 'Keywords not optimized',
  };
}

function checkSchema() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let hasLocalBusiness = false;
  let hasAlternateName = false;

  scripts.forEach(script => {
    try {
      const schema = JSON.parse(script.textContent || '');
      if (schema['@type'] === 'LocalBusiness') {
        hasLocalBusiness = true;
        if (schema.alternateName?.includes('Hawk')) {
          hasAlternateName = true;
        }
      }
    } catch (e) {
      console.error('Invalid schema:', e);
    }
  });

  return {
    schemasFound: scripts.length,
    hasLocalBusiness,
    hasAlternateName,
    status: hasLocalBusiness && hasAlternateName ? '✅ PASS' : '❌ FAIL',
    message: hasLocalBusiness && hasAlternateName
      ? 'LocalBusiness schema with "Hawk" found'
      : 'Schema missing or incomplete',
  };
}

function checkOGTags() {
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');

  const hasOGTitle = ogTitle?.getAttribute('content')?.includes('Hawk') || false;
  const hasOGDesc = ogDescription?.getAttribute('content')?.includes('Hawk') || false;
  const hasOGImage = !!ogImage?.getAttribute('content');

  return {
    ogTitle: hasOGTitle,
    ogDescription: hasOGDesc,
    ogImage: hasOGImage,
    status: hasOGTitle && hasOGDesc && hasOGImage ? '✅ PASS' : '⚠️ PARTIAL',
    message: `OG:Title=${hasOGTitle}, OG:Desc=${hasOGDesc}, OG:Image=${hasOGImage}`,
  };
}

function checkRobotsMeta() {
  const meta = document.querySelector('meta[name="robots"]');
  const content = meta?.getAttribute('content') || '';
  const isIndexable = !content.includes('noindex');
  const isFollowable = !content.includes('nofollow');

  return {
    robots: content || 'index, follow',
    isIndexable,
    isFollowable,
    status: isIndexable && isFollowable ? '✅ PASS' : '❌ FAIL',
    message: isIndexable && isFollowable
      ? 'Site is indexable by search engines'
      : 'Site may not be indexable',
  };
}

// Run this in browser console to test
if (typeof window !== 'undefined') {
  (window as any).verifySEO = verifySEOTags;
  console.log('📊 Run verifySEO() in console to check SEO setup');
}
