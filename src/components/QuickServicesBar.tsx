import React from 'react';
import { Flame, Utensils, GlassWater, Sparkles, Truck, ShieldCheck } from 'lucide-react';

interface QuickServicesBarProps {
  onSelectService?: (serviceName: string) => void;
}

export const QuickServicesBar: React.FC<QuickServicesBarProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'hookah-rental',
      name: 'Hookah Rental',
      tagline: 'Premium collection',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
          <path d="M12 2a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2.18c2.28.46 4 2.47 4 4.82v1a4 4 0 0 1-2.5 3.7V20a2 2 0 1 1-4 0v-1.3A4 4 0 0 1 8 15v-1c0-2.35 1.72-4.36 4-4.82V7H10a1 1 0 0 1 0-2h2V3a1 1 0 0 1 1-1z"/>
        </svg>
      ),
    },
    {
      id: 'flavours',
      name: 'Flavours',
      tagline: 'Top brands & varieties',
      icon: <Flame className="w-6 h-6 text-white" />,
    },
    {
      id: 'bartender',
      name: 'Bartender Services',
      tagline: 'Skilled & professional',
      icon: <GlassWater className="w-6 h-6 text-white" />,
    },
    {
      id: 'cook',
      name: 'Cook Services',
      tagline: 'Multi-cuisine experts',
      icon: <Utensils className="w-6 h-6 text-white" />,
    },
    {
      id: 'party-event',
      name: 'Party & Event',
      tagline: 'Make it unforgettable',
      icon: <Sparkles className="w-6 h-6 text-white" />,
    },
    {
      id: 'delivery',
      name: 'Home Delivery',
      tagline: 'Fast & reliable',
      icon: <Truck className="w-6 h-6 text-white" />,
    },
    {
      id: 'pickup',
      name: 'Pickup Service',
      tagline: 'Convenient & easy',
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <div className="relative z-20 -mt-2 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-red-950/60 bg-gradient-to-r from-[#0d0d14] via-[#101018] to-[#0d0d14] p-2.5 sm:p-4 shadow-xl shadow-black/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800/80">
          {services.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectService && onSelectService(item.name)}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-900/60 transition-colors group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-red-600/70 group-hover:bg-red-950/20 transition-all">
                {item.icon}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                  {item.name}
                </div>
                <div className="text-[11px] text-neutral-400 truncate">
                  {item.tagline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
