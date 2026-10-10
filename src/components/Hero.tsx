import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Crown, Truck, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenProducts }) => {
  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-14 lg:py-20 bg-gradient-to-b from-[#070709] via-[#0b0b12] to-[#070709]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Top kicker */}
            <div className="inline-flex items-center gap-2">
              <span className="h-[2px] w-6 bg-red-600"></span>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase text-neutral-300">
                PREMIUM HOOKAH RENTAL & EVENT SERVICES
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-heading">
              Elevate Your Moments With{' '}
              <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.35)]">
                Shisha Rent
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
              Premium Hookah Rentals, Exotic Flavours, Professional Bartenders, Cooks & Event Services – For Every Occasion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold shadow-xl shadow-red-900/40 hover:shadow-red-600/50 transition-all active:scale-95 cursor-pointer text-base"
              >
                <Calendar className="w-5 h-5 text-white/90" />
                <span>Book Now</span>
              </button>

              <button
                onClick={onOpenProducts}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-500 text-neutral-100 font-medium transition-all active:scale-95 cursor-pointer text-base group"
              >
                <span>View Our Products</span>
                <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 4 Trust Badges in exact layout from poster */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-red-900/40 flex items-center justify-center text-red-500 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Premium</div>
                  <div className="text-[11px] text-neutral-400">Quality</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-amber-900/40 flex items-center justify-center text-amber-500 shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Professional</div>
                  <div className="text-[11px] text-neutral-400">Staff</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-red-900/40 flex items-center justify-center text-red-500 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Home</div>
                  <div className="text-[11px] text-neutral-400">Delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-amber-900/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Events</div>
                  <div className="text-[11px] text-neutral-400">& Parties</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Glow & Good Vibes Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 shadow-2xl shadow-black/80 group">
              
              {/* Main Luxury Hookah Photography */}
              <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden">
                <img
                  src="/src/assets/images/hero_luxury_hookah_1791648599431.jpg"
                  alt="Luxury Hookah Lounge Setup with Red and Gold Ambience"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />

                {/* Subtle vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                {/* Good Vibes Only Neon Script (matching the poster) */}
                <div className="absolute top-6 right-6 pointer-events-none text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-400 text-xs font-serif italic mb-0.5">
                    <Crown className="w-4 h-4 text-amber-400 inline" />
                  </div>
                  <span className="font-serif italic font-bold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 drop-shadow-[0_2px_12px_rgba(220,38,38,0.8)] tracking-wide">
                    Good Vibes
                  </span>
                  <div className="font-serif italic text-2xl sm:text-3xl text-neutral-100 tracking-wider">
                    Only
                  </div>
                </div>

                {/* Carousel Navigation Simulation */}
                <button
                  type="button"
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Carousel Pagination Dots */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400/60"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400/60"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400/60"></span>
                </div>

                {/* Bottom Left Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-neutral-700/60 text-xs text-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Available for Instant Booking in Kolkata</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
