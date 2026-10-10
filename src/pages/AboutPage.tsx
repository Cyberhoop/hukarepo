import React from 'react';
import {
  ShieldCheck,
  Crown,
  Sparkles,
  Truck,
  Flame,
  CheckCircle2,
  Calendar,
  MessageCircle,
  MapPin,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { CONTACT_INFO } from '../data/productsData';

interface AboutPageProps {
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking }) => {
  const { navigateTo } = useNavigation();

  return (
    <div className="py-6 sm:py-10 space-y-14">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-red-400 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-white font-medium">About Us</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-900">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-[2px] w-5 bg-red-600"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                OUR STORY & CRAFTSMANSHIP
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              About Shisha Rent Kolkata
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
            Pioneering hygienic, luxury hookah rentals and bespoke event hospitality across the City of Joy.
          </p>
        </div>
      </div>

      {/* Brand Mission & Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
              Redefining the Kolkata Hookah Experience
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              For years, renting a hookah in Kolkata meant dealing with unreliable local shops, rusty unbranded hardware, chemical quick-lighting coals, and uncertain hygiene.
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              <strong className="text-white">Shisha Rent Kolkata</strong> was established with one uncompromising mission: to bring world-class lounge luxury, medical-grade hygiene, and turnkey event hospitality directly to your living room, terrace, or wedding lawn.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              From handpicked Russian stems and German crystal glassware to pure coconut coals and certified flair mixologists, every detail of our service is curated for unforgettable evenings.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-red-500 font-heading">
                  1,500+
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">Parties Catered</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-heading">
                  15+
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">Flavour Brands</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  60 Mins
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">Average Kolkata ETA</div>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[4/3]">
              <img
                src="/src/assets/images/hero_luxury_hookah_1791648599431.jpg"
                alt="Shisha Rent Kolkata Craftsmanship"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="text-xs font-bold text-white">Imported Hardware & Sealed Packaging</div>
                <div className="text-[11px] text-neutral-300">Sanitized after every single booking</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Standard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8 space-y-1">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
            OUR COMMITMENTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            The 4 Standards We Live By
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-xl bg-[#0b0b12] border border-neutral-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              1. Medical-Grade Hygiene
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Stems and glass vases undergo ultrasonic cleaning after every return. Hoses are medical-grade washable silicone, and every booking includes sealed, single-use mouthpieces.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0b0b12] border border-neutral-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-500">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              2. 100% Coconut Charcoal
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We never use harmful chemical ignition discs. Our premium coconut briquettes provide pure, odorless heat that lasts 90+ minutes without headaches or burning the flavour.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0b0b12] border border-neutral-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-500">
              <Crown className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              3. Authentic Luxury Hardware
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We invest in authentic brands: Maya Designer, Coco Aaya, Alpha Hookah, and Amy Deluxe. Heavy glass bases with wide diffusers for whisper-quiet, dense clouds.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0b0b12] border border-neutral-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-500">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              4. Discreet Doorstep Logistics
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Delivered in unbranded, cushioned travel bags. Our delivery executives provide full setup and lighting assistance, and collect the hardware next morning with zero cleaning by you.
            </p>
          </div>
        </div>
      </div>

      {/* Kolkata Coverage & Legal Verification */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-800 bg-[#0c0c14] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Kolkata Delivery Reach</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Delivering Across the Entire Metropolis
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Our central and suburban dispatch hubs cover:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
              <div>· South Kolkata (Alipore, Ballygunge)</div>
              <div>· Central (Park Street, Camac St)</div>
              <div>· East Kolkata (Salt Lake, New Town)</div>
              <div>· EM Bypass & Ruby Corridor</div>
              <div>· North Kolkata (Shyambazar, Dum Dum)</div>
              <div>· Howrah & Shibpur Riverfront</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" />
              <span>Age Verification & Compliance</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Responsible Enjoyment (21+)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              In accordance with regulations, our services are strictly reserved for adults aged 21 years or older. A valid government photo ID (Aadhaar, Driving License, or Passport) must be shown upon delivery.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We also offer 100% tobacco-free and nicotine-free herbal flavours (Afzal Herbal, Soex) for health-conscious gatherings.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <button
          onClick={onOpenBooking}
          className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-950/60 transition-all"
        >
          Book Your Experience Now
        </button>
      </div>
    </div>
  );
};
