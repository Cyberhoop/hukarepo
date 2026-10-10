import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  LogOut,
  Sparkles,
  Calendar,
  QrCode,
  ShieldCheck,
  Edit3,
  MessageCircle,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { api, Booking, PaymentConfig, SavedAddress } from '../services/api';
import { CONTACT_INFO, ProductItem } from '../data/productsData';

interface AccountPageProps {
  paymentConfig: PaymentConfig | null;
  onReorderItems: (items: ProductItem[]) => void;
  onOpenBooking: () => void;
}

const KOLKATA_AREAS = [
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

const FLAVOUR_PREFERENCES = [
  'Kolkata Meetha Paan',
  'Double Apple (Al Fakir)',
  'Commissioner (Afzal)',
  'Spring Water',
  'Watermelon Freeze',
  'Blueberry Mint',
  'Love 66',
  'Brain Freezer',
];

export const AccountPage: React.FC<AccountPageProps> = ({
  paymentConfig,
  onReorderItems,
  onOpenBooking,
}) => {
  const {
    user,
    openAuthModal,
    updateProfile,
    addOrUpdateSavedAddress,
    removeSavedAddress,
    setDefaultSavedAddress,
    logout,
  } = useAuth();
  const { navigateTo } = useNavigation();

  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'profile'>('active');
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Payment proof state per order
  const [uploadingBookingId, setUploadingBookingId] = useState<string | null>(null);
  const [utrByOrder, setUtrByOrder] = useState<Record<string, string>>({});
  const [fileByOrder, setFileByOrder] = useState<Record<string, File | null>>({});

  // Substitution response state
  const [respondingOrderId, setRespondingOrderId] = useState<string | null>(null);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [preferredFlavour, setPreferredFlavour] = useState(user?.preferredFlavour || 'Kolkata Meetha Paan');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Party Venue' | 'Office' | 'Other'>('Home');
  const [addrArea, setAddrArea] = useState(KOLKATA_AREAS[0]);
  const [addrLine, setAddrLine] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrDefault, setAddrDefault] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileEmail(user.email || '');
      setPreferredFlavour(user.preferredFlavour || 'Kolkata Meetha Paan');
      fetchCustomerOrders();
    }
  }, [user]);

  const fetchCustomerOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.getCustomerOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!user) {
    return (
      <section className="py-16 sm:py-24 px-4 max-w-3xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0c0c14] border border-neutral-800 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              CUSTOMER CLIENT PANEL
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Sign In to Manage Your Orders & Profile
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
              Access your live hookah rental dispatch status, past booking history, 1-click reorders, and saved Kolkata addresses.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-900/40 cursor-pointer"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              Create New Account
            </button>
          </div>
        </div>
      </section>
    );
  }

  const activeOrders = orders.filter(
    (o) => !['completed', 'cancelled', 'delivered'].includes(o.bookingStatus)
  );
  const previousOrders = orders.filter((o) =>
    ['completed', 'cancelled', 'delivered'].includes(o.bookingStatus)
  );

  const handleUploadProof = async (bookingId: string) => {
    const utr = utrByOrder[bookingId] || '';
    const file = fileByOrder[bookingId] || null;
    if (!utr && !file) return;

    setUploadingBookingId(bookingId);
    setFeedbackBanner(null);
    try {
      const formData = new FormData();
      formData.append('bookingId', bookingId);
      if (utr) formData.append('transactionReference', utr);
      if (file) formData.append('paymentProof', file);

      const res = await api.uploadPaymentProof(formData);
      if (res.success) {
        setFeedbackBanner({
          type: 'success',
          text: `Payment proof uploaded for booking ${bookingId}!`,
        });
        fetchCustomerOrders();
      } else {
        setFeedbackBanner({
          type: 'error',
          text: res.error || 'Failed to upload payment proof',
        });
      }
    } catch {
      setFeedbackBanner({ type: 'error', text: 'Upload error. Please try again.' });
    } finally {
      setUploadingBookingId(null);
    }
  };

  const handleRespondSubstitution = async (bookingId: string, approved: boolean) => {
    setRespondingOrderId(bookingId);
    setFeedbackBanner(null);
    try {
      const res = await api.respondSubstitution(bookingId, approved);
      if (res.success) {
        setFeedbackBanner({
          type: 'success',
          text: res.message || 'Substitution response recorded.',
        });
        fetchCustomerOrders();
      }
    } catch {
      setFeedbackBanner({ type: 'error', text: 'Failed to submit response.' });
    } finally {
      setRespondingOrderId(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedbackBanner(null);
    const res = await updateProfile({
      name: profileName,
      phone: profilePhone,
      email: profileEmail,
      preferredFlavour,
      newPassword: newPassword.trim() ? newPassword.trim() : undefined,
    });
    setSavingProfile(false);
    if (res.success) {
      setNewPassword('');
      setFeedbackBanner({ type: 'success', text: 'Your profile settings have been updated!' });
    } else {
      setFeedbackBanner({ type: 'error', text: res.error || 'Could not update profile.' });
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim()) return;
    const res = await addOrUpdateSavedAddress({
      label: addrLabel,
      area: addrArea,
      addressLine: addrLine.trim(),
      landmark: addrLandmark.trim() || undefined,
      isDefault: addrDefault,
    });
    if (res.success) {
      setAddrLine('');
      setAddrLandmark('');
      setShowAddAddress(false);
      setFeedbackBanner({ type: 'success', text: 'Saved Kolkata delivery address added!' });
    }
  };

  const getStepProgress = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'pending':
      case 'substitution_requested':
        return 1;
      case 'confirmed':
      case 'substitution_approved':
        return 2;
      case 'dispatched':
        return 3;
      case 'delivered':
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  const renderOrderCard = (order: Booking) => {
    const step = getStepProgress(order.bookingStatus);
    const totalEstimate = (order.requestedItems || []).reduce((acc, item) => acc + (item.price || 0), 0);

    return (
      <div
        key={order.id}
        className="p-5 sm:p-6 rounded-2xl bg-[#0c0c14] border border-neutral-800/90 space-y-5 text-left shadow-xl"
      >
        {/* Top Row: ID + Status Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-base sm:text-lg font-extrabold text-amber-400">
                #{order.id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                  order.bookingStatus === 'confirmed' || order.bookingStatus === 'substitution_approved'
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50'
                    : order.bookingStatus === 'substitution_requested'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-600/50'
                    : order.bookingStatus === 'dispatched'
                    ? 'bg-blue-950/80 text-blue-300 border-blue-600/50'
                    : order.bookingStatus === 'cancelled'
                    ? 'bg-red-950/80 text-red-300 border-red-700/50'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-700'
                }`}
              >
                {order.bookingStatus.replace(/_/g, ' ')}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                  order.paymentStatus === 'verified'
                    ? 'bg-emerald-950/50 text-emerald-400 border-emerald-700/40'
                    : 'bg-neutral-900 text-amber-300 border-neutral-800'
                }`}
              >
                Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Event: {order.eventDate} at {order.eventTime}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {order.deliveryArea} {order.customAddress ? `— ${order.customAddress}` : ''}
              </span>
            </div>
          </div>

          {/* 1-Click Reorder Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onReorderItems(order.requestedItems || [])}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-900/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>1-Click Reorder</span>
            </button>
          </div>
        </div>

        {/* 4-Step Live Progress Bar */}
        {order.bookingStatus !== 'cancelled' && (
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { label: 'Order Placed', idx: 1 },
              { label: 'Confirmed & Packed', idx: 2 },
              { label: 'Out for Delivery', idx: 3 },
              { label: 'Delivered', idx: 4 },
            ].map((s) => {
              const active = step >= s.idx;
              return (
                <div key={s.label} className="space-y-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      active ? 'bg-gradient-to-r from-red-600 to-amber-500' : 'bg-neutral-800'
                    }`}
                  />
                  <span
                    className={`block text-[10px] sm:text-xs font-semibold ${
                      active ? 'text-white' : 'text-neutral-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Substitution Offer Action Box (if admin requested substitution) */}
        {order.bookingStatus === 'substitution_requested' && order.substitutionOffered && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-amber-300 uppercase tracking-wider">
                  Action Required: Flavour / Hardware Substitution Request
                </div>
                <p className="text-neutral-200">
                  Requested item <strong>{order.substitutionOffered.unavailableItem}</strong> is temporarily out of stock. Would you like to approve{' '}
                  <strong className="text-amber-300">{order.substitutionOffered.offeredItem}</strong> instead?
                </p>
                <p className="text-neutral-400 text-[11px]">
                  Reason: {order.substitutionOffered.reason}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                disabled={respondingOrderId === order.id}
                onClick={() => handleRespondSubstitution(order.id, true)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Substitute</span>
              </button>
              <button
                disabled={respondingOrderId === order.id}
                onClick={() => handleRespondSubstitution(order.id, false)}
                className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-red-300 border border-red-800/60 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject Offer</span>
              </button>
            </div>
          </div>
        )}

        {/* Ordered Items List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>
              Requested Items ({order.requestedItems?.length || 0}) · {order.potCount} Hookah Pot(s)
            </span>
            {totalEstimate > 0 && (
              <span className="font-bold text-white">Items Total: ₹{totalEstimate}</span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(order.requestedItems || []).map((item, idx) => (
              <div
                key={`${order.id}-${item.id}-${idx}`}
                className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center gap-3"
              >
                <img
                  src={item.images?.[0] || '/src/assets/images/hero_luxury_hookah_1791648599431.jpg'}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover bg-neutral-900 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{item.name}</div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {item.brand} · ₹{item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online QR Payment Proof Upload (if QR & pending verification) */}
        {order.paymentMethod === 'qr' && order.paymentStatus === 'pending' && (
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                <span>UPI QR Payment Verification ({paymentConfig?.upiId || 'shisharent@upi'})</span>
              </span>
              {order.paymentProofUrl && (
                <span className="text-[11px] text-emerald-400 font-semibold">
                  ✓ Screenshot Attached
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="12-digit UPI UTR Reference"
                value={utrByOrder[order.id] ?? order.transactionReference ?? ''}
                onChange={(e) =>
                  setUtrByOrder((prev) => ({ ...prev, [order.id]: e.target.value }))
                }
                className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFileByOrder((prev) => ({ ...prev, [order.id]: f }));
                }}
                className="text-[11px] text-neutral-400 py-1.5"
              />
              <button
                type="button"
                disabled={uploadingBookingId === order.id}
                onClick={() => handleUploadProof(order.id)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {uploadingBookingId === order.id ? 'Uploading...' : 'Submit Payment Proof'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Client Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#11111a] via-[#0c0c14] to-[#160b0e] border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-red-900/30 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Verified Shisha Rent Member</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white font-heading">
              Welcome, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              {user.email} {user.phone ? `· ${user.phone}` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={onOpenBooking}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Hookah Booking</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigateTo('home');
            }}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {feedbackBanner && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            feedbackBanner.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
              : 'bg-red-950/60 border-red-700/60 text-red-200'
          }`}
        >
          <span>{feedbackBanner.text}</span>
          <button onClick={() => setFeedbackBanner(null)} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
              : 'bg-[#0c0c14] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Current & Active Orders ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
              : 'bg-[#0c0c14] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Previous Orders & Reorder ({previousOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
              : 'bg-[#0c0c14] text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Profile & Saved Addresses ({user.savedAddresses?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: CURRENT & ACTIVE ORDERS */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="p-12 rounded-2xl bg-[#0c0c14] border border-neutral-800 text-center text-sm text-neutral-400">
              Loading your active bookings...
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="p-10 sm:p-12 rounded-2xl bg-[#0c0c14] border border-neutral-800 text-center space-y-4">
              <Clock className="w-10 h-10 text-neutral-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Active Orders Right Now</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Planning a house party or rooftop session in Kolkata? Book your hookah pots, pre-filled chillums, and flavours now.
                </p>
              </div>
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                Book Hookah Setup Now
              </button>
            </div>
          ) : (
            activeOrders.map(renderOrderCard)
          )}
        </div>
      )}

      {/* TAB 2: PREVIOUS ORDERS & REORDER */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {previousOrders.length === 0 ? (
            <div className="p-10 sm:p-12 rounded-2xl bg-[#0c0c14] border border-neutral-800 text-center space-y-4">
              <Package className="w-10 h-10 text-neutral-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Past Completed Orders Yet</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Once your bookings are delivered and completed, they will appear here for 1-click re-ordering.
                </p>
              </div>
            </div>
          ) : (
            previousOrders.map(renderOrderCard)
          )}
        </div>
      )}

      {/* TAB 3: PROFILE & SAVED KOLKATA ADDRESSES */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          {/* Profile Settings Form */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0c0c14] border border-neutral-800 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Personal Details & Preferences
              </h3>
              <p className="text-xs text-neutral-400">
                Your name and WhatsApp number are automatically filled when booking.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Favourite Shisha Flavour
                </label>
                <select
                  value={preferredFlavour}
                  onChange={(e) => setPreferredFlavour(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm"
                >
                  {FLAVOUR_PREFERENCES.map((flav) => (
                    <option key={flav} value={flav}>
                      {flav}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Update Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  placeholder="New password (optional)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Saved Kolkata Addresses */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0c0c14] border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Saved Kolkata Delivery Addresses
                </h3>
                <p className="text-xs text-neutral-400">
                  One-click address selection during booking checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {showAddAddress && (
              <form
                onSubmit={handleAddAddressSubmit}
                className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Address Label
                    </label>
                    <select
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value as SavedAddress['label'])}
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                    >
                      <option value="Home">Home</option>
                      <option value="Party Venue">Party Venue / Rooftop</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Kolkata Zone
                    </label>
                    <select
                      value={addrArea}
                      onChange={(e) => setAddrArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                    >
                      {KOLKATA_AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Full Building / Flat / House & Street Address *"
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                />

                <input
                  type="text"
                  placeholder="Landmark (optional)"
                  value={addrLandmark}
                  onChange={(e) => setAddrLandmark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white"
                />

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addrDefault}
                    onChange={(e) => setAddrDefault(e.target.checked)}
                    className="accent-red-600"
                  />
                  <span>Set as default checkout address</span>
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-400 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {(!user.savedAddresses || user.savedAddresses.length === 0) ? (
                <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800/80 text-center text-xs text-neutral-400">
                  No saved delivery addresses yet. Add your Kolkata home or party venue address for instant checkout.
                </div>
              ) : (
                user.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                      addr.isDefault
                        ? 'bg-neutral-950 border-red-600/60'
                        : 'bg-neutral-950/60 border-neutral-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] font-bold uppercase text-white">
                          {addr.label}
                        </span>
                        <span className="text-xs font-bold text-amber-400">{addr.area}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-400">
                            ✓ Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-200">{addr.addressLine}</p>
                      {addr.landmark && (
                        <p className="text-[11px] text-neutral-400">Landmark: {addr.landmark}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => setDefaultSavedAddress(addr.id)}
                          className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeSavedAddress(addr.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-900 cursor-pointer"
                        title="Remove address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
