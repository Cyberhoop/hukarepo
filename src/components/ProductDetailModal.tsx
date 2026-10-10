import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  Heart,
  ShoppingCart,
  MessageCircle,
  Calendar,
  Share2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ProductItem, ALL_PRODUCTS, CONTACT_INFO } from '../data/productsData';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingForProduct: (product: ProductItem) => void;
  onSelectRelatedProduct: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenBookingForProduct,
  onSelectRelatedProduct,
}) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rentalDate, setRentalDate] = useState('');
  const [rentalDuration, setRentalDuration] = useState('24 Hours');
  const [isRentalMode, setIsRentalMode] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!isOpen || !product) return null;

  const images = product.images?.length > 0
    ? product.images
    : ['/src/assets/images/category_flavours_1791648613614.jpg'];

  const isRentalSupported =
    product.rentalOrSale === 'Available for Rental & Setup' || !!product.rentalRate;

  const inWishlist = isInWishlist(product.id);

  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      isRentalMode,
      isRentalMode ? rentalDate : undefined,
      isRentalMode ? rentalDuration : undefined
    );
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const generateWhatsAppInquiry = () => {
    const text = `Hi Shisha Rent Kolkata, I am inquiring about *${product.name}* (${product.brand || product.type}).
Price: ₹${product.price} ${product.rentalRate ? `(Rental: ${product.rentalRate})` : ''}
Stock Status: ${product.inStock ? 'In Stock' : 'Out of Stock'}
Could you share availability for Kolkata delivery?`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0b0b12] border border-neutral-800 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-left">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/90 shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Catalogue</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-300">{product.categoryLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-lg border transition-colors ${
                inWishlist
                  ? 'bg-red-950/60 border-red-600 text-red-500'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Gallery Column (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              {/* Main Display Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    Best Seller
                  </span>
                )}
                {product.isNew && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    New Arrival
                  </span>
                )}
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-red-600 scale-102'
                          : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-900 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Genuine Brand Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Express Doorstep Delivery in Kolkata</span>
                </div>
              </div>
            </div>

            {/* Right: Info & Purchase Column (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                    {product.brand || product.type}
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-xs text-neutral-400">{product.categoryLabel}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>{product.rating || 4.9}</span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    ({product.reviewsCount || 120} verified Kolkata orders)
                  </span>
                  <span className="text-neutral-700">|</span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-baseline gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    {isRentalMode ? 'Rental Setup Rate' : 'Direct Purchase Price'}
                  </span>
                  <div className="text-3xl font-black text-white font-mono">
                    ₹{isRentalMode && product.rentalRate ? parseInt(product.rentalRate.replace(/\D/g, ''), 10) : product.price}
                  </div>
                </div>

                {product.rentalRate && (
                  <div className="pl-4 border-l border-neutral-800 text-xs">
                    <span className="text-neutral-400 block">Party / Event Rental:</span>
                    <span className="text-amber-400 font-bold font-mono">{product.rentalRate}</span>
                  </div>
                )}
              </div>

              {/* Rental vs Purchase Toggle (if product supports rental) */}
              {isRentalSupported && (
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-300">Choose Order Type:</span>
                    <div className="flex items-center bg-black rounded-lg p-0.5 border border-neutral-800">
                      <button
                        onClick={() => setIsRentalMode(false)}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          !isRentalMode ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Buy Item
                      </button>
                      <button
                        onClick={() => setIsRentalMode(true)}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          isRentalMode ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Rent for Event
                      </button>
                    </div>
                  </div>

                  {isRentalMode && (
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1">Rental Date</label>
                        <input
                          type="date"
                          value={rentalDate}
                          onChange={(e) => setRentalDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1">Duration</label>
                        <select
                          value={rentalDuration}
                          onChange={(e) => setRentalDuration(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        >
                          <option value="24 Hours">24 Hours (Standard)</option>
                          <option value="48 Hours">48 Hours (Weekend)</option>
                          <option value="Full Event">Full Event (Until 3 AM)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity & Add to Cart Controls */}
              <div className="space-y-3 pt-2 border-t border-neutral-900">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-800 rounded-xl bg-neutral-950 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-white text-sm font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isRentalMode ? 'Add Rental to Cart' : 'Add to Cart'}</span>
                  </button>
                </div>

                {addedNotice && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs text-center font-medium animate-in fade-in">
                    ✓ Added to cart! Opening cart summary...
                  </div>
                )}

                {/* Secondary Actions: Custom Quote & WhatsApp */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBookingForProduct(product);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Full Setup</span>
                  </button>

                  <a
                    href={generateWhatsAppInquiry()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Specifications Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="pt-4 border-t border-neutral-900 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Product Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="p-2 rounded-lg bg-neutral-950 border border-neutral-900">
                        <span className="text-neutral-500 block text-[10px] uppercase font-semibold">{key}</span>
                        <span className="text-neutral-200 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Related Accessories & Recommendations */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Frequently Paired With This Item</span>
                </h4>
                <span className="text-xs text-neutral-400">Same Category</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedProduct(rel)}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-red-600/60 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 mb-2">
                        <img
                          src={rel.images?.[0] || '/src/assets/images/category_flavours_1791648613614.jpg'}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h5 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                        {rel.name}
                      </h5>
                      <span className="text-[10px] text-neutral-400 block">{rel.type}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-neutral-900 flex items-center justify-between text-xs">
                      <span className="font-bold text-white font-mono">₹{rel.price}</span>
                      <span className="text-[10px] text-red-400 font-semibold group-hover:underline">View →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
