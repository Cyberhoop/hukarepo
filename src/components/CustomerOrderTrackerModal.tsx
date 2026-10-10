import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  QrCode,
  Upload,
  Check,
  Package,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { api, Booking, PaymentConfig } from '../services/api';
import { CONTACT_INFO } from '../data/productsData';

interface CustomerOrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBookingId?: string;
  paymentConfig: PaymentConfig | null;
}

export const CustomerOrderTrackerModal: React.FC<CustomerOrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialBookingId,
  paymentConfig,
}) => {
  const [searchId, setSearchId] = useState(initialBookingId || '');
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [customerProofFile, setCustomerProofFile] = useState<File | null>(null);
  const [txRef, setTxRef] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [substitutionActionSuccess, setSubstitutionActionSuccess] = useState('');

  React.useEffect(() => {
    if (initialBookingId) {
      setSearchId(initialBookingId);
      lookupBooking(initialBookingId);
    }
  }, [initialBookingId, isOpen]);

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
    } catch (err) {
      setErrorMsg('Failed to lookup booking.');
      setCurrentBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupBooking(searchId);
  };

  // Upload Payment Proof
  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;
    if (!customerProofFile && !txRef) {
      alert('Please provide transaction reference or select a screenshot file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('bookingId', currentBooking.id);
      if (txRef) formData.append('transactionReference', txRef);
      if (customerProofFile) formData.append('paymentProof', customerProofFile);

      const res = await api.uploadPaymentProof(formData);
      if (res.success) {
        setCurrentBooking(res.data);
        setUploadSuccess('Payment proof submitted successfully! Our manager will verify shortly.');
        setCustomerProofFile(null);
      }
    } catch (err) {
      alert('Upload failed');
    }
  };

  // Customer Respond to Substitution (Approve or Reject)
  const handleSubstitutionResponse = async (approved: boolean) => {
    if (!currentBooking) return;
    try {
      const res = await api.respondSubstitution(
        currentBooking.id,
        approved,
        approved ? 'Approved by customer via web portal' : 'Customer declined proposed substitution'
      );
      if (res.success) {
        setCurrentBooking(res.data);
        setSubstitutionActionSuccess(
          approved
            ? 'Substitution approved! Your order has been updated with the replacement.'
            : 'Substitution declined. Our manager has been alerted to provide other options.'
        );
      }
    } catch (err) {
      alert('Failed to submit response');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d0d14] border border-neutral-800 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">
              SELF-SERVICE PORTAL
            </span>
            <h3 className="text-xl font-bold text-white font-heading">
              Track Booking & Substitution Status
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-left max-h-[80vh] overflow-y-auto">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Booking ID (e.g. SR-KOL-1001, SR-123456)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-red-600"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
            >
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Current Booking Display */}
          {currentBooking && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Order Status Banner */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{currentBooking.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                      Domain: {currentBooking.domain}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    {currentBooking.customerName} · {currentBooking.deliveryArea} · {currentBooking.eventDate} ({currentBooking.eventTime})
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-950 text-red-300 border border-red-800">
                    {currentBooking.bookingStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* CRITICAL: Customer Product Substitution Approval Banner */}
              {currentBooking.bookingStatus === 'substitution_requested' && currentBooking.substitutionOffered && (
                <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-600/70 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    <span>Product Substitution Request Pending Your Confirmation</span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    Our team checked inventory for your event. The requested item <strong className="text-red-400">{currentBooking.substitutionOffered.unavailableItem}</strong> is momentarily out of stock. We have proposed replacing it with:
                  </p>

                  <div className="p-3 rounded-xl bg-black/60 border border-amber-800/60 text-xs space-y-1">
                    <p className="text-white font-bold text-sm">
                      Proposed Substitute: <span className="text-emerald-400">{currentBooking.substitutionOffered.offeredItem}</span>
                    </p>
                    <p className="text-neutral-300">
                      Note from Manager: {currentBooking.substitutionOffered.reason}
                    </p>
                    <p className="text-[11px] text-amber-300/80 italic pt-1">
                      *Per our strict policy, no substitution will ever be made without your explicit approval.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSubstitutionResponse(true)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Substitution</span>
                    </button>

                    <button
                      onClick={() => handleSubstitutionResponse(false)}
                      className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-red-300 border border-neutral-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline Substitution</span>
                    </button>
                  </div>
                </div>
              )}

              {substitutionActionSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{substitutionActionSuccess}</span>
                </div>
              )}

              {/* Items in order */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Requested Items ({currentBooking.requestedItems.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentBooking.requestedItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 flex justify-between">
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-neutral-400">{item.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Status & QR Proof Upload */}
              {currentBooking.paymentMethod === 'qr' && (
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Online QR Payment Details
                      </h4>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        currentBooking.paymentStatus === 'verified'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {currentBooking.paymentStatus === 'verified' ? 'Payment Verified ✓' : 'Awaiting Verification'}
                    </span>
                  </div>

                  {/* QR Image loaded from backend */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-36 h-36 bg-white rounded-xl p-2 shrink-0 border border-neutral-700 flex items-center justify-center">
                      {paymentConfig?.qrImageUrl ? (
                        <img
                          src={paymentConfig.qrImageUrl}
                          alt="Active Payment QR"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <QrCode className="w-20 h-20 text-black" />
                      )}
                    </div>

                    <div className="text-xs text-neutral-300 space-y-1.5 flex-1">
                      <p><strong className="text-white">UPI ID:</strong> <span className="font-mono text-amber-300">{paymentConfig?.upiId || 'shisharent@upi'}</span></p>
                      <p><strong className="text-white">Payee:</strong> {paymentConfig?.payeeName || 'Shisha Rent Kolkata'}</p>
                      <p className="text-[11px] text-neutral-400">{paymentConfig?.instructions}</p>
                    </div>
                  </div>

                  {/* Upload payment screenshot / reference */}
                  <form onSubmit={handleUploadProof} className="pt-2 border-t border-neutral-900 space-y-3">
                    <p className="text-xs font-semibold text-neutral-200">
                      Already paid? Upload your transaction screenshot or reference number:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="UPI UTR / Reference No. (e.g. 426189...)"
                        value={txRef}
                        onChange={(e) => setTxRef(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs font-mono"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setCustomerProofFile(e.target.files[0]);
                        }}
                        className="w-full text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Submit Payment Proof for Verification
                      </button>
                    </div>
                  </form>

                  {uploadSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300">
                      {uploadSuccess}
                    </div>
                  )}
                </div>
              )}

              {/* Direct WhatsApp help button */}
              <div className="pt-2 text-center">
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Shisha%20Rent%2C%20inquiry%20regarding%20booking%20${currentBooking.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Need urgent update? Contact Kolkata operations on WhatsApp</span>
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
