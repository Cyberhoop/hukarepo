import React, { useState } from 'react';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Crown,
  Truck,
  Sparkles,
  Flame,
  Star,
  ChevronRight,
  GlassWater,
  Utensils,
  Eye,
  CheckCircle2,
  Clock,
  Heart,
  Plus,
} from 'lucide-react';
import { PRODUCT_CATEGORIES, ProductItem } from '../data/productsData';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useContact } from '../context/ContactContext';
import { ChillumFlavourBookingConfigurator } from '../components/ChillumFlavourBookingConfigurator';
import { MasterCatalogSequenceSection } from '../components/MasterCatalogSequenceSection';
import { HeroSlider } from '../components/HeroSlider';
import { QuickServicesBar } from '../components/QuickServicesBar';
import { WhiteHookahShowcase } from '../components/WhiteHookahShowcase';
import { UpiQrShowcase } from '../components/UpiQrShowcase';
import type { PaymentConfig } from '../services/api';

interface HomePageProps {
  onOpenBooking: () => void;
  onOpenBookingWithConfig?: (config: any) => void;
  onOpenProductDetail: (product: ProductItem) => void;
  paymentConfig?: PaymentConfig | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBooking,
  onOpenBookingWithConfig,
  onOpenProductDetail,
  paymentConfig,
}) => {
  const { navigateTo } = useNavigation();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { contactConfig, getWhatsAppLink } = useContact();
  const [selectedOccasion, setSelectedOccasion] = useState<number>(0);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Occasions for instant rental selector
  const occasions = [
    {
      title: 'Night at Home',
      badge: 'Most Popular',
      desc: '1 Luxury German Shisha · 2 Flavour Tins · 1kg Coconut Coal · Electric Burner',
      price: '₹999 / night',
      idealFor: '1–4 people',
    },
    {
      title: 'Rooftop & Terrace Bash',
      badge: 'Party Hit',
      desc: '2 Designer Hookahs · 4 Flavour Varieties · Premium Coals · Extra Hoses',
      price: '₹1,799 / night',
      idealFor: '5–12 people',
    },
    {
      title: 'Cocktail & Shisha Lounge',
      badge: 'VIP Experience',
      desc: '2 Hookahs + 1 Professional Flair Mixologist · Smoked Cocktail Menu',
      price: '₹3,499 / night',
      idealFor: 'House parties & bachelors',
    },
    {
      title: 'Wedding & Grand Gala',
      badge: 'Turnkey Luxury',
      desc: 'Full Shisha Bar · Dedicated Shisha Sommeliers · Custom Flavours & Coals',
      price: 'Custom Package',
      idealFor: '20+ guests',
    },
  ];

  // Spotlight hookahs for instant rental showcase
  const spotlightHookahs = products.filter(
    (p) => p.category === 'hookah-bases' || p.category === 'sr-products'
  ).slice(0, 4);

  const handleQuickAdd = (product: ProductItem) => {
    addToCart(product, 1, true);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ================================================================ */}
      {/* 1. CINEMATIC LUXURY HERO SECTION */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden pt-6 sm:pt-8 pb-12 lg:py-20 bg-gradient-to-b from-[#070709] via-[#0c0c14] to-[#070709]">
        {/* Ambient atmospheric red & gold glow */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-8 text-left min-w-0">
              
              <div className="inline-flex items-center gap-2 max-w-full">
                <span className="h-[2px] w-5 sm:w-6 bg-red-600 shrink-0"></span>
                <p className="text-[11px] sm:text-sm font-semibold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-neutral-300 leading-snug">
                  KOLKATA'S PREMIER HOOKAH & EVENT CATERING
                </p>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] font-heading">
                Elevate Your Night With{' '}
                <span className="text-red-600 drop-shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                  Shisha Rent
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
                Curated Russian & German shishas, 15+ exotic herbal & tobacco flavours, organic coconut coals, and certified event mixologists delivered to your doorstep in 60 minutes.
              </p>

              {/* Action Buttons: Full-width on mobile, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
                <button
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold shadow-xl shadow-red-900/40 hover:shadow-red-600/50 transition-all active:scale-95 cursor-pointer text-sm sm:text-base"
                >
                  <Calendar className="w-5 h-5 text-white/90 shrink-0" />
                  <span>Book for Tonight</span>
                </button>

                <button
                  onClick={() => navigateTo('products')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-500 text-neutral-100 font-medium transition-all active:scale-95 cursor-pointer text-sm sm:text-base group"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>

              {/* 4 Trust Badges */}
              <div className="pt-5 sm:pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-red-900/40 flex items-center justify-center text-red-500 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">100% Sanitized</div>
                    <div className="text-[11px] text-neutral-400 truncate">Sealed Mouthpieces</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-amber-900/40 flex items-center justify-center text-amber-500 shrink-0">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">German Steel</div>
                    <div className="text-[11px] text-neutral-400 truncate">Crystal Glass</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-red-900/40 flex items-center justify-center text-red-500 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">60-Min Express</div>
                    <div className="text-[11px] text-neutral-400 truncate">Across Kolkata</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-amber-900/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">Nightlife Crew</div>
                    <div className="text-[11px] text-neutral-400 truncate">Bartender & Cooks</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Automated Luxury Hero Slider with Controls */}
            <div className="lg:col-span-6 relative min-w-0">
              <HeroSlider
                onOpenBooking={onOpenBooking}
                onNavigatePage={(page) => navigateTo(page)}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. OFFICIAL ROYAL GOLDEN SERVICE BAR (COMPLETE SETUP) */}
      {/* ================================================================ */}
      <section className="-mt-8 sm:-mt-12 mb-6">
        <QuickServicesBar
          onSelectService={() => navigateTo('services')}
          onOpenBookingModal={onOpenBooking}
        />
      </section>

      {/* ================================================================ */}
      {/* 2B. SIGNATURE WHITE HOOKAH SHOWCASE (DEDICATED WHITE/PLATINUM SECTION) */}
      {/* ================================================================ */}
      <section className="mb-4">
        <WhiteHookahShowcase
          onOpenBooking={onOpenBooking}
        />
      </section>

      {/* ================================================================ */}
      {/* 2. CUSTOM CHILLUM & FLAVOUR BOOKING CONFIGURATOR (FROM SCREENSHOT) */}
      {/* Rates: Classic Clay ₹600 | Gold Silicon Cloud ₹700 | Base Yes/No  */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChillumFlavourBookingConfigurator
          onOpenBookingWithConfig={(cfg) => {
            if (onOpenBookingWithConfig) {
              onOpenBookingWithConfig(cfg);
            } else {
              onOpenBooking();
            }
          }}
        />
      </section>

      {/* ================================================================ */}
      {/* 3. OFFICIAL 1 TO 12 MASTER PRODUCT & SERVICE SEQUENCE */}
      {/* Line-by-line: Hookah, Base, Clay, Silicon, Flavours, Pipes, Coal, Box, Bag, VIP, Services */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MasterCatalogSequenceSection
          onOpenBooking={onOpenBooking}
          onOpenProductDetail={onOpenProductDetail}
        />
      </section>

      {/* ================================================================ */}
      {/* 4. RENT FOR TONIGHT: INSTANT OCCASION SELECTOR */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#111119] to-[#0a0a10] border border-neutral-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="h-[2px] w-5 bg-red-600"></span>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                  CHOOSE YOUR VIBE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                Rent For Tonight in 3 Clicks
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
              Select your party style below. Complete kit delivered with sanitized silicon hose, clay head, burner, tongs, and natural coconut coals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {occasions.map((occ, idx) => {
              const isSelected = selectedOccasion === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedOccasion(idx)}
                  className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-900/90 border-red-600 shadow-lg shadow-red-950/40 ring-1 ring-red-600/50'
                      : 'bg-black/40 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-950/80 border border-red-800/40 text-red-400">
                        {occ.badge}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {occ.idealFor}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading">
                      {occ.title}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {occ.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-400 tabular-nums">
                      {occ.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBooking();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-900/50'
                          : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                      }`}
                    >
                      Book This
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. DEDICATED PRISTINE WHITE HOOKAH SIGNATURE SHOWCASE */}
      {/* (SEPARATE FROM GOLDEN SERVICE BAR - PURE WHITE CERAMIC & GLASS) */}
      {/* ================================================================ */}
      <WhiteHookahShowcase onOpenBooking={onOpenBooking} />

      {/* ================================================================ */}
      {/* 6. VISUAL CATEGORY EXPLORATION TILES */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-[2px] w-5 bg-red-600"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                EXPLORE CATALOGUE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Hookahs, Flavours & Accessories
            </h2>
          </div>

          <button
            onClick={() => navigateTo('products')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-400 group cursor-pointer"
          >
            <span>View Complete Marketplace (40+ items)</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {PRODUCT_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('products', cat.id)}
              className="group relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950/70 hover:border-red-600/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-950/30 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>

              <div className="p-3 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors font-heading truncate">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-red-500 font-semibold flex items-center gap-1">
                  <span>Browse Items</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. TONIGHT'S SPOTLIGHT LUXURY HOOKAHS */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-[2px] w-5 bg-red-600"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                TOP RENTALS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Tonight's Spotlight Hookahs
            </h2>
          </div>

          <button
            onClick={() => navigateTo('products', 'hookah-bases')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-300 hover:text-white group cursor-pointer"
          >
            <span>See All Hookahs & Bases</span>
            <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {spotlightHookahs.map((product) => {
            const isAdded = addedProductId === product.id;
            return (
              <div
                key={product.id}
                className="group relative rounded-xl overflow-hidden border border-neutral-800/80 bg-[#0c0c12] hover:border-red-600/60 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={product.images?.[0] || '/src/assets/images/category_hookah_bases_1791648627967.jpg'}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {product.isBestSeller && (
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        Best Seller
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-neutral-700/60 text-amber-400 text-[10px] font-medium">
                      ★ {product.rating ?? 4.9}
                    </span>
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={() => onOpenProductDetail(product)}
                    className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-black/80 hover:bg-red-600 text-white backdrop-blur-sm border border-neutral-700 transition-colors"
                    title="Quick Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                      {product.brand || product.type}
                    </div>
                    <h3
                      onClick={() => onOpenProductDetail(product)}
                      className="text-base font-bold text-white group-hover:text-red-400 transition-colors cursor-pointer line-clamp-1 font-heading"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        Rental Rate
                      </div>
                      <div className="text-base font-extrabold text-white tabular-nums">
                        ₹{product.price ?? 599}{' '}
                        <span className="text-xs font-normal text-neutral-400">/ night</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                          isAdded
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
                        }`}
                        title="Add to Cart"
                      >
                        {isAdded ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={onOpenBooking}
                        className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-950/40 transition-colors"
                      >
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. NIGHTLIFE HOSPITALITY & EVENT CREW SHOWCASE */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-950/30 via-neutral-900/40 to-neutral-950 border border-neutral-800/80 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2">
                <span className="h-[2px] w-5 bg-red-600"></span>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                  TURNKEY EVENT HOSPITALITY
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                Flair Bartenders, Private Chefs & Shisha Masters
              </h2>

              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                Hosting a birthday, terrace celebration, bachelor party, or wedding cocktail in Kolkata? Don't lift a finger. Our trained crew manages everything from custom smoked cocktails and live barbecue kebabs to non-stop coal refills and bowl repacking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800/80 text-left">
                  <GlassWater className="w-5 h-5 text-amber-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">Flair Bartenders</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Smoked drinks & craft barware</div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800/80 text-left">
                  <Utensils className="w-5 h-5 text-red-500 mb-1.5" />
                  <div className="text-xs font-bold text-white">Private Cooks</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Live barbecue & finger snacks</div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800/80 text-left">
                  <Flame className="w-5 h-5 text-amber-400 mb-1.5" />
                  <div className="text-xs font-bold text-white">Shisha Sommelier</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Live coal & flavour refills</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-lg shadow-red-950/40"
                >
                  Book Event Crew
                </button>
                <button
                  onClick={() => navigateTo('services')}
                  className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-medium text-xs transition-all"
                >
                  View Services Breakdown
                </button>
              </div>
            </div>

            {/* Visual preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[4/3]">
                <img
                  src="/src/assets/images/quote_cocktail_drink_1791648736985.jpg"
                  alt="Bartender Smoked Cocktail at Kolkata Event"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="text-xs font-bold text-white">Bespoke Cocktail & Shisha Pairings</div>
                  <div className="text-[11px] text-neutral-300">Park Street · Alipore · Salt Lake · New Town</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. THE SHISHA RENT DISTINCTION (WHY DISCERNING HOSTS CHOOSE US) */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-[2px] w-6 bg-red-600"></span>
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-red-500">
              OUR STANDARDS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            The Shisha Rent <span className="text-red-600">Distinction</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Why Kolkata's top lounges, event planners, and party hosts choose our service over unorganized local setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-xl bg-neutral-950/80 border border-neutral-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              100% Sanitized &amp; Sealed Gear
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every shisha stem, glass vase, and silicon hose is thoroughly washed, sanitized, and inspected before delivery. All mouthpieces are 100% factory-sealed and single-use for your peace of mind.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-950/80 border border-neutral-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-500">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              100% Organic Coconut Charcoal
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Zero chemical smell, zero sulfur, and zero headaches. We exclusively provide compressed coconut shell briquettes that burn ultra-clean at consistent temperatures for 90+ minutes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-950/80 border border-neutral-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-500">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              60-Min Express Kolkata Dispatch
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Discreet, punctual doorstep delivery with rapid setup and test draw. Once your party ends, our team collects everything the next morning—zero cleaning required on your part.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. HOW IT WORKS: 4 SIMPLE STEPS */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b0b12] border border-neutral-800/90 rounded-2xl p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
              EFFORTLESS BOOKING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="text-left space-y-2">
              <div className="text-3xl font-extrabold text-red-600/80 font-heading">01</div>
              <h4 className="text-sm font-bold text-white">Select Your Shisha & Flavours</h4>
              <p className="text-xs text-neutral-400">
                Choose your favourite German/Russian base, bowl type, and imported flavour blends.
              </p>
            </div>

            <div className="text-left space-y-2">
              <div className="text-3xl font-extrabold text-amber-500/80 font-heading">02</div>
              <h4 className="text-sm font-bold text-white">Pick Date & Time Slot</h4>
              <p className="text-xs text-neutral-400">
                Specify your Kolkata address, preferred evening delivery window, and rental duration.
              </p>
            </div>

            <div className="text-left space-y-2">
              <div className="text-3xl font-extrabold text-red-600/80 font-heading">03</div>
              <h4 className="text-sm font-bold text-white">Confirm via COD or UPI</h4>
              <p className="text-xs text-neutral-400">
                Scan our official UPI QR code or choose Cash on Delivery at your doorstep.
              </p>
            </div>

            <div className="text-left space-y-2">
              <div className="text-3xl font-extrabold text-amber-500/80 font-heading">04</div>
              <h4 className="text-sm font-bold text-white">Enjoy & Hassle-Free Pickup</h4>
              <p className="text-xs text-neutral-400">
                Our concierge delivers ready-to-smoke hardware and picks it up the following day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. VERIFIED TESTIMONIALS */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
            CLIENT EXPERIENCES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Trusted by Kolkata's Best Hosts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 text-left space-y-3">
            <div className="flex items-center text-amber-400 text-xs">
              ★★★★★
            </div>
            <p className="text-xs text-neutral-300 italic leading-relaxed">
              "Ordered two hookahs with coconut coals for a terrace party in Ballygunge. Arrived punctually in sealed cases with fresh mouthpieces. The Russian base pull was ultra-smooth."
            </p>
            <div className="pt-2 border-t border-neutral-900 text-left">
              <div className="text-xs font-bold text-white">Rohan Sengupta</div>
              <div className="text-[11px] text-neutral-500">Ballygunge · Weekend Host</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 text-left space-y-3">
            <div className="flex items-center text-amber-400 text-xs">
              ★★★★★
            </div>
            <p className="text-xs text-neutral-300 italic leading-relaxed">
              "We booked their bartender service plus three hookahs for my brother's bachelor party in New Town. The smoked cocktails and continuous coal maintenance were outstanding."
            </p>
            <div className="pt-2 border-t border-neutral-900 text-left">
              <div className="text-xs font-bold text-white">Ananya Mukherjee</div>
              <div className="text-[11px] text-neutral-500">New Town · Event Organizer</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 text-left space-y-3">
            <div className="flex items-center text-amber-400 text-xs">
              ★★★★★
            </div>
            <p className="text-xs text-neutral-300 italic leading-relaxed">
              "Late night delivery at 1 AM in Park Street within 50 minutes. Excellent hygiene, electric burner included, and zero hassle with next-day pickup. 10/10 service."
            </p>
            <div className="pt-2 border-t border-neutral-900 text-left">
              <div className="text-xs font-bold text-white">Kabir Agarwal</div>
              <div className="text-[11px] text-neutral-500">Park Street · Private Party</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. OFFICIAL UPI QR CODE SCANNER & INSTANT PAYMENT */}
      {/* ================================================================ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-[2px] w-6 bg-amber-500"></span>
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400">
              OFFICIAL PAYMENT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Official <span className="text-amber-400">UPI QR Scanner</span> &amp; Priority Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Scan with any UPI App (GPay, PhonePe, Paytm, BHIM) for instant booking verification and priority late-night delivery.
          </p>
        </div>

        <UpiQrShowcase paymentConfig={paymentConfig || null} />
      </section>

      {/* ================================================================ */}
      {/* 10. VIP WEEKEND BOOKING CTA */}
      {/* ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-red-900/50 bg-gradient-to-r from-red-950 via-neutral-950 to-black p-8 sm:p-12 text-center space-y-5 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Ready to Plan Your Night?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300">
              Weekend slots fill up quickly across South Kolkata, Salt Lake, and New Town. Book online now or message our WhatsApp concierge for immediate dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenBooking}
              className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-950/60 transition-all active:scale-95"
            >
              Book Shisha Setup Now
            </button>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 font-semibold text-sm transition-all"
            >
              Chat on WhatsApp ({contactConfig.whatsappNumber || contactConfig.phone})
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
