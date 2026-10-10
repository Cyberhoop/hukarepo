import React from 'react';
import { ArrowRight, Eye, Plus, CheckCircle2, Calendar, ShieldCheck } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { ProductItem } from '../data/productsData';

interface MasterSequenceItem {
  number: string;
  id: string;
  title: string;
  categoryTag: string;
  priceTag: string;
  description: string;
  image: string;
  actionText: string;
  categoryFilter?: string;
  highlight?: string;
}

export const MASTER_12_ITEMS: MasterSequenceItem[] = [
  {
    number: '01',
    id: 'hookah-products',
    title: 'German Stainless Hookah Stems & Sets',
    categoryTag: 'Hookah Products',
    priceTag: 'From ₹999 / Night',
    description: 'Aircraft-grade V2A stainless steel stems with click-lock mechanisms and integrated quiet diffusers.',
    image: '/src/assets/images/hero_luxury_hookah_1791648599431.jpg',
    actionText: 'Explore Hookahs',
    categoryFilter: 'hookah-bases',
    highlight: 'German Engineering',
  },
  {
    number: '02',
    id: 'glass-bases',
    title: 'Bohemian & Russian Glass Bases',
    categoryTag: 'Bases & Vessels',
    priceTag: 'From ₹399 / Add-on',
    description: 'Heavy tempered crystal glassware engineered for rock-solid stability, maximum cooling, and aesthetics.',
    image: '/src/assets/images/category_hookah_bases_1791648627967.jpg',
    actionText: 'Browse Bases',
    categoryFilter: 'hookah-bases',
    highlight: 'Anti-Tilt Crystal',
  },
  {
    number: '03',
    id: 'chillum-classic-clay',
    title: 'Classic Clay Chillum Bowl',
    categoryTag: 'Chilam Range',
    priceTag: '₹600 Pre-Filled',
    description: 'Handcrafted terracotta clay mud bowl that breathes naturally for traditional authentic shisha flavor.',
    image: '/src/assets/images/chillum_classic_clay_1791655831825.jpg',
    actionText: 'Configure Clay Chillum',
    categoryFilter: 'chilam',
    highlight: 'Authentic Terracotta',
  },
  {
    number: '04',
    id: 'chillum-gold-silicon',
    title: 'Gold Silicon Cloud Chillum',
    categoryTag: 'Chilam Range',
    priceTag: '₹700 Pre-Filled',
    description: 'Food-grade silicone head with lotus heat management system preventing harsh burns and ash contamination.',
    image: '/src/assets/images/chillum_gold_silicon_1791655843076.jpg',
    actionText: 'Configure Silicon Cloud',
    categoryFilter: 'chilam',
    highlight: 'Lotus Heat Control',
  },
  {
    number: '05',
    id: 'flavours-signature-paan',
    title: 'Signature Flavours: Dark Rose & Meetha Paan',
    categoryTag: 'Flavours Collection',
    priceTag: '15+ Blends Available',
    description: 'Kolkata special sweet paan and deep Damascus dark rose infusions providing dense clouds and smooth pull.',
    image: '/src/assets/images/flavour_paan_collection_1791655854763.jpg',
    actionText: 'View Flavour Menu',
    categoryFilter: 'flavours',
    highlight: 'Kolkata Special',
  },
  {
    number: '06',
    id: 'flavours-international',
    title: '15+ International Flavour Brands',
    categoryTag: 'Flavours Collection',
    priceTag: 'Al Fakher, Starbuzz, Afzal',
    description: 'Genuine imported tobacco and 100% tobacco-free herbal molasses tins for extended party sessions.',
    image: '/src/assets/images/category_flavours_1791648613614.jpg',
    actionText: 'Browse All Brands',
    categoryFilter: 'flavours',
    highlight: 'Zero Nicotine Option',
  },
  {
    number: '07',
    id: 'pipes-hoses',
    title: 'Food-Grade Washable Silicone Pipes',
    categoryTag: 'Pipes & Hoses',
    priceTag: 'Autoclaved & Sealed',
    description: 'Medical-grade odorless silicone hoses paired with ergonomic anodized aluminum handles and mouth tips.',
    image: '/src/assets/images/category_pipes_hoses_1791648651378.jpg',
    actionText: 'View Pipe Options',
    categoryFilter: 'pipes',
    highlight: 'Sanitized Silicone',
  },
  {
    number: '08',
    id: 'coal-accessories',
    title: '100% Organic Coconut Charcoal & Burner',
    categoryTag: 'Coal & Accessories',
    priceTag: 'Included in Rental',
    description: 'Odorless, zero-chemical compressed coconut cubes that burn consistently for 90+ minutes with safety tongs.',
    image: '/src/assets/images/category_coal_accessories_1791648710860.jpg',
    actionText: 'Check Accessories',
    categoryFilter: 'coal-accessories',
    highlight: 'Zero Sulfur Coal',
  },
  {
    number: '09',
    id: 'travel-box',
    title: 'Heavy-Duty Shockproof Flight Case / Box',
    categoryTag: 'Box & Hard Case',
    priceTag: 'Safe Transit Guarantee',
    description: 'Rigid hard-shell flight box with custom laser-cut protective foam inserts ensuring zero glass breakage.',
    image: '/src/assets/images/box_hard_travel_case_1791655805587.jpg',
    actionText: 'View Transit Box',
    categoryFilter: 'sr-products',
    highlight: 'Flight Case Armor',
  },
  {
    number: '10',
    id: 'bag-combo',
    title: 'Tactical Travel Bag Combo Set',
    categoryTag: 'Bag Combo',
    priceTag: 'Complete Shisha Kit',
    description: 'Padded multi-compartment tactical carry bag carrying hookah, coals, electric burner, and accessories.',
    image: '/src/assets/images/bag_combo_hookah_set_1791655818016.jpg',
    actionText: 'View Bag Combo',
    categoryFilter: 'sr-products',
    highlight: 'All-In-One Kit',
  },
  {
    number: '11',
    id: 'sr-products-vip',
    title: 'SR Signature Series VIP Products',
    categoryTag: 'SR Range',
    priceTag: 'Exclusive VIP Line',
    description: 'Custom titanium gold coated hookahs and reserve flavour blends tailored exclusively for luxury VIP events.',
    image: '/src/assets/images/category_sr_products_1791648725022.jpg',
    actionText: 'Explore SR Range',
    categoryFilter: 'sr-products',
    highlight: 'Titanium Gold PVD',
  },
  {
    number: '12',
    id: 'hospitality-services',
    title: 'Event Services: Mixologists, Cooks & Shisha Master',
    categoryTag: 'Services',
    priceTag: 'From ₹1,499 / Event',
    description: 'Turnkey event crew: certified flair bartenders, live tandoor BBQ chefs, and on-site shisha sommeliers.',
    image: '/src/assets/images/quote_cocktail_drink_1791648736985.jpg',
    actionText: 'Book Event Crew',
    highlight: 'Turnkey Catering',
  },
];

interface MasterCatalogSequenceSectionProps {
  onOpenBooking: () => void;
  onOpenProductDetail?: (product: ProductItem) => void;
}

export const MasterCatalogSequenceSection: React.FC<
  MasterCatalogSequenceSectionProps
> = ({ onOpenBooking }) => {
  const { navigateTo } = useNavigation();

  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-[2px] w-5 bg-red-600"></span>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
              OFFICIAL 1 TO 12 MASTER CATALOGUE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Complete Product & Service Sequence
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg">
          Arranged in strict line-by-line sequence (1 to 12): Hookah products, glass bases, chillums, flavours, pipes, coal, protective box, bag combo, signature series, and event crew.
        </p>
      </div>

      {/* Grid line-by-line (1 to 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {MASTER_12_ITEMS.map((item) => (
          <div
            key={item.number}
            className="group relative rounded-2xl overflow-hidden border border-neutral-800/90 bg-[#0c0c14] hover:border-red-600/70 transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            {/* Image container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Numbered Sequence Badge: 01 to 12 */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700/80 text-white font-extrabold text-xs flex items-center justify-center font-heading text-red-500 shadow">
                  {item.number}
                </span>
                {item.highlight && (
                  <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-neutral-700/60 text-[10px] font-bold text-amber-400">
                    {item.highlight}
                  </span>
                )}
              </div>

              {/* Category Tag bottom left */}
              <div className="absolute bottom-2.5 left-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded border border-red-900/40">
                  {item.categoryTag}
                </span>
              </div>
            </div>

            {/* Info and details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-400 tabular-nums">
                    {item.priceTag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors font-heading line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (item.categoryFilter) {
                      navigateTo('products', item.categoryFilter);
                    } else {
                      navigateTo('services');
                    }
                  }}
                  className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1 group-hover:text-red-400 transition-colors cursor-pointer"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold shadow-md shadow-red-950/40 transition-colors cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
