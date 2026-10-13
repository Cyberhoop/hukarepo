import React, { useState } from 'react';
import { QrCode, ZoomIn, Download, Copy, Check, X, Sparkles } from 'lucide-react';
import { PaymentConfig } from '../services/api';

interface UpiQrShowcaseProps {
  paymentConfig: PaymentConfig | null;
  compact?: boolean;
}

export const UpiQrShowcase: React.FC<UpiQrShowcaseProps> = ({
  paymentConfig,
  compact = false,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const upiId = paymentConfig?.upiId || 'shisharent@upi';
  const payeeName = paymentConfig?.payeeName || 'Shisha Rent Kolkata';
  const qrImageUrl = paymentConfig?.qrImageUrl || '';
  const instructions =
    paymentConfig?.instructions ||
    'Scan with any UPI App (GPay, PhonePe, Paytm, BHIM). Share transaction screenshot for instant priority confirmation.';

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadQr = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `ShishaRent_UPI_QR_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="rounded-2xl bg-[#0a0a10] border border-amber-500/30 p-4 sm:p-5 space-y-4 shadow-xl">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Official UPI QR Payment</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-700/50 text-[10px] font-bold text-emerald-300">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>All UPI Apps Supported</span>
          </span>
        </div>

        {/* Full-Aspect QR Poster Display */}
        <div className="flex flex-col items-center space-y-3">
          <div
            onClick={() => qrImageUrl && setIsZoomOpen(true)}
            className={`relative group mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-[#07070b] shadow-2xl shadow-black/90 transition-all ${
              qrImageUrl ? 'cursor-zoom-in hover:border-amber-400' : ''
            } ${
              compact
                ? 'w-full max-w-[260px] sm:max-w-[280px]'
                : 'w-full max-w-[290px] sm:max-w-[330px]'
            }`}
          >
            {qrImageUrl ? (
              <div className="relative w-full flex items-center justify-center bg-[#07070b] p-2">
                <img
                  src={qrImageUrl}
                  alt={`${payeeName} Official UPI QR Code`}
                  className="w-full h-auto max-h-[440px] object-contain rounded-xl select-none"
                />
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-semibold text-amber-300 flex items-center gap-1.5 shadow-lg opacity-95 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tap to Zoom</span>
                </div>
              </div>
            ) : (
              /* High-contrast Vector QR Fallback when no custom image is uploaded */
              <div className="bg-white p-5 rounded-xl flex flex-col items-center justify-center w-60 h-60 mx-auto my-2">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="24" height="24" fill="black" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" fill="black" />
                  <rect x="66" y="10" width="24" height="24" fill="black" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" fill="black" />
                  <rect x="10" y="66" width="24" height="24" fill="black" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" fill="black" />
                  <rect x="42" y="15" width="8" height="8" fill="black" />
                  <rect x="52" y="25" width="8" height="8" fill="black" />
                  <rect x="42" y="42" width="16" height="16" fill="black" />
                  <rect x="65" y="45" width="10" height="10" fill="black" />
                  <rect x="45" y="70" width="14" height="8" fill="black" />
                  <rect x="65" y="68" width="15" height="15" fill="black" />
                  <rect x="25" y="45" width="8" height="12" fill="black" />
                </svg>
              </div>
            )}
          </div>

          {/* Interactive QR Action Buttons: Zoom + Download + Copy UPI ID */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
            {qrImageUrl && (
              <>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Screen QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download QR</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleCopyUpi}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedUpi ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">UPI ID Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy UPI ID</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Merchant & VPA Details */}
        <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs space-y-1.5 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="text-neutral-400">Merchant / Payee:</span>
            <span className="font-bold text-white">{payeeName}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-neutral-400">UPI ID (VPA):</span>
            <span className="font-mono font-bold text-amber-300 tabular-nums select-all">
              {upiId}
            </span>
          </div>
          {instructions && (
            <p className="text-[11px] text-neutral-400 pt-1.5 border-t border-neutral-800/80 leading-relaxed">
              {instructions}
            </p>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for Crystal-Clear Scanning */}
      {isZoomOpen && qrImageUrl && (
        <div
          className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#0b0b12] border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="text-left">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Scan with Any UPI App
                </div>
                <div className="text-sm font-bold text-white">{payeeName}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#050508] rounded-xl p-2 border border-neutral-800 flex items-center justify-center">
              <img
                src={qrImageUrl}
                alt="Fullscreen UPI QR Code"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-left text-xs">
                <span className="text-neutral-400 block text-[10px]">UPI ID:</span>
                <span className="font-mono font-bold text-amber-300">{upiId}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
