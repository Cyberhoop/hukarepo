import React, { useEffect } from 'react';
import { useSeo } from '../context/SeoContext';
import { useNavigation } from '../context/NavigationContext';
import { useContact } from '../context/ContactContext';

function upsertMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export const SEOHead: React.FC = () => {
  const { seoConfig } = useSeo();
  const { currentPage } = useNavigation();
  const { contactConfig } = useContact();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const pageSeo = seoConfig.pages?.[currentPage] || seoConfig.pages?.home;

    const finalTitle = pageSeo?.title || seoConfig.defaultTitle || 'Shisha Rent Kolkata';
    const finalDescription =
      pageSeo?.description ||
      seoConfig.defaultDescription ||
      'Luxury hookah rentals, 15+ exotic flavour brands, professional bartenders, cooks & event catering in Kolkata.';
    const combinedKeywords = [
      pageSeo?.focusKeyword,
      pageSeo?.keywords,
      seoConfig.globalFocusKeyword,
      seoConfig.globalKeywords,
    ]
      .filter(Boolean)
      .join(', ');

    const ogTitle = pageSeo?.ogTitle || finalTitle;
    const ogDescription = pageSeo?.ogDescription || finalDescription;
    const baseDomain = (seoConfig.canonicalDomain || window.location.origin).replace(/\/+$/, '');
    const canonicalPath = pageSeo?.canonicalPath || (currentPage === 'home' ? '/' : `/${currentPage}`);
    const canonicalUrl = `${baseDomain}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

    const rawOgImage =
      pageSeo?.ogImage ||
      seoConfig.defaultOgImage ||
      '/src/assets/images/hero_luxury_hookah_1791648599431.jpg';
    const ogImageUrl =
      rawOgImage.startsWith('http') || rawOgImage.startsWith('data:')
        ? rawOgImage
        : `${baseDomain}${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`;

    const shouldIndex = seoConfig.robotsIndex !== false && pageSeo?.robotsIndex !== false;
    const shouldFollow = seoConfig.robotsFollow !== false && pageSeo?.robotsFollow !== false;
    const robotsContent = `${shouldIndex ? 'index' : 'noindex'}, ${
      shouldFollow ? 'follow' : 'nofollow'
    }, max-image-preview:large, max-snippet:-1`;

    // 1. Update Document Title
    document.title = finalTitle;

    // 2. Update Standard Search Engine Meta Tags
    upsertMetaTag('name', 'description', finalDescription);
    upsertMetaTag('name', 'keywords', combinedKeywords);
    upsertMetaTag('name', 'robots', robotsContent);
    upsertMetaTag('name', 'google-site-verification', seoConfig.googleSiteVerification || '');
    upsertMetaTag('name', 'msvalidate.01', seoConfig.bingSiteVerification || '');

    // 3. Update Canonical URL
    upsertCanonicalLink(canonicalUrl);

    // 4. Update OpenGraph / WhatsApp / Facebook Cards
    upsertMetaTag('property', 'og:title', ogTitle);
    upsertMetaTag('property', 'og:description', ogDescription);
    upsertMetaTag('property', 'og:type', seoConfig.ogType || 'website');
    upsertMetaTag('property', 'og:site_name', seoConfig.ogSiteName || seoConfig.siteName);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', ogImageUrl);

    // 5. Update Twitter / X Cards
    upsertMetaTag('name', 'twitter:card', seoConfig.twitterCard || 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', ogTitle);
    upsertMetaTag('name', 'twitter:description', ogDescription);
    upsertMetaTag('name', 'twitter:image', ogImageUrl);
    if (seoConfig.twitterHandle) {
      upsertMetaTag('name', 'twitter:site', seoConfig.twitterHandle);
    }

    // 6. Update Schema.org JSON-LD Structured Data
    const schemaData: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': seoConfig.schemaBusinessType || 'LocalBusiness',
      name: seoConfig.schemaBusinessName || seoConfig.siteName || 'Shisha Rent Kolkata',
      description: seoConfig.schemaDescription || seoConfig.defaultDescription,
      url: baseDomain,
      telephone: seoConfig.schemaTelephone || contactConfig?.phone || '+91-9876543210',
      email: seoConfig.schemaEmail || contactConfig?.email || 'bookings@shisharent.in',
      priceRange: seoConfig.schemaPriceRange || '₹499 - ₹9999',
      openingHours: seoConfig.schemaOpeningHours || 'Mo-Su 11:00-03:00',
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          seoConfig.schemaStreetAddress ||
          contactConfig?.address ||
          'Park Street & Salt Lake Sector V Concierge Hubs',
        addressLocality: seoConfig.schemaLocality || contactConfig?.city || 'Kolkata',
        addressRegion: seoConfig.schemaRegion || 'WB',
        postalCode: seoConfig.schemaPostalCode || '700016',
        addressCountry: 'IN',
      },
      areaServed: (seoConfig.schemaAreaServed || contactConfig?.areasServed || 'Kolkata')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (seoConfig.schemaGeoLat && seoConfig.schemaGeoLng) {
      schemaData.geo = {
        '@type': 'GeoCoordinates',
        latitude: seoConfig.schemaGeoLat,
        longitude: seoConfig.schemaGeoLng,
      };
    }

    if (seoConfig.schemaRatingValue && seoConfig.schemaReviewCount) {
      schemaData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: seoConfig.schemaRatingValue,
        reviewCount: seoConfig.schemaReviewCount,
        bestRating: '5',
        worstRating: '1',
      };
    }

    let scriptEl = document.head.querySelector(
      'script[type="application/ld+json"]'
    ) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = 'dynamic-schema-jsonld';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaData, null, 2);
  }, [seoConfig, currentPage, contactConfig]);

  return null;
};
