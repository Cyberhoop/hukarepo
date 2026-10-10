import React from 'react';
import {
  GlassWater,
  Utensils,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Flame,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { CONTACT_INFO } from '../data/productsData';

interface ServicesPageProps {
  onOpenBooking: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenBooking }) => {
  const { navigateTo } = useNavigation();

  const servicesList = [
    {
      id: 'hookah-rental',
      title: 'Hookah Rental Packages',
      tagline: 'German & Russian Hardware · Organic Coconut Coals',
      price: 'Starting at ₹999 / Night',
      badge: 'Core Service',
      description:
        'Complete shisha experience delivered in sanitized hard cases. Includes imported stem, Bohemian glass base, clay chilam, heat management device (HMD), silicone hose, electric coal burner, safety tongs, and 1kg coconut coals.',
      includes: [
        'Choice of 15+ authentic flavour tins (Al Fakher, Starbuzz, Afzal, SR Special)',
        '100% natural, odorless coconut shell briquettes (burns 90+ mins)',
        'Individually sealed, autoclaved disposable mouth tips',
        'High-wattage electric burner for rapid 3-min coal ignition',
        'Next-day doorstep collection — zero cleaning required by customer',
      ],
      action: 'Book Hookah Package',
    },
    {
      id: 'bartender',
      title: 'Professional Flair Bartender & Mixologist',
      tagline: 'Smoked Cocktails · Craft Syrups · Premium Barware',
      price: 'Starting at ₹2,499 / Event',
      badge: 'Party Favorite',
      description:
        'Elevate your house party, terrace gathering, or bachelor night with certified hospitality bartenders. Specializing in smoked cocktail theatrics, artisanal mocktails, and rapid beverage service.',
      includes: [
        'Complete professional barware kit (shakers, strainers, jiggers, muddlers)',
        'Custom themed cocktail and mocktail menu design',
        'Glass smoking apparatus and aromatic wood chips',
        'Professional flair tricks and guest interaction',
        'Clean bar station maintenance throughout the event',
      ],
      action: 'Book Bartender Service',
    },
    {
      id: 'cooks',
      title: 'Private Event Cooks & Chefs',
      tagline: 'Live Tandoor · Charcoal Kebabs · Gourmet Finger Foods',
      price: 'Starting at ₹2,999 / Event',
      badge: 'Gourmet Catering',
      description:
        'Experienced party cooks serving sizzling appetizers directly from live charcoal grills and tandoor setups at your private residence, lawn, or farmhouse.',
      includes: [
        'Live charcoal barbecue kebabs (Paneer Tikka, Chicken Reshmi, Seekh, Fish Tikka)',
        'Gourmet finger food platters and late night party sliders',
        'Hygiene-certified cooks wearing chef uniform and gloves',
        'Ingredient preparation and plating assistance',
        'Full post-event kitchen counter cleanup',
      ],
      action: 'Book Chef & Cook Service',
    },
    {
      id: 'sommelier',
      title: 'Shisha Master / Sommelier at Venue',
      tagline: 'Dedicated Bowl Repacking & Continuous Coal Rotation',
      price: 'Starting at ₹1,499 / Event',
      badge: 'Zero Host Stress',
      description:
        'A dedicated shisha technician stays at your venue for the duration of your party. Never touch hot coals or struggle with flavour burning—enjoy uninterrupted dense smoke all night.',
      includes: [
        'Live coal monitoring and rotation every 20 minutes',
        'Flavor repacking and bowl replenishment upon request',
        'Heat management device tuning for zero harsh smoke',
        'Fire-safe ember disposal and continuous floor safety',
        'Dedicated 4 to 6 hours on-site attendance',
      ],
      action: 'Book Shisha Master',
    },
    {
      id: 'wedding-lounge',
      title: 'Wedding & Sangeet VIP Shisha Lounge',
      tagline: 'Turnkey Multi-Hookah Setup · Ambient Lighting & Decor',
      price: 'Custom Luxury Quote',
      badge: 'Turnkey Hospitality',
      description:
        'Complete Arabian and modern lounge installations for weddings, cocktail receptions, and corporate galas across Kolkata. We furnish 5 to 20+ hookahs with full-time crew and ambient floor cushions.',
      includes: [
        '5 to 20+ matching luxury crystal hookahs with color-coordinated LED bases',
        'Lounge decor styling: velvet cushions, low tables, and warm brass accents',
        'Team of 2 to 4 uniformed shisha sommeliers',
        'Custom engraved tobacco-free flavour menus for guests',
        'Full coordination with your wedding planner or venue manager',
      ],
      action: 'Request Wedding Quote',
    },
    {
      id: 'express-delivery',
      title: '24/7 Kolkata Express Delivery & Pickup',
      tagline: 'Park Street · Salt Lake · Alipore · New Town · Ballygunge',
      price: 'Included in Rental',
      badge: 'Punctual Dispatch',
      description:
        'Fast 45 to 60 minute dispatch across all major Kolkata residential hubs. Delivery agents set up the hardware, perform an initial test draw, and answer any questions before handing over.',
      includes: [
        'Punctual arrival with GPS tracking and live phone coordination',
        'Safe shock-proof transit bags preventing glass damage',
        'Pre-assembled stems and water-level calibration',
        'Flexible collection times next morning or afternoon',
        'Instant security deposit settlement upon equipment verification',
      ],
      action: 'Check Delivery ETA',
    },
  ];

  return (
    <div className="py-6 sm:py-10 space-y-12">
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
          <span className="text-white font-medium">Services & Hospitality</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-900">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-[2px] w-5 bg-red-600"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                COMPLETE EVENT HOSPITALITY
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Services & Nightlife Catering
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
            From single-night shisha rentals in South Kolkata to full-scale wedding cocktail lounges in New Town with trained mixologists and chefs.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#0b0b12] border border-neutral-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-red-600/60 transition-all duration-300 shadow-xl group text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-red-950/80 border border-red-800/40 text-red-400 uppercase tracking-wider">
                    {srv.badge}
                  </span>
                  <span className="text-xs font-bold text-amber-400 tabular-nums">
                    {srv.price}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors font-heading">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-medium">
                    {srv.tagline}
                  </p>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {srv.description}
                </p>

                <div className="pt-3 border-t border-neutral-900 space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    What's Included:
                  </div>
                  <ul className="space-y-1.5">
                    {srv.includes.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{srv.action}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Quote Promo Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold text-white font-heading">
              Need a Custom Event Package?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Planning a larger gathering or need customized flavour menus, bartender setups, and private cooks together? Contact our event desk directly for preferential rates and personalized coordination.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-950/50 transition-colors"
            >
              Submit Custom Request
            </button>
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-emerald-400 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
