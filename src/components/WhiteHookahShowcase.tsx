import React from 'react';
import { Calendar, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useContact } from '../context/ContactContext';

interface WhiteHookahShowcaseProps {
  onOpenBooking: () => void;
}

export const WhiteHookahShowcase: React.FC<WhiteHookahShowcaseProps> = ({ onOpenBooking }) => {
  const { navigateTo } = useNavigation();
  const { getWhatsAppLink } = useContact();

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean Minimalist Luxury Container */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-700/60 bg-gradient-to-br from-[#0f131c] via-[#090b10] to-[#06070a] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Ambient Silver Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: Dedicated Clean White Hookah Photography without Clutter */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-neutral-900 shadow-xl group aspect-[16/10] sm:aspect-[4/3]">
              <img
                src="/src/assets/images/luxury_white_hookah_hero_1792919777843.jpg"
                alt="White Ceramic and Crystal Glass Shisha Setup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Minimal Clean Caption */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                <p className="text-white font-semibold text-sm drop-shadow-md">
                  White Ceramic &amp; Crystal Glass Shisha
                </p>
                <p className="text-neutral-300 text-xs mt-0.5">
                  Complete setup delivered with premium coconut coals &amp; flavours
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Customer-Friendly Copy */}
          <div className="lg:col-span-6 space-y-5 text-left order-1 lg:order-2">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-300 mb-1.5">
                Exclusive Collection
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight font-heading">
                Pure White Ceramic &amp; Crystal Glass
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Designed for terrace gatherings, birthdays, and private parties. Enjoy an effortless, whisper-quiet pull with freshly packed natural chillum and imported flavours.
            </p>

            {/* 4 Clean Lifestyle Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { title: 'Crystal-Clear Glass', desc: 'Elegant aesthetic for modern parties' },
                { title: 'Ultra-Smooth Pull', desc: 'Silent diffuser with rich smoke clouds' },
                { title: 'Sealed & Sanitized', desc: 'Fresh mouthpieces & clean hardware' },
                { title: '60-Min Fast Delivery', desc: 'Doorstep setup across Kolkata' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-left"
                >
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-white/10 transition-all active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Setup</span>
              </button>

              <a
                href={getWhatsAppLink('Hi! I want to book the White Ceramic & Crystal Glass Shisha setup for tonight.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Instant WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => navigateTo('products')}
                className="px-4 py-3 text-neutral-400 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer group"
              >
                <span>View All Hookahs</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
