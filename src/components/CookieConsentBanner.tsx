import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, SlidersHorizontal, Check, X } from 'lucide-react';
import { api, CookieConsentPreferences } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageId } from '../context/NavigationContext';

interface CookieConsentBannerProps {
  currentPage: PageId;
}

const PAGE_SEO_META: Record<PageId, { title: string; description: string }> = {
  home: {
    title: 'Shisha Rent Kolkata | Premium Hookah Rental & Event Services',
    description:
      'Luxury hookah rentals, 15+ exotic flavour brands, pre-filled chillums, professional bartenders & event catering across Salt Lake, New Town, Park Street & Alipore.',
  },
  products: {
    title: 'Hookah & Flavour Marketplace | Shisha Rent Kolkata',
    description:
      'Browse 45+ authentic hookah pots, Bohemian glass bases, Al Fakher & Afzal flavours, silicone bowls, and coconut charcoal in Kolkata.',
  },
  services: {
    title: 'VIP Event Hookah Catering, Bartenders & Chefs | Shisha Rent Kolkata',
    description:
      'Book private party shisha sommeliers, molecular mixologists, and live barbecue chefs for birthdays, weddings & house parties in Kolkata.',
  },
  about: {
    title: 'About Shisha Rent Kolkata | Hygiene & Authenticity Guarantee',
    description:
      'Learn about Kolkata’s #1 luxury shisha rental service with hospital-grade sanitization and 100% customer brand choice guarantee.',
  },
  gallery: {
    title: 'Event Photo Gallery & Setups | Shisha Rent Kolkata',
    description:
      'Explore real rooftop parties, wedding shisha lounges, and LED crystal hookah setups delivered across Kolkata.',
  },
  track: {
    title: 'Track Your Hookah Order Live | Shisha Rent Kolkata',
    description:
      'Track your real-time Shisha Rent Kolkata booking status, upload UPI payment screenshots, and manage flavour substitutions.',
  },
  contact: {
    title: 'Contact & 45-Min Express Kolkata Coverage | Shisha Rent Kolkata',
    description:
      '24/7 WhatsApp booking and rapid doorstep delivery in Salt Lake, New Town, Park Street, Ballygunge, Alipore & Howrah.',
  },
  account: {
    title: 'My Account & Order History | Shisha Rent Kolkata Client Panel',
    description:
      'Manage your current hookah rentals, reorder past setups in 1 click, and update your saved Kolkata delivery addresses.',
  },
};

function setBrowserCookie(name: string, value: string, days = 180) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ currentPage }) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [seoPersonalization, setSeoPersonalization] = useState(true);

  // Dynamic SEO Title & Meta Description per page
  useEffect(() => {
    const seo = PAGE_SEO_META[currentPage] || PAGE_SEO_META.home;
    document.title = seo.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', seo.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);
  }, [currentPage]);

  // Check existing cookie consent on mount & track UTM / session
  useEffect(() => {
    let visitorId = localStorage.getItem('sr_visitor_id');
    if (!visitorId) {
      visitorId = `vis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('sr_visitor_id', visitorId);
    }
    setBrowserCookie('sr_visitor_id', visitorId);
    setBrowserCookie('sr_last_page', currentPage, 30);

    const savedConsent = localStorage.getItem('sr_cookie_consent');
    if (!savedConsent) {
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const persistConsent = async (prefs: {
    analytics: boolean;
    marketing: boolean;
    seoPersonalization: boolean;
  }) => {
    const visitorId =
      localStorage.getItem('sr_visitor_id') ||
      `vis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || undefined;

    const payload: CookieConsentPreferences = {
      visitorId,
      userId: user?.id,
      essential: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      seoPersonalization: prefs.seoPersonalization,
      utmSource,
      referrer: document.referrer || undefined,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('sr_cookie_consent', JSON.stringify(payload));
    setBrowserCookie('sr_cookie_consent', JSON.stringify({
      e: 1,
      a: prefs.analytics ? 1 : 0,
      m: prefs.marketing ? 1 : 0,
      s: prefs.seoPersonalization ? 1 : 0,
    }));

    setVisible(false);
    try {
      await api.saveCookieConsent(payload);
    } catch {
      // ignore network error
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0c14]/95 backdrop-blur-xl border border-neutral-800 shadow-2xl space-y-3.5 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-heading">
                Cookies, Customer Experience & Google SEO
              </h4>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Fast Checkout & Personalized Kolkata Delivery</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-neutral-500 hover:text-white p-1"
            aria-label="Dismiss cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          We use cookies to remember your cart, saved Kolkata address, login session, and Google SEO analytics so we can deliver faster to your doorstep.
        </p>

        {showCustomize && (
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <label className="flex items-center justify-between text-neutral-300">
              <span>Essential Cart & Account Session</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Always Active</span>
            </label>
            <label className="flex items-center justify-between text-neutral-300 cursor-pointer">
              <span>Customer Order Tracking & Analytics</span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="accent-red-600"
              />
            </label>
            <label className="flex items-center justify-between text-neutral-300 cursor-pointer">
              <span>Google SEO & Local Area Personalization</span>
              <input
                type="checkbox"
                checked={seoPersonalization}
                onChange={(e) => setSeoPersonalization(e.target.checked)}
                className="accent-red-600"
              />
            </label>
            <label className="flex items-center justify-between text-neutral-300 cursor-pointer">
              <span>Party Offers & Flavour Recommendations</span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="accent-red-600"
              />
            </label>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              persistConsent({
                analytics: true,
                marketing: true,
                seoPersonalization: true,
              })
            }
            className="flex-1 py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-900/30 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All Cookies</span>
          </button>

          {showCustomize ? (
            <button
              type="button"
              onClick={() =>
                persistConsent({
                  analytics,
                  marketing,
                  seoPersonalization,
                })
              }
              className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
            >
              Save Preferences
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomize(true)}
              className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              persistConsent({
                analytics: false,
                marketing: false,
                seoPersonalization: false,
              })
            }
            className="py-2 px-2.5 rounded-xl text-neutral-400 hover:text-white text-[11px] cursor-pointer"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
};
