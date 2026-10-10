import React from 'react';
import { Sparkles, Calendar, Truck, PartyPopper } from 'lucide-react';

interface HowBookingWorksProps {
  onOpenBooking: () => void;
}

export const HowBookingWorks: React.FC<HowBookingWorksProps> = ({ onOpenBooking }) => {
  const steps = [
    {
      number: '01',
      title: 'Pick Blends & Pots',
      description: 'Choose your preferred flavour brand, hookah model, and accessories.',
      icon: <Sparkles className="w-5 h-5 text-red-500" />,
    },
    {
      number: '02',
      title: 'Set Date & Staff',
      description: 'Select your party date, Kolkata location, and optional bartenders or chefs.',
      icon: <Calendar className="w-5 h-5 text-amber-400" />,
    },
    {
      number: '03',
      title: 'Fast Confirmation',
      description: 'Instant quote confirmation with Cash on Delivery or Online UPI QR.',
      icon: <Truck className="w-5 h-5 text-red-500" />,
    },
    {
      number: '04',
      title: 'Relax & Enjoy',
      description: 'We deliver, light the coals, and collect everything the next day.',
      icon: <PartyPopper className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <section id="booking-flow" className="py-16 sm:py-20 bg-[#070709] border-t border-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-[2px] w-6 bg-red-600"></span>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-red-500">
              EASY PROCESS
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            How Booking <span className="text-red-600">Works</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-900/60 transition-all text-left relative flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-neutral-600 group-hover:text-red-500 transition-colors font-mono">
                    {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 font-heading">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-900 text-[10px] text-neutral-400 font-mono">
                STEP {step.number} OF 04
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs shadow-xl shadow-red-900/40 hover:shadow-red-600/50 transition-all cursor-pointer"
          >
            <span>Book Your Shisha Setup</span>
          </button>
        </div>

      </div>
    </section>
  );
};
