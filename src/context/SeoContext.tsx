import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, SeoConfig, PageSeoConfig } from '../services/api';

export const FALLBACK_SEO_CONFIG: SeoConfig = {
  siteName: 'Shisha Rent Kolkata',
  titleSeparator: '|',
  siteTagline: 'Premium Hookah Rental, Pre-Filled Chillums & Event Catering in Kolkata',
  defaultTitle: 'Shisha Rent Kolkata | Premium Hookah Rental & Event Services',
  defaultDescription:
    'Luxury hookah rentals, 15+ exotic flavour brands, pre-filled chillum home delivery, professional bartenders, cooks & VIP event catering across Kolkata. Book online or on WhatsApp.',
  globalFocusKeyword: 'Hookah Rental Kolkata',
  globalKeywords:
    'Shisha Rent Kolkata, Hookah Rental Kolkata, Hookah Home Delivery Salt Lake, Party Hookah Catering Kolkata, Pre-filled Chillum Delivery Kolkata, Al Fakher Afzal Hookah Kolkata, Rent Hookah New Town Park Street, Wedding Hookah Bar Catering Kolkata',
  canonicalDomain: 'https://shisharent.in',
  ogSiteName: 'Shisha Rent Kolkata',
  ogType: 'website',
  defaultOgImage: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
  twitterCard: 'summary_large_image',
  twitterHandle: '@shisharentkolkata',
  robotsIndex: true,
  robotsFollow: true,
  googleSiteVerification: '',
  bingSiteVerification: '',
  googleAnalyticsId: '',
  schemaBusinessType: 'LocalBusiness',
  schemaBusinessName: 'Shisha Rent Kolkata',
  schemaDescription:
    'Luxury hookah rentals, 15+ exotic flavour brands, pre-filled chillums, professional bartenders, cooks & event catering across Kolkata.',
  schemaPriceRange: '₹499 - ₹9999',
  schemaOpeningHours: 'Mo-Su 11:00-03:00',
  schemaTelephone: '+91-9876543210',
  schemaEmail: 'bookings@shisharent.in',
  schemaStreetAddress: 'Park Street & Salt Lake Sector V Concierge Hubs',
  schemaLocality: 'Kolkata',
  schemaRegion: 'West Bengal',
  schemaPostalCode: '700016',
  schemaGeoLat: '22.5514',
  schemaGeoLng: '88.3528',
  schemaAreaServed: 'Salt Lake, New Town, Park Street, Ballygunge, Alipore, Howrah, Behala, Kolkata',
  schemaRatingValue: '4.9',
  schemaReviewCount: '428',
  customRobotsTxt: 'User-agent: *\nAllow: /\nDisallow: /api/\n',
  pages: {
    home: {
      pageId: 'home',
      pageLabel: 'Home Page',
      path: '/',
      title: 'Shisha Rent Kolkata | Premium Hookah Rental & Home Delivery',
      description:
        'Order luxury hookah rentals, pre-filled chillums (₹600), 15+ exotic flavours (Al Fakher, Afzal, Kolkata Meetha Paan), and live bartender catering across Kolkata in 45 mins.',
      focusKeyword: 'Hookah Rental Kolkata',
      keywords:
        'Hookah Rental Kolkata, Shisha Rent Kolkata, Hookah Home Delivery Kolkata, Pre-filled Chillum Kolkata, Salt Lake Hookah Delivery, Park Street Shisha Lounge Catering',
      ogTitle: 'Shisha Rent Kolkata | #1 Luxury Hookah Rental & Event Catering',
      ogDescription:
        'Get sanitized bohemian glass hookahs, pre-filled chillums, organic coconut coal, and private party bartenders delivered anywhere in Kolkata.',
      ogImage: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
      canonicalPath: '/',
      robotsIndex: true,
      robotsFollow: true,
      priority: 1.0,
      changefreq: 'daily',
    },
    products: {
      pageId: 'products',
      pageLabel: 'Products & Flavours Catalog',
      path: '/products',
      title: 'Hookah Flavours, Bases & Pre-Filled Chillum Menu | Shisha Rent Kolkata',
      description:
        'Browse 40+ authentic hookah flavours (Al Fakher, Afzal, Adalya), Maya bohemian glass bases, clay & silicon chillums, coconut charcoal, and party rental packages in Kolkata.',
      focusKeyword: 'Hookah Flavours Kolkata',
      keywords:
        'Hookah Flavours Kolkata, Buy Hookah Chillum Kolkata, Al Fakher Double Apple Kolkata, Kolkata Meetha Paan Flavour, Maya Hookah Rental Price Kolkata',
      ogTitle: '40+ Exotic Hookah Flavours & Designer Bases | Shisha Rent Kolkata',
      ogDescription:
        'Customize your pre-filled chillum or rent complete German stainless steel and Bohemian crystal hookah setups in Kolkata.',
      ogImage: '/src/assets/images/category_flavours_1791648613614.jpg',
      canonicalPath: '/products',
      robotsIndex: true,
      robotsFollow: true,
      priority: 0.9,
      changefreq: 'daily',
    },
    services: {
      pageId: 'services',
      pageLabel: 'VIP Event & Wedding Services',
      path: '/services',
      title: 'Wedding Shisha Bar, Private Bartenders & Party Catering | Shisha Rent Kolkata',
      description:
        'Hire dedicated shisha sommeliers, flair bartenders, mixologists, and live party chefs for weddings, sangeet nights, rooftop birthdays, and corporate events in Kolkata.',
      focusKeyword: 'Wedding Hookah Catering Kolkata',
      keywords:
        'Wedding Hookah Catering Kolkata, Hire Bartender for House Party Kolkata, Sangeet Shisha Bar Setup Kolkata, Corporate Event Hookah Service Kolkata',
      ogTitle: 'Luxury Wedding Shisha Lounges & Private Bartenders in Kolkata',
      ogDescription:
        'Turnkey hookah bars, unlimited coal rotation attendants, and craft cocktail bartenders for Kolkata house parties and weddings.',
      ogImage: '/src/assets/images/quote_cocktail_drink_1791648736985.jpg',
      canonicalPath: '/services',
      robotsIndex: true,
      robotsFollow: true,
      priority: 0.9,
      changefreq: 'weekly',
    },
    gallery: {
      pageId: 'gallery',
      pageLabel: 'Gallery & Event Portfolio',
      path: '/gallery',
      title: 'Live Party Setups & Luxury Hookah Gallery | Shisha Rent Kolkata',
      description:
        'Explore real photos from our VIP penthouse parties in Park Street, wedding sangeet hookah bars in New Town, and custom fruit-base shisha setups across Kolkata.',
      focusKeyword: 'Hookah Party Setup Kolkata',
      keywords:
        'Hookah Party Setup Kolkata, Shisha Lounge Photos Kolkata, Luxury Hookah Catering Portfolio, Event Setup Gallery Kolkata',
      ogTitle: 'Gallery & Atmosphere | Shisha Rent Kolkata VIP Events',
      ogDescription:
        'See how Shisha Rent Kolkata transforms house parties, farmhouses, and wedding venues with designer hookahs and mixology bars.',
      ogImage: '/src/assets/images/category_sr_products_1791648725022.jpg',
      canonicalPath: '/gallery',
      robotsIndex: true,
      robotsFollow: true,
      priority: 0.8,
      changefreq: 'weekly',
    },
    about: {
      pageId: 'about',
      pageLabel: 'About Us & Hygiene Standards',
      path: '/about',
      title: 'About Shisha Rent Kolkata | Medical-Grade Sanitized Hookah Concierge',
      description:
        'Learn how Shisha Rent Kolkata delivers 100% autoclaved hookahs, sealed disposable mouth tips, and genuine imported molasses across Salt Lake, New Town, Park Street & Alipore.',
      focusKeyword: 'Shisha Rent Kolkata',
      keywords:
        'About Shisha Rent Kolkata, Sanitized Hookah Rental Kolkata, Best Hookah Service Kolkata, Premium Hookah Concierge West Bengal',
      ogTitle: 'About Shisha Rent Kolkata | Luxury Hospitality & Hygiene First',
      ogDescription:
        'Kolkata’s trusted nocturnal hospitality brand serving 500+ private events with hospital-grade sanitized shisha hardware.',
      ogImage: '/src/assets/images/category_hookah_bases_1791648627967.jpg',
      canonicalPath: '/about',
      robotsIndex: true,
      robotsFollow: true,
      priority: 0.7,
      changefreq: 'monthly',
    },
    contact: {
      pageId: 'contact',
      pageLabel: 'Contact & 24/7 Dispatch Hubs',
      path: '/contact',
      title: 'Contact Shisha Rent Kolkata | 45-Min Express Hookah Delivery Helpline',
      description:
        'Call or WhatsApp Shisha Rent Kolkata for instant home delivery in Salt Lake, New Town, Park Street, Ballygunge & Alipore. Open daily till 3:00 AM for late-night bookings.',
      focusKeyword: 'Contact Shisha Rent Kolkata',
      keywords:
        'Shisha Rent Kolkata Phone Number, Hookah Delivery Near Me Kolkata, Late Night Hookah Delivery Salt Lake, Book Hookah WhatsApp Kolkata',
      ogTitle: 'Contact Shisha Rent Kolkata | Instant WhatsApp & Phone Booking',
      ogDescription:
        'Reach our Park Street & Salt Lake Sector V dispatch hubs for 45-minute express hookah and chillum delivery across Kolkata.',
      ogImage: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
      canonicalPath: '/contact',
      robotsIndex: true,
      robotsFollow: true,
      priority: 0.8,
      changefreq: 'monthly',
    },
    track: {
      pageId: 'track',
      pageLabel: 'Live Order & Dispatch Tracker',
      path: '/track',
      title: 'Track Your Hookah Order & Delivery Status | Shisha Rent Kolkata',
      description:
        'Track your live Shisha Rent Kolkata booking ID, verify online UPI QR payments, or approve flavour substitutions in real time.',
      focusKeyword: 'Track Shisha Rent Order',
      keywords: 'Track Hookah Order Kolkata, Shisha Rent Booking Status, SR-KOL Order Tracker',
      ogTitle: 'Live Order Tracker | Shisha Rent Kolkata',
      ogDescription: 'Enter your booking ID or phone number to check live dispatch status for your Kolkata hookah rental.',
      ogImage: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
      canonicalPath: '/track',
      robotsIndex: true,
      robotsFollow: true,
      priority: 0.6,
      changefreq: 'monthly',
    },
    account: {
      pageId: 'account',
      pageLabel: 'Customer Account Portal',
      path: '/account',
      title: 'My Account & Saved Bookings | Shisha Rent Kolkata',
      description: 'Manage your saved Kolkata delivery addresses, past hookah rentals, and 1-click reorders.',
      focusKeyword: 'Shisha Rent Customer Account',
      keywords: 'Shisha Rent Login, My Hookah Orders Kolkata',
      ogTitle: 'Customer Portal | Shisha Rent Kolkata',
      ogDescription: 'Sign in to view your hookah rental history and reorder your favourite flavours in 1 click.',
      ogImage: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
      canonicalPath: '/account',
      robotsIndex: false,
      robotsFollow: true,
      priority: 0.4,
      changefreq: 'monthly',
    },
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'system_init',
};

interface SeoContextType {
  seoConfig: SeoConfig;
  refreshSeoConfig: () => Promise<void>;
  setSeoConfigDirectly: (cfg: SeoConfig) => void;
}

const SeoContext = createContext<SeoContextType>({
  seoConfig: FALLBACK_SEO_CONFIG,
  refreshSeoConfig: async () => {},
  setSeoConfigDirectly: () => {},
});

export const SeoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seoConfig, setSeoConfig] = useState<SeoConfig>(FALLBACK_SEO_CONFIG);

  const refreshSeoConfig = useCallback(async () => {
    try {
      const res = await api.getSeoSettings();
      if (res.success && res.data) {
        const mergedPages: Record<string, PageSeoConfig> = { ...FALLBACK_SEO_CONFIG.pages };
        if (res.data.pages) {
          Object.keys(FALLBACK_SEO_CONFIG.pages).forEach((k) => {
            mergedPages[k] = {
              ...FALLBACK_SEO_CONFIG.pages[k],
              ...(res.data.pages[k] || {}),
            };
          });
        }
        setSeoConfig({
          ...FALLBACK_SEO_CONFIG,
          ...res.data,
          pages: mergedPages,
        });
      }
    } catch (err) {
      console.warn('Failed to load SEO settings:', err);
    }
  }, []);

  useEffect(() => {
    refreshSeoConfig();
  }, [refreshSeoConfig]);

  return (
    <SeoContext.Provider
      value={{
        seoConfig,
        refreshSeoConfig,
        setSeoConfigDirectly: setSeoConfig,
      }}
    >
      {children}
    </SeoContext.Provider>
  );
};

export const useSeo = () => useContext(SeoContext);
