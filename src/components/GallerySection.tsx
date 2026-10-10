import React, { useState } from 'react';
import { Camera, ZoomIn } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const galleryItems = [
    {
      title: 'VIP Lounge Setup with Exotic Fruits',
      subtitle: 'Park Street Terrace',
      src: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
    },
    {
      title: 'Artisanal Smoked Cocktails',
      subtitle: 'Flair Mixologist Catering',
      src: '/src/assets/images/quote_cocktail_drink_1791648736985.jpg',
    },
    {
      title: 'SR Signature Series',
      subtitle: 'VIP Packaging & Shisha Line',
      src: '/src/assets/images/category_sr_products_1791648725022.jpg',
    },
    {
      title: 'Clay Chilams & Coals',
      subtitle: 'Even Heat Distribution',
      src: '/src/assets/images/category_chilam_bowls_1791648639938.jpg',
    },
    {
      title: 'Bohemian Glass Bases',
      subtitle: 'Maya & Coco Aaya Hookahs',
      src: '/src/assets/images/category_hookah_bases_1791648627967.jpg',
    },
    {
      title: 'Fruit-Infused Molasses',
      subtitle: '15+ Flavour Brands',
      src: '/src/assets/images/category_flavours_1791648613614.jpg',
    },
  ];

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-[#070709] border-t border-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-[2px] w-6 bg-red-600"></span>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-red-500">
              PORTFOLIO
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            The Shisha Rent <span className="text-red-600">Atmosphere</span>
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImage(item.src)}
              className="relative group rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 aspect-[4/3] cursor-pointer shadow-lg hover:border-red-600/60 transition-all duration-300"
            >
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end text-left">
                <span className="text-[10px] text-amber-400 font-medium">
                  {item.subtitle}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {item.title}
                </h3>
              </div>

              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
                <ZoomIn className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-neutral-700">
            <img
              src={activeImage}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] object-contain"
            />
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-semibold hover:bg-red-600 transition-colors cursor-pointer"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
