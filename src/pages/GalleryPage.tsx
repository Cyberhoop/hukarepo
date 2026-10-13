import React, { useState, useEffect, useCallback } from 'react';
import { Camera, ZoomIn, X, Calendar } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { api, GalleryItem } from '../services/api';

interface GalleryPageProps {
  onOpenBooking: () => void;
}

const DEFAULT_FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'VIP Lounge Setup with Exotic Fruit Garnishes',
    subtitle: 'Park Street Penthouse Terrace',
    src: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
    category: 'parties',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Artisanal Smoked Cocktails & Shisha Pairing',
    subtitle: 'Flair Mixologist Catering at Alipore Villa',
    src: '/src/assets/images/quote_cocktail_drink_1791648736985.jpg',
    category: 'cocktails',
    createdAt: '2026-10-01T10:01:00.000Z',
    updatedAt: '2026-10-01T10:01:00.000Z',
  },
  {
    id: 'gal-3',
    title: 'SR Signature Series Custom Hardware',
    subtitle: 'VIP Packaging & German Stainless Steel',
    src: '/src/assets/images/category_sr_products_1791648725022.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:02:00.000Z',
    updatedAt: '2026-10-01T10:02:00.000Z',
  },
  {
    id: 'gal-4',
    title: 'Bohemian Cut-Glass Bases & Heavy Stems',
    subtitle: 'Maya Designer Hookahs in Crystal Clear',
    src: '/src/assets/images/category_hookah_bases_1791648627967.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:03:00.000Z',
    updatedAt: '2026-10-01T10:03:00.000Z',
  },
  {
    id: 'gal-5',
    title: 'Glazed Clay Chilam & Heat Management',
    subtitle: 'Even Heat Distribution & Clean Smoke',
    src: '/src/assets/images/category_chilam_bowls_1791648639938.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:04:00.000Z',
    updatedAt: '2026-10-01T10:04:00.000Z',
  },
  {
    id: 'gal-6',
    title: 'Exotic Fruit & Mint Molasses Collection',
    subtitle: '15+ International Brands Ready for Mixing',
    src: '/src/assets/images/category_flavours_1791648613614.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:05:00.000Z',
    updatedAt: '2026-10-01T10:05:00.000Z',
  },
  {
    id: 'gal-7',
    title: 'Sangeet Cocktail Lounge Installation',
    subtitle: 'New Town Banquet Multi-Pot Bar',
    src: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
    category: 'weddings',
    createdAt: '2026-10-01T10:06:00.000Z',
    updatedAt: '2026-10-01T10:06:00.000Z',
  },
  {
    id: 'gal-8',
    title: 'Food-Grade Silicone Hoses & Steel Handles',
    subtitle: 'Sanitized and Autoclaved Equipment',
    src: '/src/assets/images/category_pipes_hoses_1791648651378.jpg',
    category: 'hookahs',
    createdAt: '2026-10-01T10:07:00.000Z',
    updatedAt: '2026-10-01T10:07:00.000Z',
  },
  {
    id: 'gal-9',
    title: 'Organic Coconut Shell Charcoal Ignition',
    subtitle: 'Odorless, Clean-Burning Cubes',
    src: '/src/assets/images/category_coal_accessories_1791648710860.jpg',
    category: 'parties',
    createdAt: '2026-10-01T10:08:00.000Z',
    updatedAt: '2026-10-01T10:08:00.000Z',
  },
];

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenBooking }) => {
  const { navigateTo } = useNavigation();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_FALLBACK_GALLERY);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const fetchGallery = useCallback(async () => {
    try {
      const res = await api.getGallery();
      if (res && res.success && Array.isArray(res.data)) {
        setGalleryItems(res.data);
      }
    } catch {
      // keep existing gallery items on transient network error
    }
  }, []);

  useEffect(() => {
    fetchGallery();
    const handleGallerySync = () => {
      fetchGallery();
    };
    window.addEventListener('sr-gallery-updated', handleGallerySync);
    return () => {
      window.removeEventListener('sr-gallery-updated', handleGallerySync);
    };
  }, [fetchGallery]);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'parties', label: 'Private Parties' },
    { id: 'weddings', label: 'Weddings & Sangeet' },
    { id: 'hookahs', label: 'Hookahs & Bases' },
    { id: 'cocktails', label: 'Mixology & Bar' },
  ];

  const categoryLabels: Record<string, string> = {
    parties: 'Private Parties',
    weddings: 'Weddings & Sangeet',
    hookahs: 'Hookahs & Bases',
    cocktails: 'Mixology & Bar',
  };

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
            className="hover:text-red-400 transition-colors cursor-pointer"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
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
        {filteredItems.length === 0 ? (
          <div className="p-12 rounded-2xl border border-neutral-800 bg-neutral-950/80 text-center space-y-3">
            <Camera className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white font-heading">
              No gallery photos in this category yet
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Switch to another category or check back soon for new Kolkata event installations.
            </p>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-semibold cursor-pointer"
              >
                View All Photos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const isBroken = brokenImages[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 aspect-[4/3] cursor-pointer shadow-xl hover:border-red-600/70 transition-all duration-300 flex flex-col justify-end p-5 text-left"
                >
                  {!isBroken && item.src ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/40 flex items-center justify-center">
                      <Camera className="w-10 h-10 text-neutral-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 group-hover:via-black/25 transition-all" />

                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-400">
                      <span>{item.subtitle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-300">
                        {categoryLabels[item.category] || 'Event Setup'}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-heading group-hover:text-red-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-sm border border-neutral-700/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close gallery preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] w-full bg-neutral-900 flex items-center justify-center">
              {!brokenImages[selectedImage.id] && selectedImage.src ? (
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <Camera className="w-12 h-12 text-neutral-700" />
              )}
            </div>

            <div className="p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-red-400 font-semibold">
                  <span>{selectedImage.subtitle}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-neutral-400">
                    {categoryLabels[selectedImage.category] || 'Event Setup'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-heading mt-0.5">
                  {selectedImage.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setSelectedImage(null);
                  onOpenBooking();
                }}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer whitespace-nowrap"
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
