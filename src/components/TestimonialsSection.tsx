import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rohan Sen',
      role: 'Private Host',
      location: 'Salt Lake',
      quote:
        'Requested 4 Maya Hookahs with Al Fakir & Royal flavours. Punctual doorstep setup, pristine clean gear, and the smoked cocktails were incredible.',
      rating: 5,
    },
    {
      name: 'Ananya Mukherjee',
      role: 'Wedding Host',
      location: 'Alipore',
      quote:
        'The SR Premium setup was the highlight of our sangeet evening. Coconut coals lasted for hours with seamless bowl refills. Zero hassle.',
      rating: 5,
    },
    {
      name: 'Vikramaditya Roy',
      role: 'Weekend Gathering',
      location: 'New Town',
      quote:
        'Requested Coco Aaya Hookah with Mud Mitti Chilam. Arrived fast, drew smooth smoke, and collected next afternoon. Reliable COD service.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#070709] border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-[2px] w-6 bg-red-600"></span>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-red-500">
              REVIEWS
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            Loved by Kolkata's <span className="text-red-600">Party Hosts</span>
          </h2>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-left flex flex-col justify-between hover:border-neutral-700 transition-all shadow-md relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-neutral-800" />
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-neutral-900 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-heading">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-amber-400 font-medium">
                    {item.role} · {item.location}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Verified Booking
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
