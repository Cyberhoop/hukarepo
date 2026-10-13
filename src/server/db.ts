import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ALL_PRODUCTS } from '../data/productsData.ts';
import type { ProductItem } from '../data/productsData.ts';

// Supabase client instance (server-side with service role or anon key)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_K ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export let supabase: SupabaseClient | null = null;

const isPlaceholder =
  !supabaseUrl ||
  supabaseUrl.includes('your-supabase-project') ||
  supabaseUrl.includes('demo.shisharent.supabase.co') ||
  !supabaseKey ||
  supabaseKey.includes('your-supabase') ||
  supabaseKey.includes('demo_');

if (!isPlaceholder) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Database] Connected to remote Supabase project:', supabaseUrl);
  } catch (err) {
    console.warn('[Database] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('[Database] Running with integrated local persistent store.');
}

// Local Persistent Store fallback
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

export interface PaymentConfig {
  id: string;
  upiId: string;
  payeeName: string;
  qrImageUrl: string;
  qrStoragePath: string;
  isActive: boolean;
  codEnabled: boolean;
  instructions: string;
  updatedAt: string;
  updatedBy: string;
}

export interface TermsAcceptanceRecord {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  domain: string;
  termsVersion: string;
  policySnippet: string;
  customerIp?: string;
  userAgent?: string;
  acceptedAt: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Party Venue' | 'Office' | 'Other';
  area: string;
  addressLine: string;
  landmark?: string;
  isDefault: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  authProvider: 'local' | 'google';
  avatarUrl?: string;
  preferredFlavour?: string;
  savedAddresses: SavedAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface CookieConsentRecord {
  id: string;
  visitorId: string;
  userId?: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  seoPersonalization: boolean;
  utmSource?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  updatedAt: string;
}

export interface BookingRecord {
  id: string;
  userId?: string;
  customerEmail?: string;
  domain: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  eventTime: string;
  deliveryArea: string;
  customAddress?: string;
  potCount: string;
  requestedItems: ProductItem[];
  includeBartender: boolean;
  includeCook: boolean;
  specialInstructions?: string;
  paymentMethod: 'cod' | 'qr';
  paymentStatus: 'pending' | 'verified' | 'rejected';
  transactionReference?: string;
  paymentProofUrl?: string;
  bookingStatus:
    | 'pending'
    | 'confirmed'
    | 'substitution_requested'
    | 'substitution_approved'
    | 'substitution_rejected'
    | 'dispatched'
    | 'delivered'
    | 'completed'
    | 'cancelled';
  substitutionOffered?: {
    unavailableItem: string;
    offeredItem: string;
    reason: string;
  } | null;
  substitutionNote?: string;
  substitutionCustomerConfirmed?: boolean | null;
  substitutionActionAt?: string;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  details: any;
  adminEmail: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminCredentials {
  email: string;
  passwordHash: string;
  name: string;
  updatedAt: string;
}

export interface ContactConfig {
  phone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  email: string;
  address: string;
  city: string;
  areasServed: string;
  hours: string;
  instagramUrl: string;
  facebookUrl: string;
  googleMapsUrl: string;
  updatedAt: string;
  updatedBy: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  category: 'parties' | 'weddings' | 'hookahs' | 'cocktails';
  createdAt: string;
  updatedAt: string;
}

export interface PageSeoConfig {
  pageId: 'home' | 'products' | 'services' | 'about' | 'gallery' | 'track' | 'contact' | 'account';
  pageLabel: string;
  path: string;
  title: string;
  description: string;
  focusKeyword: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalPath: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

export interface SeoConfig {
  siteName: string;
  titleSeparator: string;
  siteTagline: string;
  defaultTitle: string;
  defaultDescription: string;
  globalFocusKeyword: string;
  globalKeywords: string;
  canonicalDomain: string;
  ogSiteName: string;
  ogType: string;
  defaultOgImage: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterHandle: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleSiteVerification: string;
  bingSiteVerification: string;
  googleAnalyticsId: string;
  schemaBusinessType: string;
  schemaBusinessName: string;
  schemaDescription: string;
  schemaPriceRange: string;
  schemaOpeningHours: string;
  schemaTelephone: string;
  schemaEmail: string;
  schemaStreetAddress: string;
  schemaLocality: string;
  schemaRegion: string;
  schemaPostalCode: string;
  schemaGeoLat: string;
  schemaGeoLng: string;
  schemaAreaServed: string;
  schemaRatingValue: string;
  schemaReviewCount: string;
  customRobotsTxt: string;
  pages: Record<string, PageSeoConfig>;
  updatedAt: string;
  updatedBy: string;
}

export const DEFAULT_SEO_CONFIG: SeoConfig = {
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
  customRobotsTxt: `User-agent: *\nAllow: /\nDisallow: /api/\n`,
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

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'VIP Lounge Setup with Exotic Fruit Garnishes',
    subtitle: 'Park Street Penthouse Terrace',
    src: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
    category: 'parties',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Artisanal Smoked Cocktails & Shisha Pairing',
    subtitle: 'Flair Mixologist Catering at Alipore Villa',
    src: '/src/assets/images/quote_cocktail_drink_1791648736985.jpg',
    category: 'cocktails',
    createdAt: '2026-10-01T10:01:00.000Z',
    updatedAt: '2026-10-01T10:01:00.000Z',
  },
  {
    id: 'gal-3',
    title: 'SR Signature Series Custom Hardware',
    subtitle: 'VIP Packaging & German Stainless Steel',
    src: '/src/assets/images/category_sr_products_1791648725022.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:02:00.000Z',
    updatedAt: '2026-10-01T10:02:00.000Z',
  },
  {
    id: 'gal-4',
    title: 'Bohemian Cut-Glass Bases & Heavy Stems',
    subtitle: 'Maya Designer Hookahs in Crystal Clear',
    src: '/src/assets/images/category_hookah_bases_1791648627967.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:03:00.000Z',
    updatedAt: '2026-10-01T10:03:00.000Z',
  },
  {
    id: 'gal-5',
    title: 'Glazed Clay Chilam & Heat Management',
    subtitle: 'Even Heat Distribution & Clean Smoke',
    src: '/src/assets/images/category_chilam_bowls_1791648639938.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:04:00.000Z',
    updatedAt: '2026-10-01T10:04:00.000Z',
  },
  {
    id: 'gal-6',
    title: 'Exotic Fruit & Mint Molasses Collection',
    subtitle: '15+ International Brands Ready for Mixing',
    src: '/src/assets/images/category_flavours_1791648613614.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:05:00.000Z',
    updatedAt: '2026-10-01T10:05:00.000Z',
  },
  {
    id: 'gal-7',
    title: 'Sangeet Cocktail Lounge Installation',
    subtitle: 'New Town Banquet Multi-Pot Bar',
    src: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
    category: 'weddings',
    createdAt: '2026-10-01T10:06:00.000Z',
    updatedAt: '2026-10-01T10:06:00.000Z',
  },
  {
    id: 'gal-8',
    title: 'Food-Grade Silicone Hoses & Steel Handles',
    subtitle: 'Sanitized and Autoclaved Equipment',
    src: '/src/assets/images/category_pipes_hoses_1791648651378.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:07:00.000Z',
    updatedAt: '2026-10-01T10:07:00.000Z',
  },
  {
    id: 'gal-9',
    title: 'Organic Coconut Shell Charcoal Ignition',
    subtitle: 'Odorless, Clean-Burning Cubes',
    src: '/src/assets/images/category_coal_accessories_1791648710860.jpg',
    category: 'parties',
    createdAt: '2026-10-01T10:08:00.000Z',
    updatedAt: '2026-10-01T10:08:00.000Z',
  },
];

export interface DatabaseState {
  adminCredentials: AdminCredentials;
  paymentConfig: PaymentConfig;
  contactConfig: ContactConfig;
  seoConfig: SeoConfig;
  products: ProductItem[];
  gallery: GalleryItem[];
  bookings: BookingRecord[];
  termsAcceptances: TermsAcceptanceRecord[];
  auditLogs: AdminAuditLog[];
  users: CustomerUser[];
  cookieConsents: CookieConsentRecord[];
}

function getInitialState(): DatabaseState {
  return {
    adminCredentials: {
      email: process.env.ADMIN_EMAIL || 'admin@shisharent.in',
      passwordHash: process.env.ADMIN_PASSWORD_HASH || 'admin123',
      name: 'Shisha Rent Operations Manager',
      updatedAt: new Date().toISOString(),
    },
    paymentConfig: {
      id: 'active_config',
      upiId: 'shisharent@upi',
      payeeName: 'Shisha Rent Kolkata',
      qrImageUrl: '',
      qrStoragePath: '',
      isActive: true,
      codEnabled: true,
      instructions:
        'Scan with any UPI App (GPay, PhonePe, Paytm, BHIM). Share transaction screenshot on WhatsApp for instant priority confirmation.',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system_init',
    },
    contactConfig: {
      phone: '+91 98765 43210',
      secondaryPhone: '+91 98301 22419',
      whatsappNumber: '+91 98765 43210',
      whatsappUrl: 'https://wa.me/919876543210',
      email: 'bookings@shisharent.in',
      address: 'Park Street & Salt Lake Sector V Concierge Hubs, Kolkata',
      city: 'Kolkata',
      areasServed: 'Salt Lake, New Town, Park Street, Ballygunge, Alipore, Howrah, Behala & all across Kolkata',
      hours: 'Open Daily · 11:00 AM to 3:00 AM (Late Night Service)',
      instagramUrl: 'https://instagram.com/shisharentkolkata',
      facebookUrl: 'https://facebook.com/shisharentkolkata',
      googleMapsUrl: 'https://maps.google.com/?q=Park+Street+Kolkata',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system_init',
    },
    seoConfig: JSON.parse(JSON.stringify(DEFAULT_SEO_CONFIG)),
    products: ALL_PRODUCTS,
    gallery: DEFAULT_GALLERY_ITEMS,
    bookings: [
      {
        id: 'SR-KOL-1001',
        domain: 'shisharent.in',
        customerName: 'Aman Singhania',
        customerPhone: '+91 98301 22419',
        eventDate: '2026-10-12',
        eventTime: '20:00',
        deliveryArea: 'Salt Lake Sector 5',
        customAddress: 'Infinity Benchmark Tower B, Rooftop Terrace',
        potCount: '3',
        requestedItems: [
          ALL_PRODUCTS[0], // Al Fakir
          ALL_PRODUCTS[7], // Royal
          ALL_PRODUCTS[16], // Maya Hookah
          ALL_PRODUCTS[25], // Mud / Mitti Chilam
          ALL_PRODUCTS[36], // Coconut Coal
        ],
        includeBartender: true,
        includeCook: false,
        specialInstructions: 'Please deliver coals pre-cut with extra tongs.',
        paymentMethod: 'qr',
        paymentStatus: 'verified',
        transactionReference: 'UPI/261012984102/AXIS',
        bookingStatus: 'confirmed',
        termsAccepted: true,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'SR-KOL-1002',
        domain: 'shisharent.com',
        customerName: 'Rhea Sen',
        customerPhone: '+91 98310 88204',
        eventDate: '2026-10-13',
        eventTime: '18:30',
        deliveryArea: 'Alipore',
        customAddress: 'Burdwan Road, Residence 4A',
        potCount: '2',
        requestedItems: [
          ALL_PRODUCTS[17], // Coco Aaya Hookah
          ALL_PRODUCTS[5],  // Afzal
          ALL_PRODUCTS[24], // Silicone Chilam
          ALL_PRODUCTS[33], // Heater Burner
        ],
        includeBartender: false,
        includeCook: false,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        bookingStatus: 'pending',
        termsAccepted: true,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    termsAcceptances: [
      {
        id: 'term-init-01',
        bookingId: 'SR-KOL-1001',
        customerName: 'Aman Singhania',
        customerPhone: '+91 98301 22419',
        domain: 'shisharent.in',
        termsVersion: '2026-v1.0',
        policySnippet: 'Customer booking ke time apni requirement ke according Flavour Brand request kar sakta hai...',
        customerIp: '103.220.14.88',
        userAgent: 'Mozilla/5.0 Chrome/130.0',
        acceptedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'term-init-02',
        bookingId: 'SR-KOL-1002',
        customerName: 'Rhea Sen',
        customerPhone: '+91 98310 88204',
        domain: 'shisharent.com',
        termsVersion: '2026-v1.0',
        policySnippet: 'Customer booking ke time apni requirement ke according Flavour Brand request kar sakta hai...',
        customerIp: '103.220.14.92',
        userAgent: 'Mozilla/5.0 Safari/18.0',
        acceptedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    auditLogs: [],
    users: [
      {
        id: 'usr-kol-1001',
        name: 'Aman Singhania',
        email: 'aman@example.com',
        phone: '+91 98301 22419',
        passwordHash: '123456',
        authProvider: 'local',
        preferredFlavour: 'Kolkata Meetha Paan',
        savedAddresses: [
          {
            id: 'addr-1',
            label: 'Party Venue',
            area: 'Salt Lake (Sector 1 - 5)',
            addressLine: 'Infinity Benchmark Tower B, Rooftop Terrace',
            landmark: 'Sector 5 Electronics Complex',
            isDefault: true,
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    cookieConsents: [],
  };
}

// In-memory cache synced to disk
let dbState: DatabaseState = getInitialState();

export function initDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbState = JSON.parse(data);

      if (!dbState.adminCredentials || !dbState.adminCredentials.email) {
        dbState.adminCredentials = getInitialState().adminCredentials;
      }
      if (!dbState.contactConfig || !dbState.contactConfig.phone) {
        dbState.contactConfig = getInitialState().contactConfig;
      } else {
        dbState.contactConfig = {
          ...getInitialState().contactConfig,
          ...dbState.contactConfig,
        };
      }
      if (!Array.isArray(dbState.users)) {
        dbState.users = getInitialState().users;
      }
      if (!Array.isArray(dbState.cookieConsents)) {
        dbState.cookieConsents = [];
      }
      if (!Array.isArray(dbState.gallery)) {
        dbState.gallery = DEFAULT_GALLERY_ITEMS;
      }
      if (!dbState.seoConfig || !dbState.seoConfig.siteName) {
        dbState.seoConfig = JSON.parse(JSON.stringify(DEFAULT_SEO_CONFIG));
      } else {
        const mergedPages: Record<string, PageSeoConfig> = {
          ...DEFAULT_SEO_CONFIG.pages,
        };
        if (dbState.seoConfig.pages && typeof dbState.seoConfig.pages === 'object') {
          Object.keys(DEFAULT_SEO_CONFIG.pages).forEach((key) => {
            mergedPages[key] = {
              ...DEFAULT_SEO_CONFIG.pages[key],
              ...(dbState.seoConfig.pages[key] || {}),
            };
          });
        }
        dbState.seoConfig = {
          ...DEFAULT_SEO_CONFIG,
          ...dbState.seoConfig,
          pages: mergedPages,
        };
      }

      // Ensure all products have complete fields (images, price, rating, brand, specs) and preserve admin-added custom products
      if (Array.isArray(dbState.products)) {
        const defaultMap = new Map(ALL_PRODUCTS.map((p) => [p.id, p]));
        const existingIds = new Set(dbState.products.map((p) => p.id));

        const normalizedExisting = dbState.products.map((p) => {
          const def = defaultMap.get(p.id);
          return {
            ...(def || {}),
            ...p,
            brand: p.brand || def?.brand || 'Shisha Rent Kolkata',
            price: typeof p.price === 'number' ? p.price : (def?.price ?? 499),
            rentalRate: p.rentalRate || def?.rentalRate || `₹${typeof p.price === 'number' ? p.price : 499} / session`,
            rating: typeof p.rating === 'number' ? p.rating : (def?.rating ?? 5.0),
            reviewsCount: typeof p.reviewsCount === 'number' ? p.reviewsCount : (def?.reviewsCount ?? 12),
            images: Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : (def?.images || ['/src/assets/images/hero_luxury_hookah_1791648599431.jpg']),
            specs: p.specs && typeof p.specs === 'object'
              ? p.specs
              : (def?.specs || { Origin: 'Authentic Luxury Grade', KolkataDelivery: 'Express 45-60 min' }),
          };
        });

        // Append any missing default catalog products that were added in code updates
        const missingDefaults = ALL_PRODUCTS.filter((p) => !existingIds.has(p.id));
        dbState.products = [...normalizedExisting, ...missingDefaults];
      } else {
        dbState.products = ALL_PRODUCTS;
      }

      if (dbState.paymentConfig?.qrImageUrl?.startsWith('/uploads/')) {
        const localFilePath = path.resolve(process.cwd(), dbState.paymentConfig.qrImageUrl.replace(/^\//, ''));
        if (!fs.existsSync(localFilePath)) {
          dbState.paymentConfig.qrImageUrl = '';
          dbState.paymentConfig.qrStoragePath = '';
        }
      }
      saveDatabase();
      console.log('[Database] Loaded and normalized existing database state from', DB_FILE);
    } else {
      saveDatabase();
      console.log('[Database] Created new initialized database at', DB_FILE);
    }
  } catch (err) {
    console.error('[Database] Failed to read database file, initializing defaults:', err);
    dbState = getInitialState();
  }
}

export function saveDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Failed to save database to disk:', err);
  }
}

export function getDatabase(): DatabaseState {
  return dbState;
}

export function updateAdminCredentials(updates: Partial<AdminCredentials>): AdminCredentials {
  dbState.adminCredentials = {
    ...dbState.adminCredentials,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();
  return dbState.adminCredentials;
}

export function formatWhatsAppUrl(rawNumber: string): string {
  const digits = (rawNumber || '').replace(/\D/g, '');
  if (!digits) return 'https://wa.me/919876543210';
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${normalized}`;
}

export function updateContactConfig(config: Partial<ContactConfig>, adminUser: string): ContactConfig {
  const nextWhatsappNumber =
    config.whatsappNumber !== undefined
      ? config.whatsappNumber
      : dbState.contactConfig?.whatsappNumber || config.phone || dbState.contactConfig?.phone || '+91 98765 43210';

  const nextWhatsappUrl =
    config.whatsappUrl && config.whatsappUrl.startsWith('http')
      ? config.whatsappUrl
      : formatWhatsAppUrl(nextWhatsappNumber);

  dbState.contactConfig = {
    ...getInitialState().contactConfig,
    ...(dbState.contactConfig || {}),
    ...config,
    whatsappNumber: nextWhatsappNumber,
    whatsappUrl: nextWhatsappUrl,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUser,
  };
  saveDatabase();
  return dbState.contactConfig;
}

export function updatePaymentConfig(config: Partial<PaymentConfig>, adminUser: string): PaymentConfig {
  dbState.paymentConfig = {
    ...dbState.paymentConfig,
    ...config,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUser,
  };
  saveDatabase();

  // If Supabase is connected, sync to PostgreSQL
  if (supabase) {
    supabase
      .from('payment_settings')
      .upsert({
        id: 'active_config',
        upi_id: dbState.paymentConfig.upiId,
        payee_name: dbState.paymentConfig.payeeName,
        qr_image_url: dbState.paymentConfig.qrImageUrl,
        qr_storage_path: dbState.paymentConfig.qrStoragePath,
        is_active: dbState.paymentConfig.isActive,
        cod_enabled: dbState.paymentConfig.codEnabled,
        instructions: dbState.paymentConfig.instructions,
        updated_at: dbState.paymentConfig.updatedAt,
        updated_by: adminUser,
      })
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to sync payment settings:', error);
      });
  }

  return dbState.paymentConfig;
}

export function addBooking(booking: BookingRecord, termsSnippet: string, ip?: string, userAgent?: string): BookingRecord {
  dbState.bookings.unshift(booking);

  // Record immutable terms acceptance
  const acceptance: TermsAcceptanceRecord = {
    id: 'term-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    bookingId: booking.id,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    domain: booking.domain,
    termsVersion: '2026-v1.0',
    policySnippet: termsSnippet,
    customerIp: ip,
    userAgent,
    acceptedAt: new Date().toISOString(),
  };
  dbState.termsAcceptances.unshift(acceptance);
  saveDatabase();

  // Sync to Supabase if available
  if (supabase) {
    supabase
      .from('bookings')
      .insert({
        id: booking.id,
        domain: booking.domain,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        event_date: booking.eventDate,
        event_time: booking.eventTime,
        delivery_area: booking.deliveryArea,
        custom_address: booking.customAddress,
        pot_count: booking.potCount,
        requested_items: booking.requestedItems,
        include_bartender: booking.includeBartender,
        include_cook: booking.includeCook,
        special_instructions: booking.specialInstructions,
        payment_method: booking.paymentMethod,
        payment_status: booking.paymentStatus,
        transaction_reference: booking.transactionReference,
        booking_status: booking.bookingStatus,
        terms_accepted: booking.termsAccepted,
        created_at: booking.createdAt,
        updated_at: booking.updatedAt,
      })
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to sync booking:', error);
      });

    supabase
      .from('terms_acceptances')
      .insert({
        id: acceptance.id,
        booking_id: acceptance.bookingId,
        customer_name: acceptance.customerName,
        customer_phone: acceptance.customerPhone,
        domain: acceptance.domain,
        terms_version: acceptance.termsVersion,
        policy_snippet: acceptance.policySnippet,
        customer_ip: acceptance.customerIp,
        user_agent: acceptance.userAgent,
        accepted_at: acceptance.acceptedAt,
      })
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to sync terms acceptance:', error);
      });
  }

  return booking;
}

export function updateBooking(bookingId: string, updates: Partial<BookingRecord>): BookingRecord | null {
  const index = dbState.bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return null;

  dbState.bookings[index] = {
    ...dbState.bookings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();

  if (supabase) {
    supabase
      .from('bookings')
      .update({
        booking_status: dbState.bookings[index].bookingStatus,
        payment_status: dbState.bookings[index].paymentStatus,
        transaction_reference: dbState.bookings[index].transactionReference,
        payment_proof_url: dbState.bookings[index].paymentProofUrl,
        substitution_offered: dbState.bookings[index].substitutionOffered,
        substitution_note: dbState.bookings[index].substitutionNote,
        substitution_customer_confirmed: dbState.bookings[index].substitutionCustomerConfirmed,
        substitution_action_at: dbState.bookings[index].substitutionActionAt,
        updated_at: dbState.bookings[index].updatedAt,
      })
      .eq('id', bookingId)
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to update booking:', error);
      });
  }

  return dbState.bookings[index];
}

export function logAudit(action: string, details: any, adminEmail: string, ipAddress?: string): void {
  const log: AdminAuditLog = {
    id: 'audit-' + Date.now(),
    action,
    details,
    adminEmail,
    ipAddress,
    createdAt: new Date().toISOString(),
  };
  dbState.auditLogs.unshift(log);
  saveDatabase();
}

export function addProduct(product: ProductItem): ProductItem {
  dbState.products.unshift(product);
  saveDatabase();

  if (supabase) {
    supabase
      .from('products')
      .insert({
        id: product.id,
        name: product.name,
        category: product.category,
        category_label: product.categoryLabel,
        type: product.type,
        brand: product.brand,
        price: product.price,
        rental_rate: product.rentalRate,
        description: product.description,
        highlight: product.highlight,
        in_stock: product.inStock,
        rental_or_sale: product.rentalOrSale,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        images: product.images,
        specs: product.specs,
        is_best_seller: product.isBestSeller,
        is_new: product.isNew,
      })
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to add product:', error);
      });
  }

  return product;
}

export function updateProduct(id: string, updates: Partial<ProductItem>): ProductItem | null {
  const index = dbState.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  dbState.products[index] = {
    ...dbState.products[index],
    ...updates,
  };
  saveDatabase();

  if (supabase) {
    supabase
      .from('products')
      .update({
        name: dbState.products[index].name,
        category: dbState.products[index].category,
        type: dbState.products[index].type,
        brand: dbState.products[index].brand,
        price: dbState.products[index].price,
        rental_rate: dbState.products[index].rentalRate,
        description: dbState.products[index].description,
        in_stock: dbState.products[index].inStock,
        rating: dbState.products[index].rating,
        images: dbState.products[index].images,
        is_best_seller: dbState.products[index].isBestSeller,
      })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to update product:', error);
      });
  }

  return dbState.products[index];
}

export function deleteProduct(id: string): boolean {
  const index = dbState.products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  dbState.products.splice(index, 1);
  saveDatabase();

  if (supabase) {
    supabase
      .from('products')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to delete product from Supabase:', error);
      });
  }

  return true;
}

export function normalizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '').slice(-10);
}

export function findCustomerUserByIdentifier(identifier: string): CustomerUser | undefined {
  const clean = (identifier || '').trim().toLowerCase();
  const cleanDigits = normalizePhone(identifier);
  return dbState.users.find(
    (u) =>
      u.email.toLowerCase() === clean ||
      (cleanDigits.length >= 10 && normalizePhone(u.phone) === cleanDigits)
  );
}

export function findCustomerUserById(userId: string): CustomerUser | undefined {
  return dbState.users.find((u) => u.id === userId);
}

export function createCustomerUser(user: CustomerUser): CustomerUser {
  dbState.users.unshift(user);
  saveDatabase();
  return user;
}

export function updateCustomerUser(userId: string, updates: Partial<CustomerUser>): CustomerUser | null {
  const index = dbState.users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  dbState.users[index] = {
    ...dbState.users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();
  return dbState.users[index];
}

export function getCustomerBookings(user: CustomerUser): BookingRecord[] {
  const userDigits = normalizePhone(user.phone);
  return dbState.bookings.filter((b) => {
    if (b.userId && b.userId === user.id) return true;
    if (b.customerEmail && b.customerEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (userDigits.length >= 10 && normalizePhone(b.customerPhone) === userDigits) return true;
    return false;
  });
}

export function saveCookieConsent(record: CookieConsentRecord): CookieConsentRecord {
  const existingIdx = dbState.cookieConsents.findIndex((c) => c.visitorId === record.visitorId);
  if (existingIdx !== -1) {
    dbState.cookieConsents[existingIdx] = record;
  } else {
    dbState.cookieConsents.unshift(record);
  }
  saveDatabase();
  return record;
}

export function addGalleryItem(item: GalleryItem): GalleryItem {
  if (!Array.isArray(dbState.gallery)) {
    dbState.gallery = [...DEFAULT_GALLERY_ITEMS];
  }
  dbState.gallery.unshift(item);
  saveDatabase();
  return item;
}

export function updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
  if (!Array.isArray(dbState.gallery)) {
    dbState.gallery = [...DEFAULT_GALLERY_ITEMS];
  }
  const index = dbState.gallery.findIndex((g) => g.id === id);
  if (index === -1) return null;

  dbState.gallery[index] = {
    ...dbState.gallery[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();
  return dbState.gallery[index];
}

export function deleteGalleryItem(id: string): boolean {
  if (!Array.isArray(dbState.gallery)) {
    dbState.gallery = [...DEFAULT_GALLERY_ITEMS];
  }
  const index = dbState.gallery.findIndex((g) => g.id === id);
  if (index === -1) return false;

  dbState.gallery.splice(index, 1);
  saveDatabase();
  return true;
}

export function updateSeoConfig(updates: Partial<SeoConfig>, adminUser: string): SeoConfig {
  const current = dbState.seoConfig || JSON.parse(JSON.stringify(DEFAULT_SEO_CONFIG));
  const mergedPages: Record<string, PageSeoConfig> = {
    ...DEFAULT_SEO_CONFIG.pages,
    ...(current.pages || {}),
  };

  if (updates.pages && typeof updates.pages === 'object') {
    Object.keys(updates.pages).forEach((pageKey) => {
      if (mergedPages[pageKey]) {
        mergedPages[pageKey] = {
          ...mergedPages[pageKey],
          ...updates.pages![pageKey],
        };
      } else {
        mergedPages[pageKey] = updates.pages![pageKey];
      }
    });
  }

  dbState.seoConfig = {
    ...DEFAULT_SEO_CONFIG,
    ...current,
    ...updates,
    pages: mergedPages,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUser,
  };

  saveDatabase();
  return dbState.seoConfig;
}


