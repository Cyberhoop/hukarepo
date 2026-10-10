import React from 'react';
import { GlassWater, Utensils, Sparkles, Truck, ShieldCheck, Check, Calendar } from 'lucide-react';

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const serviceCards = [
    {
      id: 'hookah-rental',
      title: 'Hookah Rental & Setup',
      subtitle: 'VIP Glassware & Premium Coals',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-red-500">
          <path d="M12 2a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2.18c2.28.46 4 2.47 4 4.82v1a4 4 0 0 1-2.5 3.7V20a2 2 0 1 1-4 0v-1.3A4 4 0 0 1 8 15v-1c0-2.35 1.72-4.36 4-4.82V7H10a1 1 0 0 1 0-2h2V3a1 1 0 0 1 1-1z"/>
        </svg>
      ),
      description: 'Maya, Coco Aaya & SR designer hookahs with clay chilams and coconut coals.',
      features: ['15+ authentic flavour brands', 'Free electric burner & safety tongs'],
      tag: 'Core Service',
    },
    {
      id: 'bartender',
      title: 'Bartender & Mixologist',
      subtitle: 'Smoked Cocktails & Mocktails',
      icon: <GlassWater className="w-5 h-5 text-amber-400" />,
      description: 'Certified flair bartenders creating bespoke smoked cocktail experiences.',
      features: ['Signature cocktail menus', 'Complete barware & station setup'],
      tag: 'Popular Add-on',
    },
    {
      id: 'cooks',
      title: 'Private Chef & Cooks',
      subtitle: 'Live Barbecue & Party Snacks',
      icon: <Utensils className="w-5 h-5 text-red-500" />,
      description: 'Charcoal kebabs, Mughlai platters, and gourmet party finger foods.',
      features: ['Live tandoor & grill stations', 'Hygiene-certified chefs'],
      tag: 'Gourmet',
    },
    {
      id: 'events',
      title: 'Weddings & VIP Parties',
      subtitle: 'Full-Scale Shisha Lounge Setup',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      description: 'Complete multi-pot shisha lounge catering for celebrations and galas.',
      features: ['Dedicated shisha sommeliers', 'Continuous bowl refills & coals'],
      tag: 'Turnkey',
    },
    {
      id: 'delivery',
      title: 'Doorstep 24/7 Delivery',
      subtitle: 'Across All Kolkata Hubs',
      icon: <Truck className="w-5 h-5 text-red-500" />,
      description: 'Punctual dispatch to apartments, villas, and terraces with test-draw setup.',
      features: ['Quick 45–60 min dispatch', 'Discreet & secure packaging'],
      tag: 'Express',
    },
    {
      id: 'pickup',
      title: 'Hassle-Free Pickup',
      subtitle: 'Zero Cleaning Required',
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      description: 'We pack and collect all hardware next day. No cleaning required by you.',
      features: ['Flexible pickup schedules', 'Instant deposit settlement'],
      tag: 'Effortless',
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-[#070709] border-t border-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-[2px] w-6 bg-red-600"></span>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-red-500">
              EXPERIENCES
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            Hospitality & <span className="text-red-600">Event Services</span>
          </h2>

          <p className="text-neutral-400 text-sm">
            Everything you need for an unforgettable shisha lounge vibe at your venue.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {serviceCards.map((service) => (
            <div
              key={service.id}
              className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/90 hover:border-red-600/50 transition-all duration-300 flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors font-heading">
                  {service.title}
                </h3>
                <p className="text-[11px] text-amber-400 font-medium">
                  {service.subtitle}
                </p>

                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-neutral-900 pt-3">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-900">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-red-600 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Service</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
