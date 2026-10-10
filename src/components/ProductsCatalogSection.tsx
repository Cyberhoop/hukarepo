import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  CheckCircle2,
  Sparkles,
  Plus,
  Check,
  ShieldCheck,
  Star,
  Eye,
  Heart,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react';
import { PRODUCT_CATEGORIES, ProductItem } from '../data/productsData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

interface ProductsCatalogSectionProps {
  selectedCategoryId: string;
  onSelectCategoryTab: (id: string) => void;
  onRequestItemInBooking: (item: ProductItem) => void;
  selectedBookingItems: ProductItem[];
  onOpenBookingModal: () => void;
  onOpenPolicyModal?: () => void;
  onOpenProductDetail?: (item: ProductItem) => void;
}

export const ProductsCatalogSection: React.FC<ProductsCatalogSectionProps> = ({
  selectedCategoryId,
  onSelectCategoryTab,
  onRequestItemInBooking,
  selectedBookingItems,
  onOpenBookingModal,
  onOpenPolicyModal,
  onOpenProductDetail,
}) => {
  const { isInWishlist, toggleWishlist, addToCart, setIsCartOpen, totalItemsCount } = useCart();
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterQuick, setFilterQuick] = useState<'all' | 'bestsellers' | 'top-rated' | 'rentals'>('all');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = products.filter((item) => {
      const matchesCategory =
        selectedCategoryId === 'all' || item.category === selectedCategoryId;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        (item.brand && item.brand.toLowerCase().includes(query));

      const matchesQuick =
        filterQuick === 'all' ||
        (filterQuick === 'bestsellers' && item.isBestSeller) ||
        (filterQuick === 'top-rated' && item.rating >= 4.8) ||
        (filterQuick === 'rentals' && item.rentalOrSale === 'Available for Rental & Setup');

      return matchesCategory && matchesSearch && matchesQuick;
    });

    // Apply sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Featured / Bestsellers first
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return list;
  }, [selectedCategoryId, searchQuery, sortBy, filterQuick]);

  const isSelected = (itemId: string) => {
    return selectedBookingItems.some((item) => item.id === itemId);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: ProductItem) => {
    e.stopPropagation();
    onRequestItemInBooking(item);
    addToCart(item, 1);
  };

  return (
    <section id="products-section" className="py-16 sm:py-20 bg-[#070709] border-t border-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Clean, Punchy, Anti-Texty */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="h-[2px] w-6 bg-red-600"></span>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-red-500">
                LUXURY MARKETPLACE
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
              Hookah, Flavours & <span className="text-red-600">Accessories</span>
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed">
              Explore authentic global flavour brands, hand-crafted glassware, organic coals, and full lounge setups for doorstep Kolkata delivery.
            </p>
          </div>

          {/* Quick Selected & Cart Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {selectedBookingItems.length > 0 && (
              <button
                onClick={onOpenBookingModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-semibold shadow-lg shadow-red-900/40 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Selected ({selectedBookingItems.length})</span>
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-red-500" />
              <span>Cart ({totalItemsCount})</span>
            </button>
          </div>
        </div>

        {/* Minimalist Customer Guarantee Strip (Compact, Sleek) */}
        <div className="mb-8 p-3 sm:p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs text-neutral-300">
              <strong className="text-white">Authenticity Guaranteed: </strong>
              100% original brands, sealed fresh coals, and food-grade sanitized stems delivered on time.
            </p>
          </div>

          {onOpenPolicyModal && (
            <button
              onClick={onOpenPolicyModal}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 shrink-0 cursor-pointer"
            >
              Terms & Policy
            </button>
          )}
        </div>

        {/* Search, Filter Tabs & Sort Controls */}
        <div className="space-y-4 mb-8">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Al Fakir, Maya, Coco Aaya, Clay Chilam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-200 placeholder-neutral-500 text-xs focus:outline-none focus:border-red-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Chips & Sort Select */}
            <div className="flex flex-wrap items-center gap-2 justify-between lg:justify-end">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <button
                  onClick={() => setFilterQuick('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    filterQuick === 'all'
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterQuick('bestsellers')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    filterQuick === 'bestsellers'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Best Sellers</span>
                </button>
                <button
                  onClick={() => setFilterQuick('top-rated')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    filterQuick === 'top-rated'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-900'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current text-amber-400" />
                  <span>4.8+ Rated</span>
                </button>
                <button
                  onClick={() => setFilterQuick('rentals')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    filterQuick === 'rentals'
                      ? 'bg-red-950/80 text-red-300 border border-red-600/40'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-900'
                  }`}
                >
                  Rentals
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-neutral-200 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-neutral-900 text-neutral-200">Featured</option>
                  <option value="rating" className="bg-neutral-900 text-neutral-200">Highest Rated</option>
                  <option value="price-asc" className="bg-neutral-900 text-neutral-200">Price: Low to High</option>
                  <option value="price-desc" className="bg-neutral-900 text-neutral-200">Price: High to Low</option>
                </select>
              </div>
            </div>

          </div>

          {/* Category Tabs Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => onSelectCategoryTab('all')}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer font-medium ${
                selectedCategoryId === 'all'
                  ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-900/40'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800/80'
              }`}
            >
              All Items ({products.length})
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategoryTab(cat.id)}
                className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer font-medium whitespace-nowrap ${
                  selectedCategoryId === cat.id
                    ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-900/40'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800/80'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

        </div>

        {/* Product Cards Grid - High Luxury, E-Commerce Photographic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((item) => {
            const active = isSelected(item.id);
            const inWishlist = isInWishlist(item.id);
            const coverImage = item.images?.[0] || '/src/assets/images/category_flavours_1791648613614.jpg';

            return (
              <div
                key={item.id}
                onClick={() => onOpenProductDetail && onOpenProductDetail(item)}
                className={`group rounded-2xl border text-left flex flex-col justify-between overflow-hidden transition-all duration-300 cursor-pointer ${
                  active
                    ? 'bg-neutral-950 border-red-600 shadow-xl shadow-red-950/40'
                    : 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40 hover:shadow-xl hover:shadow-black/70'
                }`}
              >
                {/* Product Image Stage */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={coverImage}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {item.isBestSeller && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                        Best Seller
                      </span>
                    )}
                    {item.rentalOrSale === 'Available for Rental & Setup' && (
                      <span className="px-2 py-0.5 rounded-md bg-neutral-900/90 text-neutral-200 border border-neutral-700 text-[10px] font-semibold backdrop-blur-sm">
                        Rental Setup
                      </span>
                    )}
                  </div>

                  {/* Top-Right Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-md ${
                      inWishlist
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-black/60 text-neutral-300 hover:text-white hover:bg-black/80'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>

                  {/* Quick View Hover Button (Desktop) */}
                  <div className="absolute inset-x-3 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex justify-center z-10">
                    <span className="px-3.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-red-400" />
                      <span>Quick View</span>
                    </span>
                  </div>
                </div>

                {/* Card Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Brand & Rating Row */}
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-red-500 text-[10px]">
                        {item.brand || item.type}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                        <Star className="w-3 h-3 fill-current text-amber-400" />
                        <span>{item.rating || 4.9}</span>
                        <span className="text-neutral-500 text-[10px]">({item.reviewsCount || 85})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors font-heading line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Short Punchy Snippet */}
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing & Add Action */}
                  <div className="pt-3 mt-3 border-t border-neutral-900/90 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-white">
                        ₹{item.price}
                      </div>
                      {item.rentalRate && (
                        <div className="text-[10px] text-amber-400 font-medium">
                          {item.rentalRate}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                        active
                          ? 'bg-red-600 text-white shadow-red-950/60'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-red-600/50'
                      }`}
                    >
                      {active ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-red-400" />
                          <span>Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimalist Footnote */}
        <div className="mt-10 p-4 rounded-xl bg-neutral-950/60 border border-neutral-900 text-center max-w-xl mx-auto">
          <p className="text-xs text-neutral-400">
            Need a rare flavour or custom mix not listed? Let us know during booking or contact us directly on WhatsApp.
          </p>
        </div>

      </div>
    </section>
  );
};
