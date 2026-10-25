import React, { useState } from 'react';
import {
  Flame,
  Utensils,
  GlassWater,
  Sparkles,
  Truck,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Crown,
  ChevronRight,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface QuickServicesBarProps {
  onSelectService?: (serviceName: string) => void;
  onOpenBookingModal?: () => void;
}

export const QuickServicesBar: React.FC<QuickServicesBarProps> = ({
  onSelectService,
  onOpenBookingModal,
}) => {
  const [activeServiceId, setActiveServiceId] = useState<string>('hookah-rental');

  const services = [
    {
      id: 'hookah-rental',
      name: 'Hookah Rental',
      tagline: 'Russian & German bases',
      badge: 'Core Service',
      rate: 'From ₹599 / night',
      details: 'Sparkling clean glassware, clay chillum, electric burner, tongs & 1kg coconut coals.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-amber-400">
          <path d="M12 2a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2.18c2.28.46 4 2.47 4 4.82v1a4 4 0 0 1-2.5 3.7V20a2 2 0 1 1-4 0v-1.3A4 4 0 0 1 8 15v-1c0-2.35 1.72-4.36 4-4.82V7H10a1 1 0 0 1 0-2h2V3a1 1 0 0 1 1-1z" />
        </svg>
      ),
    },
    {
      id: 'flavours',
      name: 'Flavours & Chillums',
      tagline: '15+ Top brands & varieties',
      badge: 'Bestseller',
      rate: '₹600 clay / ₹700 silicon',
      details: 'Al Fakher, Afzal Kolkata Meetha Paan, Adalya & Starbuzz pre-packed ready to pull.',
      icon: <Flame className="w-5 h-5 text-red-500" />,
    },
    {
      id: 'bartender',
      name: 'Bartender Services',
      tagline: 'Skilled flair mixologists',
      badge: 'VIP Party',
      rate: 'Custom Mixology Bar',
      details: 'Certified cocktail masters crafting smoked drinks, mocktails & custom bar experiences.',
      icon: <GlassWater className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'cook',
      name: 'Cook Services',
      tagline: 'Live barbecue & tandoor',
      badge: 'Gourmet',
      rate: 'Party platters & snacks',
      details: 'Charcoal grilled kebabs, Mughlai platters & hot party finger food for your guests.',
      icon: <Utensils className="w-5 h-5 text-red-500" />,
    },
    {
      id: 'party-event',
      name: 'Party & Event Lounge',
      tagline: 'Turnkey shisha bars',
      badge: 'Weddings',
      rate: 'Multi-pot lounge setup',
      details: 'Continuous coal rotation attendants, fresh bowl repacking, and luxury decor.',
      icon: <Sparkles className="w-5 h-5 text-amber-300" />,
    },
    {
      id: 'delivery',
      name: 'Home Delivery',
      tagline: '45–60 min express dispatch',
      badge: 'Fast Dispatch',
      rate: 'Across all Kolkata hubs',
      details: 'Punctual arrival to apartments, penthouses, and terraces with test-draw setup.',
      icon: <Truck className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'pickup',
      name: 'Pickup Service',
      tagline: 'Zero cleaning required',
      badge: 'Hassle-Free',
      rate: 'Next-day collection',
      details: 'We pack and collect all hardware the following morning. Zero effort for host.',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
    },
  ];

  const activeItem = services.find((s) => s.id === activeServiceId) || services[0];

  const handleCardClick = (item: typeof services[0]) => {
    setActiveServiceId(item.id);
    if (onSelectService) {
      onSelectService(item.name);
    }
  };

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Golden Luxury Container Box */}
      <div className="rounded-2xl sm:rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-[#1c1407] via-[#140e05] to-[#0c0803] p-4 sm:p-7 shadow-2xl shadow-amber-950/40 relative overflow-hidden">
        
        {/* Ambient Golden Glow in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Strip with Service Bar Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Royal Golden Collection
                </span>
                <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                  Complete Kolkata Hospitality Setup
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold font-heading text-white mt-0.5">
                Official Shisha Rent <span className="text-amber-400">Service Bar</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-xs font-semibold text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Daily: 11 AM – 3 AM</span>
            </span>

            {onOpenBookingModal && (
              <button
                type="button"
                onClick={onOpenBookingModal}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/30 transition-all cursor-pointer whitespace-nowrap"
              >
                Book Service
              </button>
            )}
          </div>
        </div>

        {/* Main Service Bar Showcase: Left Interactive Grid + Right Golden Bar Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 items-stretch">
          
          {/* Left Grid: 7 Service Tabs */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {services.map((item) => {
                const isSelected = item.id === activeServiceId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCardClick(item)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-950/60 ring-1 ring-amber-400/50'
                        : 'bg-black/50 border-neutral-800 hover:border-amber-500/40 hover:bg-black/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-amber-500 text-neutral-950'
                              : 'bg-neutral-900 border border-neutral-800 group-hover:border-amber-500/50'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'bg-neutral-900 text-neutral-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1 font-heading">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {item.tagline}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-amber-400/90 truncate">
                        {item.rate}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'text-amber-400 translate-x-0.5' : 'text-neutral-500'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Service Expanded Details Card */}
            <div className="p-4 rounded-xl bg-black/75 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Selected Service: {activeItem.name}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">({activeItem.rate})</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
                  {activeItem.details}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onOpenBookingModal && (
                  <button
                    type="button"
                    onClick={onOpenBookingModal}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950/60 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book {activeItem.name}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: DEDICATED Golden Colour Service Bar Image */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-black shadow-xl group h-full flex flex-col justify-end min-h-[220px]">
              <img
                src="/src/assets/images/service_golden_bar_catering_1792919778409.jpg"
                alt="Royal Golden Cocktail Bar & VIP Event Shisha Service Station"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

              {/* Top Floating Golden Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-400/50 text-[10px] font-bold text-amber-300 flex items-center gap-1 shadow-lg">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Golden VIP Service</span>
                </span>
              </div>

              {/* Bottom Card Copy */}
              <div className="relative z-10 p-4 text-left space-y-1.5">
                <div className="text-sm sm:text-base font-bold text-white font-heading">
                  Kolkata Event Mixology & Shisha Bar
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Turnkey cocktail barware, ice dry smoke effects & luxury hookah sommeliers for weddings, bachelors & penthouse parties.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-300 border-t border-white/10">
                  <span className="text-amber-400 font-semibold">Park Street · Salt Lake · Alipore</span>
                  {onOpenBookingModal && (
                    <button
                      type="button"
                      onClick={onOpenBookingModal}
                      className="text-white hover:text-amber-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Inquire Now</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
