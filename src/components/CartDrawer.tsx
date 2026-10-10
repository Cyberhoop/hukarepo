import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CONTACT_INFO } from '../data/productsData';

interface CartDrawerProps {
  onProceedToBooking: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToBooking }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    total,
    totalItemsCount,
  } = useCart();

  const [inputCoupon, setInputCoupon] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccess, setCouponSuccess] = React.useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!inputCoupon.trim()) return;

    const valid = applyCoupon(inputCoupon);
    if (valid) {
      setCouponSuccess('Coupon applied successfully! 10% discount added.');
      setInputCoupon('');
    } else {
      setCouponError('Invalid code. Try "SHISHA10" or "KOLKATA15"');
    }
  };

  const getWhatsAppOrderUrl = () => {
    const itemList = cartItems
      .map(
        (item) =>
          `• ${item.product.name} x${item.quantity} - ₹${
            item.product.price * item.quantity
          } ${item.isRental ? `(Rental: ${item.rentalDuration || '24h'})` : ''}`
      )
      .join('\n');

    const msg = `*NEW ORDER / INQUIRY - SHISHA RENT KOLKATA*
---------------------------------------
🛒 *Cart Items:*
${itemList}

💰 *Subtotal:* ₹${subtotal}
🚚 *Delivery:* ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
${discountAmount > 0 ? `🎟️ *Discount (${couponCode}):* -₹${discountAmount}\n` : ''}
*Total Estimated:* ₹${total}

Please confirm availability and dispatch schedule for Kolkata.`;

    const encoded = encodeURIComponent(msg);
    return `https://wa.me/919876543210?text=${encoded}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div className="w-screen max-w-md bg-[#0a0a12] border-l border-neutral-800/90 text-neutral-100 flex flex-col shadow-2xl text-left">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-950/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-600/40 flex items-center justify-center text-red-500">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-heading">Your Cart</h2>
                <p className="text-[11px] text-neutral-400">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-neutral-200">Your cart is empty</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                    Browse our premium hookahs, 15+ flavour varieties, and accessories to start your session.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-red-400 border border-neutral-800 transition-all cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Bar */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-red-950/30 via-neutral-950 to-neutral-950 border border-red-900/30 flex items-center gap-2.5 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-neutral-300 text-[11px]">
                    {subtotal >= 999 ? (
                      <span className="text-emerald-400 font-semibold">
                        Free Kolkata delivery unlocked on this order!
                      </span>
                    ) : (
                      <span>
                        Add ₹{999 - subtotal} more for <strong className="text-white">Free Doorstep Delivery</strong>
                      </span>
                    )}
                  </p>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 rounded-xl bg-neutral-950/90 border border-neutral-800/80 flex gap-3 hover:border-neutral-700 transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                        <img
                          src={item.product.images?.[0] || '/src/assets/images/category_flavours_1791648613614.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-white truncate font-heading">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-neutral-500 hover:text-red-400 transition-colors p-0.5"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                            <span>{item.product.categoryLabel}</span>
                            {item.isRental && (
                              <span className="text-amber-400 font-medium">· Rental ({item.rentalDuration || '24h'})</span>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-bold text-red-400">
                            ₹{item.product.price * item.quantity}
                          </span>

                          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-xs font-semibold text-white px-1.5 min-w-[18px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-2">
                  {couponCode ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-600/40 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="font-semibold">{couponCode} applied</span>
                        <span className="text-[11px] text-emerald-300">(-₹{discountAmount})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Coupon code (e.g. SHISHA10)"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[10px] text-red-400 mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-[10px] text-emerald-400 mt-1">{couponSuccess}</p>}
                </div>
              </>
            )}
          </div>

          {/* Footer Calculations & CTAs */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950/95 space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-200 font-medium">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery in Kolkata</span>
                  <span className="text-neutral-200 font-medium">
                    {deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-900 flex justify-between text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="text-red-500 font-heading text-base">₹{total}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToBooking();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-red-900/40 hover:shadow-red-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Booking & Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-600/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Order Directly via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
