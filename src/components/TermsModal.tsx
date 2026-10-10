import React from 'react';
import { X, ShieldAlert, CheckCircle, Scale } from 'lucide-react';
import { CUSTOMER_POLICY } from '../data/productsData';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d0d14] border border-neutral-800 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-bold text-white font-heading">
              Terms & Conditions & Booking Policy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-left max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-neutral-300 leading-relaxed">
          
          {/* 1. Mandatory Customer Request & Availability Clause */}
          <div className="p-4 sm:p-5 rounded-xl bg-red-950/20 border border-red-800/60 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-xs">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>1. Customer Choice & Product Availability Policy (Mandatory Clause)</span>
            </div>

            <p className="text-neutral-200 font-medium">
              {CUSTOMER_POLICY.ruleHindiEnglish}
            </p>

            <p className="text-neutral-300">
              {CUSTOMER_POLICY.exampleExplanation}
            </p>

            <div className="p-3 rounded-lg bg-black/60 border border-red-900 text-neutral-100 font-semibold text-xs">
              <span className="text-red-400">Strict Operating Rule: </span>
              {CUSTOMER_POLICY.guaranteeRule}
            </div>
          </div>

          {/* 2. Age Requirement */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-500" />
              <span>2. Age Requirement & Identification</span>
            </h4>
            <p className="text-neutral-400 text-xs pl-6">
              Hookah rental services are strictly reserved for adults aged 18 and older. Valid government photo identification may be requested upon equipment delivery.
            </p>
          </div>

          {/* 3. Delivery & Setup Timing */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-500" />
              <span>3. Delivery, Setup & Doorstep Service</span>
            </h4>
            <p className="text-neutral-400 text-xs pl-6">
              Our delivery executives deliver sanitized hookahs, bowls, and coal accessories across all major areas of Kolkata. We test draw quality and assist with electric coil burner operation.
            </p>
          </div>

          {/* 4. Equipment Care & Safety */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-500" />
              <span>4. Equipment Care & Glass Base Safety</span>
            </h4>
            <p className="text-neutral-400 text-xs pl-6">
              Customers are requested to place the hookah on a stable flat floor or provided protective stand. In case of accidental glass base breakage or equipment loss, standard replacement cost will be charged.
            </p>
          </div>

          {/* 5. Payment Methods (COD & QR) */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-500" />
              <span>5. Payment Modes & Security Deposit</span>
            </h4>
            <p className="text-neutral-400 text-xs pl-6">
              We accept Cash on Delivery (COD) and Online UPI QR Code payments (GPay, PhonePe, Paytm). Any applicable security deposit will be refunded immediately upon equipment pickup.
            </p>
          </div>

          {/* 6. Pickup & Cleanliness */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-500" />
              <span>6. Pickup Protocol</span>
            </h4>
            <p className="text-neutral-400 text-xs pl-6">
              Our staff will pick up the hookah apparatus at the agreed-upon time. The customer is NOT required to clean or wash the apparatus; our sanitation team handles all sterilization post-event.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
