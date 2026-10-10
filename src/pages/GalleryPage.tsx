import React, { useState } from 'react';
import { Camera, ZoomIn, X, Calendar, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface GalleryPageProps {
  onOpenBooking: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenBooking }) => {
  const { navigateTo } = useNavigation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<{
    title: string;
    subtitle: string;
    src: string;
    category: string;
  } | null>(null);

  const galleryItems = [
    {
      title: 'VIP Lounge Setup with Exotic Fruit Garnishes',
      subtitle: 'Park Street Penthouse Terrace',
      src: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
      category: 'parties',
    },
    {
      title: 'Artisanal Smoked Cocktails & Shisha Pairing',
      subtitle: 'Flair Mixologist Catering at Alipore Villa',
      src: '/src/assets/images/quote_cocktail_drink_1791648736985.jpg',
      category: 'cocktails',
    },
    {
      title: 'SR Signature Series Custom Hardware',
      subtitle: 'VIP Packaging & German Stainless Steel',
      src: '/src/assets/images/category_sr_products_1791648725022.jpg',
      category: 'hookahs',
    },
    {
      title: 'Bohemian Cut-Glass Bases & Heavy Stems',
      subtitle: 'Maya Designer Hookahs in Crystal Clear',
      src: '/src/assets/images/category_hookah_bases_1791648627967.jpg',
      category: 'hookahs',
    },
    {
      title: 'Glazed Clay Chilam & Heat Management',
      subtitle: 'Even Heat Distribution & Clean Smoke',
      src: '/src/assets/images/category_chilam_bowls_1791648639938.jpg',
      category: 'hookahs',
    },
    {
      title: 'Exotic Fruit & Mint Molasses Collection',
      subtitle: '15+ International Brands Ready for Mixing',
      src: '/src/assets/images/category_flavours_1791648613614.jpg',
      category: 'hookahs',
    },
    {
      title: 'Sangeet Cocktail Lounge Installation',
      subtitle: 'New Town Banquet Multi-Pot Bar',
      src: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
      category: 'weddings',
    },
    {
      title: 'Food-Grade Silicone Hoses & Steel Handles',
      subtitle: 'Sanitized and Autoclaved Equipment',
      src: '/src/assets/images/category_pipes_hoses_1791648651378.jpg',
      category: 'hookahs',
    },
    {
      title: 'Organic Coconut Shell Charcoal Ignition',
      subtitle: 'Odorless, Clean-Burning Cubes',
      src: '/src/assets/images/category_coal_accessories_1791648710860.jpg',
      category: 'parties',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'parties', label: 'Private Parties' },
    { id: 'weddings', label: 'Weddings & Sangeet' },
    { id: 'hookahs', label: 'Hookahs & Bases' },
    { id: 'cocktails', label: 'Mixology & Bar' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((it) => it.category === activeCategory);

  return (
    <div className="py-6 sm:py-10 space-y-10">
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
          <span className="text-white font-medium">Gallery & Atmosphere</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-900">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-[2px] w-5 bg-red-600"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                VISUAL PORTFOLIO
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Atmosphere & Setups
            </h1>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900/90 rounded-xl border border-neutral-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 aspect-[4/3] cursor-pointer shadow-xl hover:border-red-600/70 transition-all duration-300 flex flex-col justify-end p-4 text-left"
            >
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:via-black/20 transition-all" />

              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 px-2 py-0.5 rounded bg-black/60 border border-neutral-800/80 inline-block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-heading group-hover:text-red-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
              </div>

              <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-sm border border-neutral-700/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] w-full bg-neutral-900">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-red-500 font-semibold uppercase tracking-wider">
                  {selectedImage.subtitle}
                </span>
                <h2 className="text-xl font-bold text-white font-heading mt-0.5">
                  {selectedImage.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setSelectedImage(null);
                  onOpenBooking();
                }}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Setup</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
