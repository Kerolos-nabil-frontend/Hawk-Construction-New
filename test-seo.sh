#!/bin/bash
# SEO Testing Script
# Tests your site's SEO setup locally

echo "=========================================="
echo "Hawk Al Ahlia - SEO Verification Test"
echo "=========================================="
echo ""

echo "✓ Checking for required files..."
[ -f "public/robots.txt" ] && echo "  ✅ robots.txt exists" || echo "  ❌ robots.txt missing"
[ -f "public/sitemap.xml" ] && echo "  ✅ sitemap.xml exists" || echo "  ❌ sitemap.xml missing"
[ -f "src/config/seoConfig.ts" ] && echo "  ✅ seoConfig.ts exists" || echo "  ❌ seoConfig.ts missing"

echo ""
echo "✓ Checking SEO keywords in files..."
grep -q "Hawk" src/config/seoConfig.ts && echo "  ✅ 'Hawk' found in config" || echo "  ❌ 'Hawk' not found"
grep -q "Hawk Al Ahlia" src/config/seoConfig.ts && echo "  ✅ 'Hawk Al Ahlia' found in config" || echo "  ❌ 'Hawk Al Ahlia' not found"
grep -q "LocalBusiness" src/hooks/useGlobalSEO.ts && echo "  ✅ LocalBusiness schema configured" || echo "  ❌ LocalBusiness schema missing"

echo ""
echo "✓ Next steps:"
echo "  1. Deploy your site to a public domain"
echo "  2. Go to: https://search.google.com/search-console"
echo "  3. Add your domain"
echo "  4. Upload sitemap.xml"
echo "  5. Request indexing"
echo ""
echo "=========================================="
