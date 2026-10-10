import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  Truck,
  MessageCircle,
  QrCode,
  Upload,
  Check,
  ShieldCheck,
  X,
} from 'lucide-react';
import { api, Booking, PaymentConfig } from '../services/api';
import { CONTACT_INFO } from '../data/productsData';
import { useNavigation } from '../context/NavigationContext';

interface TrackPageProps {
  paymentConfig: PaymentConfig | null;
}

export const TrackPage: React.FC<TrackPageProps> = ({ paymentConfig }) => {
  const { navigateTo } = useNavigation();
  const [searchId, setSearchId] = useState('');
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [customerProofFile, setCustomerProofFile] = useState<File | null>(null);
  const [txRef, setTxRef] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [substitutionActionSuccess, setSubstitutionActionSuccess] = useState('');

  const lookupBooking = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    setUploadSuccess('');
    setSubstitutionActionSuccess('');

    try {
      const res = await api.getBooking(idToSearch.trim());
      if (res.success && res.data) {
        setCurrentBooking(res.data);
      } else {
        setErrorMsg('Booking not found. Please verify your Booking ID (e.g. SR-KOL-1001).');
        setCurrentBooking(null);
      }
    } catch {
      setErrorMsg('Error looking up booking. Please check your connection.');
      setCurrentBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking || !customerProofFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('bookingId', currentBooking.id);
      formData.append('paymentProof', customerProofFile);
      if (txRef.trim()) {
        formData.append('transactionReference', txRef.trim());
      }

      const res = await api.uploadPaymentProof(formData);
      if (res.success) {
        setUploadSuccess('Payment proof uploaded successfully! Our admin team is verifying it.');
        await lookupBooking(currentBooking.id);
      } else {
        setErrorMsg(res.error || 'Failed to upload payment proof');
      }
    } catch {
      setErrorMsg('Network error uploading proof');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubstitutionResponse = async (approved: boolean) => {
    if (!currentBooking) return;
    setIsLoading(true);
    try {
      const res = await api.respondSubstitution(
        currentBooking.id,
        approved,
        approved ? 'Approved by customer' : 'Declined by customer'
      );
      if (res.success) {
        setSubstitutionActionSuccess(
          `Product substitution ${approved ? 'approved' : 'declined'} successfully.`
        );
        await lookupBooking(currentBooking.id);
      } else {
        setErrorMsg(res.error || 'Failed to record decision');
      }
    } catch {
      setErrorMsg('Network error recording decision');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStepIndex = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 1;
      case 'substitution_requested':
      case 'substitution_approved':
        return 1;
      case 'dispatched':
        return 2;
      case 'delivered':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0; // pending
    }
  };

  const steps = [
    { title: 'Booking Received', desc: 'Awaiting admin review' },
    { title: 'Confirmed', desc: 'Hardware prepared' },
    { title: 'Dispatched', desc: 'Crew en route' },
    { title: 'Delivered', desc: 'Ready to smoke' },
    { title: 'Completed', desc: 'Deposit settled' },
  ];

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
          <span className="text-white font-medium">Track Booking</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-900">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-[2px] w-5 bg-red-600"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                LIVE STATUS LOOKUP
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Track Your Order & Delivery
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
            Enter your Booking Reference ID from your confirmation screen or SMS to monitor dispatch and payment status.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookupBooking(searchId);
          }}
          className="flex flex-col sm:flex-row items-center gap-3 bg-[#0c0c14] border border-neutral-800 p-2.5 rounded-2xl shadow-xl"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Booking ID (e.g. SR-KOL-1001)..."
              className="w-full bg-transparent pl-12 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !searchId.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-lg shadow-red-950/50"
          >
            {isLoading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs text-left flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {substitutionActionSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs text-left flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{substitutionActionSuccess}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs text-left flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* Booking Details Card */}
      {currentBooking && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-left">
          <div className="bg-[#0b0b12] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
              <div>
                <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">
                  BOOKING REFERENCE
                </span>
                <h2 className="text-2xl font-extrabold text-white font-heading mt-0.5">
                  {currentBooking.id}
                </h2>
                <div className="text-xs text-neutral-400 mt-1">
                  Placed for {currentBooking.customerName} · {currentBooking.customerPhone}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-semibold">
                  Status:{' '}
                  <span className="text-red-400 uppercase ml-1 font-bold">
                    {currentBooking.bookingStatus.replace(/_/g, ' ')}
                  </span>
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-semibold">
                  Payment:{' '}
                  <span
                    className={
                      currentBooking.paymentStatus === 'verified'
                        ? 'text-emerald-400 ml-1 font-bold'
                        : 'text-amber-400 ml-1 font-bold'
                    }
                  >
                    {currentBooking.paymentStatus === 'verified'
                      ? 'Verified'
                      : currentBooking.paymentMethod === 'cod'
                      ? 'Cash on Delivery'
                      : 'Pending Proof Verification'}
                  </span>
                </span>
              </div>
            </div>

            {/* Progress Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
                Delivery Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {steps.map((st, idx) => {
                  const currentIdx = getStatusStepIndex(currentBooking.bookingStatus);
                  const isDone = idx <= currentIdx;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-neutral-900/90 border-red-600/70 text-white'
                          : 'bg-black/30 border-neutral-800/60 text-neutral-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold">Step {idx + 1}</span>
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-neutral-600" />
                        )}
                      </div>
                      <div className="text-xs font-bold font-heading">{st.title}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{st.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Substitution Alert if active */}
            {currentBooking.bookingStatus === 'substitution_requested' &&
              currentBooking.substitutionOffered && (
                <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-600/50 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    <span>Substitution Approval Requested</span>
                  </div>
                  <p className="text-xs text-neutral-200">
                    The requested item{' '}
                    <strong className="text-red-400">
                      {currentBooking.substitutionOffered.unavailableItem}
                    </strong>{' '}
                    was unavailable. We propose substituting it with{' '}
                    <strong className="text-emerald-400">
                      {currentBooking.substitutionOffered.offeredItem}
                    </strong>
                    . Reason: {currentBooking.substitutionOffered.reason}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => handleSubstitutionResponse(true)}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Substitution</span>
                    </button>
                    <button
                      onClick={() => handleSubstitutionResponse(false)}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              )}

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-900 text-xs">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Delivery Details
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-900 space-y-1.5">
                  <div>
                    <span className="text-neutral-500">Area:</span>{' '}
                    <span className="text-white">{currentBooking.deliveryArea}</span>
                  </div>
                  {currentBooking.customAddress && (
                    <div>
                      <span className="text-neutral-500">Address:</span>{' '}
                      <span className="text-white">{currentBooking.customAddress}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-neutral-500">Date:</span>{' '}
                    <span className="text-white">{currentBooking.eventDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Time:</span>{' '}
                    <span className="text-white">{currentBooking.eventTime}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Pots Requested:</span>{' '}
                    <span className="text-white">{currentBooking.potCount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Requested Items ({currentBooking.requestedItems.length})
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-900 space-y-1.5 max-h-36 overflow-y-auto">
                  {currentBooking.requestedItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-300 font-medium truncate">{item.name}</span>
                      <span className="text-amber-400 tabular-nums shrink-0 ml-2">₹{item.price}</span>
                    </div>
                  ))}
                  {currentBooking.includeBartender && (
                    <div className="flex justify-between items-center text-[11px] text-amber-300">
                      <span>+ Flair Bartender Service</span>
                      <span className="tabular-nums">Included</span>
                    </div>
                  )}
                  {currentBooking.includeCook && (
                    <div className="flex justify-between items-center text-[11px] text-red-300">
                      <span>+ Private Chef & Cook Service</span>
                      <span className="tabular-nums">Included</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Payment Proof if Online and Unverified */}
            {currentBooking.paymentMethod === 'qr' &&
              currentBooking.paymentStatus !== 'verified' && (
                <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>Upload UPI Payment Screenshot</span>
                  </div>
                  <form onSubmit={handleUploadPaymentProof} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCustomerProofFile(e.target.files?.[0] || null)}
                      className="text-xs text-neutral-300 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-neutral-800 file:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Transaction Reference (UTR)..."
                      value={txRef}
                      onChange={(e) => setTxRef(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !customerProofFile}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs"
                    >
                      Upload Proof
                    </button>
                  </form>
                </div>
              )}

            {/* WhatsApp Contact Helper */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-900">
              <span className="text-xs text-neutral-400">
                Need immediate update from our Kolkata dispatch desk?
              </span>
              <a
                href={`https://wa.me/91${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi Shisha Rent Kolkata, checking status on my booking reference #${currentBooking.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Message Concierge about #{currentBooking.id}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
