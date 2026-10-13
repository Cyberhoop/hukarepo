import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Check,
  QrCode,
  MessageCircle,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
} from 'lucide-react';
import { ALL_PRODUCTS, ProductItem } from '../data/productsData';
import { api, PaymentConfig } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { useContact } from '../context/ContactContext';
import { UpiQrShowcase } from './UpiQrShowcase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedItems?: ProductItem[];
  paymentConfig: PaymentConfig | null;
  currentDomain?: string;
  onTrackOrder?: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialSelectedItems = [],
  paymentConfig,
  currentDomain = 'shisharent.in',
  onTrackOrder,
}) => {
  const { user } = useAuth();
  const { products: catalogProducts } = useProducts();
  const { contactConfig, getWhatsAppLink } = useContact();
  const activeCatalog = catalogProducts && catalogProducts.length > 0 ? catalogProducts : ALL_PRODUCTS;
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('19:00');
  const [deliveryArea, setDeliveryArea] = useState('Salt Lake (Sector 1 - 5)');
  const [customAddress, setCustomAddress] = useState('');
  const [potCount, setPotCount] = useState('2');
  const [selectedItems, setSelectedItems] = useState<ProductItem[]>(initialSelectedItems);
  const [includeBartender, setIncludeBartender] = useState(false);
  const [includeCook, setIncludeCook] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qr'>('cod');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Payment proof upload after booking
  const [txReference, setTxReference] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofUploadedSuccess, setProofUploadedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Sync if initialSelectedItems change
  React.useEffect(() => {
    if (initialSelectedItems.length > 0) {
      setSelectedItems(initialSelectedItems);
    }
  }, [initialSelectedItems]);

  // Auto-fill logged-in customer profile & default Kolkata address
  React.useEffect(() => {
    if (user && isOpen) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
      const defaultAddr =
        user.savedAddresses?.find((a) => a.isDefault) || user.savedAddresses?.[0];
      if (defaultAddr) {
        if (defaultAddr.area) setDeliveryArea(defaultAddr.area);
        if (defaultAddr.addressLine && !customAddress) {
          setCustomAddress(
            defaultAddr.landmark
              ? `${defaultAddr.addressLine} (${defaultAddr.landmark})`
              : defaultAddr.addressLine
          );
        }
      }
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const kolkataAreas = [
    'Salt Lake (Sector 1 - 5)',
    'New Town / Rajarhat',
    'Park Street / Camac Street',
    'Ballygunge / Gariahat',
    'Alipore / New Alipore',
    'South City / Prince Anwar Shah',
    'Behala / Taratala',
    'Howrah / Foreshore Road',
    'Ultadanga / Kankurgachi',
    'Ruby / EM Bypass',
    'Other Kolkata Location',
  ];

  const handleRemoveItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItemByName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemId = e.target.value;
    if (!itemId) return;
    const found = activeCatalog.find((p) => p.id === itemId);
    if (found && !selectedItems.some((p) => p.id === found.id)) {
      setSelectedItems((prev) => [...prev, found]);
    }
    e.target.value = '';
  };

  const generateWhatsAppMessage = () => {
    const itemsList = selectedItems.map((i) => `• ${i.name} (${i.categoryLabel})`).join('\n');
    const message = `*NEW SHISHA RENT KOLKATA BOOKING (${createdBookingId || 'NEW'})*
---------------------------------------
🌐 *Domain:* ${currentDomain}
👤 *Name:* ${customerName || 'Customer'}
📞 *Phone:* ${customerPhone || 'Not provided'}
📅 *Date:* ${eventDate || 'Today / Urgent'}
⏰ *Time:* ${eventTime}
📍 *Location:* ${deliveryArea} ${customAddress ? `(${customAddress})` : ''}
💨 *Hookahs Requested:* ${potCount} Pot(s)

🏷️ *Requested Flavours & Accessories:*
${itemsList || '• Standard Best Seller Flavour & Maya Hookah'}

👨‍🍳 *Staff Requirements:*
${includeBartender ? '✓ Bartender / Mixologist included' : '✗ No Bartender'}
${includeCook ? '✓ Cook / Private Chef included' : '✗ No Cook'}

💳 *Payment Preference:* ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online UPI QR Code'}

📝 *Special Request:* ${specialInstructions || 'None'}

📌 *Availability Rule Confirmed:* I have read that requested brands are subject to availability and will be confirmed prior to dispatch.`;

    return getWhatsAppLink(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await api.createBooking({
        userId: user?.id,
        customerEmail: user?.email,
        customerName,
        customerPhone,
        eventDate,
        eventTime,
        deliveryArea,
        customAddress,
        potCount,
        requestedItems: selectedItems,
        includeBartender,
        includeCook,
        specialInstructions,
        paymentMethod,
        domain: currentDomain,
      });

      if (res.success && res.data) {
        setCreatedBookingId(res.data.id);
        setBookingSubmitted(true);
      } else {
        setSubmitError(res.error || 'Failed to place booking. Please verify your details.');
      }
    } catch {
      setSubmitError('Network error while placing booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload Payment Proof after order creation
  const handleUploadPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdBookingId) return;

    setProofUploading(true);
    setSubmitError('');
    try {
      const formData = new FormData();
      formData.append('bookingId', createdBookingId);
      if (txReference) formData.append('transactionReference', txReference);
      if (proofFile) formData.append('paymentProof', proofFile);

      const res = await api.uploadPaymentProof(formData);
      if (res.success) {
        setProofUploadedSuccess(true);
      } else {
        setSubmitError(res.error || 'Failed to upload payment proof.');
      }
    } catch {
      setSubmitError('Upload failed. Please try again.');
    } finally {
      setProofUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d0d14] border border-neutral-800 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 bg-neutral-950/80 shrink-0">
          <div className="text-left min-w-0 pr-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-red-500 block truncate">
              CUSTOM QUOTE & BOOKING · {currentDomain.toUpperCase()}
            </span>
            <h3 className="text-lg sm:text-2xl font-bold text-white font-heading truncate">
              Book Hookah & Event Services
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitError && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-red-950/70 border border-red-700/60 text-xs text-red-200 flex items-center justify-between gap-2 shrink-0">
            <span>{submitError}</span>
            <button onClick={() => setSubmitError('')} className="text-red-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        {bookingSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-neutral-400">
                Booking Reference ID
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-wider">
                {createdBookingId}
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
                Thank you <strong className="text-white">{customerName}</strong>. Your order has been recorded in PostgreSQL and the immutable terms agreement has been logged.
              </p>
            </div>

            {/* If Online QR selected: show active QR code loaded from backend */}
            {paymentMethod === 'qr' && (
              <div className="max-w-md mx-auto space-y-4 text-left">
                <UpiQrShowcase paymentConfig={paymentConfig} />

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  {/* Upload proof form right here */}
                  {!proofUploadedSuccess ? (
                    <form onSubmit={handleUploadPaymentProof} className="space-y-2.5">
                      <span className="text-xs font-semibold text-neutral-200 block">
                        Attach Payment Proof / Screenshot:
                      </span>
                      <input
                        type="text"
                        placeholder="Enter 12-digit UPI UTR Ref..."
                        value={txReference}
                        onChange={(e) => setTxReference(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setProofFile(e.target.files[0]);
                        }}
                        className="w-full text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
                      />
                      <button
                        type="submit"
                        disabled={proofUploading || (!txReference && !proofFile)}
                        className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                      >
                        {proofUploading ? 'Uploading...' : 'Submit Payment Proof'}
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 text-center font-medium">
                      ✓ Payment proof submitted for admin verification!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/40 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp ({contactConfig.phone})</span>
              </a>

              {createdBookingId && onTrackOrder && (
                <button
                  onClick={() => {
                    onClose();
                    onTrackOrder(createdBookingId);
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Track Order & Substitutions
                </button>
              )}

              <button
                onClick={() => {
                  setBookingSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-left max-h-[75vh] overflow-y-auto">
            
            {/* Customer Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Contact Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 XXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Date, Time & Pot Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Preferred Time Slot
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Hookah Pots Count
                </label>
                <select
                  value={potCount}
                  onChange={(e) => setPotCount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                >
                  <option value="1">1 Hookah Pot</option>
                  <option value="2">2 Hookah Pots (Standard Party)</option>
                  <option value="3">3 Hookah Pots</option>
                  <option value="4">4 Hookah Pots (VIP Gathering)</option>
                  <option value="5+">5+ Hookah Pots (Full Event)</option>
                </select>
              </div>
            </div>

            {/* Location in Kolkata */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  Kolkata Location / Area *
                </label>
                {user?.savedAddresses && user.savedAddresses.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-neutral-400">Saved:</span>
                    {user.savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => {
                          setDeliveryArea(addr.area);
                          setCustomAddress(
                            addr.landmark
                              ? `${addr.addressLine} (${addr.landmark})`
                              : addr.addressLine
                          );
                        }}
                        className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-[10px] font-semibold text-amber-300 cursor-pointer"
                      >
                        {addr.label} ({addr.area.split(' ')[0]})
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <select
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600 mb-2"
              >
                {kolkataAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Specific landmark, apartment or banquet hall name..."
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-900/60 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Requested Flavour Brands & Accessories Custom Selection */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Requested Items & Brands ({selectedItems.length})
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Add Al Fakir, Afzal, Maya Hookah, Coco Aaya, Silicone Chilam, etc.
                  </p>
                </div>

                <div className="w-full sm:w-52 shrink-0">
                  <select
                    onChange={handleAddItemByName}
                    defaultValue=""
                    className="w-full px-2.5 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-200"
                  >
                    <option value="" disabled>+ Add an item...</option>
                    {activeCatalog.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} ({prod.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedItems.length === 0 ? (
                <div className="p-3 rounded-lg bg-neutral-900/40 text-center text-xs text-neutral-500">
                  No specific brand added yet. We will provide our best-selling setup, or select specific items from the dropdown above.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
                    >
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-[10px] text-neutral-400">({item.categoryLabel})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Staff Add-ons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-900/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBartender}
                  onChange={(e) => setIncludeBartender(e.target.checked)}
                  className="mt-1 accent-red-600 rounded"
                />
                <div className="text-left text-xs">
                  <div className="font-semibold text-white">Add Bartender / Mixologist</div>
                  <div className="text-neutral-400 text-[11px]">Handcrafted smoked cocktails & mocktails</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-900/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCook}
                  onChange={(e) => setIncludeCook(e.target.checked)}
                  className="mt-1 accent-red-600 rounded"
                />
                <div className="text-left text-xs">
                  <div className="font-semibold text-white">Add Cook / Private Chef</div>
                  <div className="text-neutral-400 text-[11px]">Live kebabs, tandoor & party snacks</div>
                </div>
              </label>
            </div>

            {/* Payment Method (COD vs UPI QR) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-neutral-900 border-red-600 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Check className={`w-4 h-4 ${paymentMethod === 'cod' ? 'text-red-500' : 'opacity-0'}`} />
                  <span>Cash on Delivery (COD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'qr'
                      ? 'bg-neutral-900 border-red-600 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Online UPI QR Code</span>
                </button>
              </div>

              {/* Instant Live QR Preview when Customer Selects Online UPI QR */}
              {paymentMethod === 'qr' && (
                <div className="mt-4 animate-in fade-in duration-150">
                  <UpiQrShowcase paymentConfig={paymentConfig} compact />
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Special Requests / Delivery Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Mention any custom flavour mixes, elevator access, or preferred timings..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Customer Choice Guarantee Notice */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Customer Choice Guarantee:</strong> Your requested brand and hardware will be provided. No substitution will ever be made without your explicit confirmation.
              </span>
            </div>

            {/* Modal Bottom CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-neutral-800">
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950 border border-emerald-600/50 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : 'Confirm Booking Request'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
