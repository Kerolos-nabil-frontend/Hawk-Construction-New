/**
 * SEO Testing Component
 * Add this to your page to see SEO verification in real-time
 * 
 * Usage:
 * import { SEOTester } from '@/components/SEOTester';
 * 
 * Then add to your page:
 * <SEOTester />
 */

import { useEffect, useState } from 'react';

interface SEOCheck {
  status: string;
  message: string;
  details?: Record<string, any>;
}

interface SEOChecks {
  title: SEOCheck;
  description: SEOCheck;
  keywords: SEOCheck;
  schema: SEOCheck;
  ogTags: SEOCheck;
  robotsMeta: SEOCheck;
}

export function SEOTester() {
  const [checks, setChecks] = useState<SEOChecks | null>(null);

  useEffect(() => {
    // Run verification
    const verification = verifySEOTags();
    setChecks(verification);

    // Log to console
    console.log('🔍 SEO Verification Results:', verification);
  }, []);

  if (!checks) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">Loading SEO verification...</div>;
  }

  const allPassed = Object.values(checks).every(check => check.status.includes('✅'));

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">SEO Verification</h3>
        <span className={`text-2xl ${allPassed ? '✅' : '⚠️'}`}>
          {allPassed ? 'Ready' : 'Review Needed'}
        </span>
      </div>

      <div className="space-y-3">
        <CheckItem label="Title" check={checks.title} />
        <CheckItem label="Description" check={checks.description} />
        <CheckItem label="Keywords" check={checks.keywords} />
        <CheckItem label="Schema Markup" check={checks.schema} />
        <CheckItem label="Open Graph Tags" check={checks.ogTags} />
        <CheckItem label="Robots Meta" check={checks.robotsMeta} />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-900 font-semibold mb-2">Next Steps:</p>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Fix any failed checks above</li>
          <li>Deploy site to public domain</li>
          <li>Go to: https://search.google.com/search-console</li>
          <li>Add your domain and submit sitemap</li>
          <li>Monitor rankings for "Hawk" keyword</li>
        </ol>
      </div>
    </div>
  );
}

function CheckItem({ label, check }: { label: string; check: SEOCheck }) {
  const isPass = check.status.includes('✅');
  const isWarn = check.status.includes('⚠️');

  return (
    <div className={`p-3 rounded border-l-4 ${
      isPass ? 'bg-green-50 border-green-400' :
      isWarn ? 'bg-yellow-50 border-yellow-400' :
      'bg-red-50 border-red-400'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-800">{label}</p>
          <p className={`text-sm ${
            isPass ? 'text-green-700' :
            isWarn ? 'text-yellow-700' :
            'text-red-700'
          }`}>
            {check.message}
          </p>
        </div>
        <span className="text-xl">{check.status}</span>
      </div>
      {check.details && (
        <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify(check.details, null, 2)}
        </pre>
      )}
    </div>
  );
}

function verifySEOTags(): SEOChecks {
  return {
    title: checkTitle(),
    description: checkDescription(),
    keywords: checkKeywords(),
    schema: checkSchema(),
    ogTags: checkOGTags(),
    robotsMeta: checkRobotsMeta(),
  };
}

function checkTitle(): SEOCheck {
  const title = document.title;
  const hasHawk = title.includes('Hawk');
  const hasAlAhlia = title.includes('Al Ahlia');

  return {
    status: hasHawk && hasAlAhlia ? '✅ PASS' : '❌ FAIL',
    message: title,
    details: { hasHawk, hasAlAhlia },
  };
}

function checkDescription(): SEOCheck {
  const meta = document.querySelector('meta[name="description"]');
  const description = meta?.getAttribute('content') || '';
  const hasHawk = description.includes('Hawk');

  return {
    status: hasHawk ? '✅ PASS' : '❌ FAIL',
    message: description.substring(0, 80) + (description.length > 80 ? '...' : ''),
    details: { hasHawk },
  };
}

function checkKeywords(): SEOCheck {
  const meta = document.querySelector('meta[name="keywords"]');
  const keywords = meta?.getAttribute('content') || '';
  const hasHawk = keywords.includes('Hawk');
  const hasAlAhlia = keywords.includes('Hawk Al Ahlia');

  return {
    status: hasHawk && hasAlAhlia ? '✅ PASS' : '❌ FAIL',
    message: keywords.substring(0, 100) + (keywords.length > 100 ? '...' : ''),
    details: { hasHawk, hasAlAhlia },
  };
}

function checkSchema(): SEOCheck {
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
      // Skip invalid schemas
    }
  });

  return {
    status: hasLocalBusiness && hasAlternateName ? '✅ PASS' : '❌ FAIL',
    message: `Found ${scripts.length} schema(s). LocalBusiness: ${hasLocalBusiness}, AlternateName: ${hasAlternateName}`,
    details: { schemasFound: scripts.length, hasLocalBusiness, hasAlternateName },
  };
}

function checkOGTags(): SEOCheck {
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');

  const hasOGTitle = ogTitle?.getAttribute('content')?.includes('Hawk') || false;
  const hasOGDesc = ogDescription?.getAttribute('content')?.includes('Hawk') || false;
  const hasOGImage = !!ogImage?.getAttribute('content');

  return {
    status: hasOGTitle && hasOGDesc && hasOGImage ? '✅ PASS' : '⚠️ PARTIAL',
    message: `OG:Title=${hasOGTitle}, OG:Desc=${hasOGDesc}, OG:Image=${hasOGImage}`,
    details: { hasOGTitle, hasOGDesc, hasOGImage },
  };
}

function checkRobotsMeta(): SEOCheck {
  const meta = document.querySelector('meta[name="robots"]');
  const content = meta?.getAttribute('content') || '';
  const isIndexable = !content.includes('noindex');
  const isFollowable = !content.includes('nofollow');

  return {
    status: isIndexable && isFollowable ? '✅ PASS' : '❌ FAIL',
    message: content || 'Default: index, follow',
    details: { isIndexable, isFollowable },
  };
}
