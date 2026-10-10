import React from 'react';
import { Crown, ShieldCheck, UserCheck, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface WhyChooseUsProps {
  onOpenBooking: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenBooking }) => {
  return (
    <section id="why-us" className="py-16 sm:py-20 bg-[#070709] border-t border-neutral-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-8">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1.5">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>WHY CHOOSE US</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            Your Perfect Hookah Experience{' '}
            <span className="text-red-600">Partner</span>
          </h2>
        </div>

        {/* 4 Pillars + Custom Quote Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 4 Pillars Grid (col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            
            {/* 1. Premium Quality */}
            <div className="p-4 sm:p-5 rounded-xl border border-neutral-800/80 bg-neutral-950/60 hover:border-red-900/60 transition-colors flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Premium Quality</h3>
                <p className="text-[11px] text-amber-400 font-medium">Original Brands</p>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Authentic global flavours and sanitized Bohemian glassware with zero harshness.
                </p>
              </div>
            </div>

            {/* 2. Professional Staff */}
            <div className="p-4 sm:p-5 rounded-xl border border-neutral-800/80 bg-neutral-950/60 hover:border-amber-900/60 transition-colors flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Professional Staff</h3>
                <p className="text-[11px] text-amber-400 font-medium">Trained & Experienced</p>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Trained shisha tenders, flair mixologists, and private event chefs.
                </p>
              </div>
            </div>

            {/* 3. On-Time Delivery */}
            <div className="p-4 sm:p-5 rounded-xl border border-neutral-800/80 bg-neutral-950/60 hover:border-red-900/60 transition-colors flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">On-Time Delivery</h3>
                <p className="text-[11px] text-amber-400 font-medium">Safe & Secure</p>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Punctual doorstep dispatch across all Kolkata hubs with full burner guidance.
                </p>
              </div>
            </div>

            {/* 4. Custom Packages */}
            <div className="p-4 sm:p-5 rounded-xl border border-neutral-800/80 bg-neutral-950/60 hover:border-amber-900/60 transition-colors flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Custom Packages</h3>
                <p className="text-[11px] text-amber-400 font-medium">For Every Occasion</p>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Bespoke setups from intimate terrace chill sessions to 25+ pot luxury weddings.
                </p>
              </div>
            </div>

          </div>

          {/* Right Callout Banner */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl overflow-hidden border border-red-900/60 bg-gradient-to-r from-black via-neutral-950 to-neutral-900 p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-5 text-left">
              
              {/* Luxury Drink Photo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-neutral-700/80 shadow-md">
                <img
                  src="/src/assets/images/quote_cocktail_drink_1791648736985.jpg"
                  alt="Craft Cocktail Lounge"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text & CTA */}
              <div className="space-y-1.5 flex-1">
                <div className="text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase">
                  BOOKING MADE EASY
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                  Get Your Custom Quote
                </h3>
                <p className="text-xs text-neutral-400">
                  Select your flavours, hardware, and staff add-ons. Instant confirmation with COD or Online QR.
                </p>

                <div className="pt-2">
                  <button
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-900/40 transition-all cursor-pointer active:scale-95 group"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
