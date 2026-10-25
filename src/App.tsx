/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { TermsModal } from './components/TermsModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CustomerOrderTrackerModal } from './components/CustomerOrderTrackerModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { SEOHead } from './components/SEOHead';
import { ProductItem } from './data/productsData';
import { api, PaymentConfig } from './services/api';
import { useCart } from './context/CartContext';
import { useNavigation } from './context/NavigationContext';
import { useAuth } from './context/AuthContext';

// Multi-Page Views
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { TrackPage } from './pages/TrackPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';

export default function App() {
  const { cartItems } = useCart();
  const { currentPage, navigateTo } = useNavigation();
  const { user, openAuthModal } = useAuth();
  const [currentDomain, setCurrentDomain] = useState<string>('shisharent.in');
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);

  // Global Modals State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState<string>('');

  // Product Detail Modal State
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  // Selected Booking Items State
  const [selectedBookingItems, setSelectedBookingItems] = useState<ProductItem[]>([]);

  // Load app configuration and active payment settings on mount
  useEffect(() => {
    loadPaymentSettings();
    api
      .getConfig()
      .then((cfg) => {
        if (cfg?.domain) setCurrentDomain(cfg.domain);
      })
      .catch(() => {});
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const res = await api.getPaymentSettings();
      if (res.success && res.data) {
        setPaymentConfig(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch payment settings:', err);
    }
  };

  // Flipkart-style Checkout Gate: require customer login/registration before opening BookingModal
  const requestProtectedBookingOpen = (reasonText?: string) => {
    if (user) {
      setIsBookingOpen(true);
    } else {
      openAuthModal(
        'login',
        reasonText || 'Please sign in or create an account (or continue with Gmail) to place your hookah order.',
        () => setIsBookingOpen(true)
      );
    }
  };

  // When user clicks "Request in Booking" on a product card
  const handleRequestItemInBooking = (item: ProductItem) => {
    setSelectedBookingItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // When user clicks "Track Order" from booking confirmation
  const handleTrackCreatedOrder = (bookingId: string) => {
    setActiveTrackingId(bookingId);
    if (user) {
      navigateTo('account');
    } else {
      navigateTo('track');
    }
  };

  // Open Product Detail Modal
  const handleOpenProductDetail = (item: ProductItem) => {
    setSelectedProductDetail(item);
    setIsProductDetailOpen(true);
  };

  // Open booking modal with items from cart (Flipkart-style checkout gate)
  const handleProceedFromCartToBooking = () => {
    if (cartItems.length > 0) {
      const items = cartItems.map((ci) => ci.product);
      setSelectedBookingItems((prev) => {
        const merged = [...prev];
        items.forEach((it) => {
          if (!merged.some((m) => m.id === it.id)) {
            merged.push(it);
          }
        });
        return merged;
      });
    }
    requestProtectedBookingOpen(
      'Sign in or register to checkout your cart items with your saved Kolkata delivery address.'
    );
  };

  // 1-Click Reorder from Customer Client Panel
  const handleReorderItems = (items: ProductItem[]) => {
    setSelectedBookingItems(items);
    setIsBookingOpen(true);
  };

  // Open booking with custom configured chillum setup
  const handleOpenBookingWithConfig = (cfg: {
    flavourName: string;
    chillumType: 'classic_clay' | 'gold_silicon';
    chillumPrice: number;
    wantsBase: boolean;
    baseType?: string;
    basePrice?: number;
    totalPrice: number;
  }) => {
    const item: ProductItem = {
      id: `configured-${Date.now()}`,
      name: `${cfg.flavourName} (${
        cfg.chillumType === 'classic_clay' ? 'Classic Clay' : 'Gold Silicon Cloud'
      }${cfg.wantsBase ? ` + ${cfg.baseType}` : ''})`,
      category: 'chilam',
      categoryLabel: 'Pre-filled Ready Chillum',
      type: 'Ready-to-Smoke Setup',
      brand: 'Shisha Rent Kolkata',
      price: cfg.totalPrice,
      description: `Chillum: ${
        cfg.chillumType === 'classic_clay' ? 'Classic Clay (₹600)' : 'Gold Silicon Cloud (₹700)'
      }. Hookah Base: ${cfg.wantsBase ? `Included (${cfg.baseType})` : 'No (Chillum Only)'}.`,
      inStock: true,
      rentalOrSale: 'Available for Rental & Setup',
      rating: 5.0,
      reviewsCount: 1,
      images: ['/src/assets/images/flavour_paan_collection_1791655854763.jpg'],
      specs: {
        Chillum: cfg.chillumType === 'classic_clay' ? 'Classic Clay (₹600)' : 'Gold Silicon Cloud (₹700)',
        Flavour: cfg.flavourName,
        Base: cfg.wantsBase ? `${cfg.baseType}` : 'No',
      },
    };
    setSelectedBookingItems([item]);
    requestProtectedBookingOpen(
      `Sign in or create an account to book your configured ${cfg.flavourName} setup.`
    );
  };

  // Render the active multi-page view
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'products':
        return (
          <ProductsPage
            onOpenBookingModal={() => requestProtectedBookingOpen()}
            onOpenBookingWithConfig={handleOpenBookingWithConfig}
            onOpenPolicyModal={() => setIsTermsOpen(true)}
            onOpenProductDetail={handleOpenProductDetail}
            onRequestItemInBooking={handleRequestItemInBooking}
            selectedBookingItems={selectedBookingItems}
          />
        );
      case 'services':
        return <ServicesPage onOpenBooking={() => requestProtectedBookingOpen()} />;
      case 'about':
        return <AboutPage onOpenBooking={() => requestProtectedBookingOpen()} />;
      case 'gallery':
        return <GalleryPage onOpenBooking={() => requestProtectedBookingOpen()} />;
      case 'track':
        return <TrackPage paymentConfig={paymentConfig} />;
      case 'contact':
        return <ContactPage />;
      case 'account':
        return (
          <AccountPage
            paymentConfig={paymentConfig}
            onReorderItems={handleReorderItems}
            onOpenBooking={() => requestProtectedBookingOpen()}
          />
        );
      case 'home':
      default:
        return (
          <HomePage
            onOpenBooking={() => requestProtectedBookingOpen()}
            onOpenBookingWithConfig={handleOpenBookingWithConfig}
            onOpenProductDetail={handleOpenProductDetail}
            paymentConfig={paymentConfig}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#070709] luxury-wallpaper text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white pb-16 sm:pb-0">
      {/* Dynamic WordPress/Yoast-Style SEO Meta Tag & Schema.org Head Manager */}
      <SEOHead />

      {/* Mandatory 18+ Age Verification Gate on Domain Open */}
      <AgeVerificationModal />

      {/* Top Header Navigation */}
      <Header
        onOpenBooking={() => requestProtectedBookingOpen()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => navigateTo('track')}
        currentDomain={currentDomain}
        onSelectDomain={(d) => setCurrentDomain(d)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">{renderCurrentPage()}</main>

      {/* Mobile Bottom Quick-Book & Track Sticky Bar (Visible on mobile <640px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0b12]/95 backdrop-blur-lg border-t border-neutral-800 px-3 py-2 flex items-center justify-between gap-2">
        <button
          onClick={() => navigateTo(user ? 'account' : 'track')}
          className="px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-semibold shrink-0"
        >
          {user ? 'My Orders' : 'Track Order'}
        </button>
        <button
          onClick={() => requestProtectedBookingOpen()}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold text-center shadow-lg shadow-red-900/40"
        >
          Book Hookah Setup Now
        </button>
      </div>

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Cookie Consent & Google SEO Tracking Manager */}
      <CookieConsentBanner currentPage={currentPage} />

      {/* Global Multi-Page Footer */}
      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenBooking={() => requestProtectedBookingOpen()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => navigateTo('track')}
      />

      {/* Customer Login / Register / Google Auth Modal */}
      <CustomerAuthModal />

      {/* Interactive Booking & Custom Quote Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialSelectedItems={selectedBookingItems}
        paymentConfig={paymentConfig}
        currentDomain={currentDomain}
        onTrackOrder={handleTrackCreatedOrder}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        onOpenBookingForProduct={(p) => {
          handleRequestItemInBooking(p);
          setIsProductDetailOpen(false);
          requestProtectedBookingOpen(
            `Please sign in or create an account to book ${p.name}.`
          );
        }}
        onSelectRelatedProduct={(p) => setSelectedProductDetail(p)}
      />

      {/* Cart Slide-out Drawer */}
      <CartDrawer onProceedToBooking={handleProceedFromCartToBooking} />

      {/* Terms & Conditions Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

      {/* Administrator-Only Payment Settings, QR Upload & Booking Verification Portal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onPaymentConfigUpdated={loadPaymentSettings}
      />

      {/* Customer Order Tracker Modal (accessible on confirmation) */}
      <CustomerOrderTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        initialBookingId={activeTrackingId}
        paymentConfig={paymentConfig}
      />
    </div>
  );
}
