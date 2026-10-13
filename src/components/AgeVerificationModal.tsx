import React, { useState, useEffect } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

const AGE_VERIFIED_STORAGE_KEY = 'sr_age_verified_18_plus';

export const AgeVerificationModal: React.FC = () => {
  const [status, setStatus] = useState<'pending' | 'verified' | 'denied'>(() => {
    try {
      const saved = localStorage.getItem(AGE_VERIFIED_STORAGE_KEY);
      if (saved === 'verified') return 'verified';
    } catch {
      // ignore storage errors
    }
    return 'pending';
  });

  useEffect(() => {
    if (status !== 'verified') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [status]);

  const handleConfirmOver18 = () => {
    try {
      localStorage.setItem(AGE_VERIFIED_STORAGE_KEY, 'verified');
      document.cookie = `${AGE_VERIFIED_STORAGE_KEY}=verified; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } catch {
      // ignore storage errors
    }
    setStatus('verified');
  };

  const handleUnder18 = () => {
    try {
      localStorage.removeItem(AGE_VERIFIED_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    setStatus('denied');
  };

  if (status === 'verified') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-verification-title"
    >
      <div className="w-full max-w-[540px] rounded-2xl bg-white px-6 py-10 sm:px-12 sm:py-14 text-center shadow-[0_25px_70px_rgba(0,0,0,0.75)] transition-all">
        {status === 'pending' ? (
          <div className="space-y-6">
            <h2
              id="age-verification-title"
              className="text-3xl sm:text-[40px] font-bold text-[#e60000] leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Are you over 18?
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md mx-auto font-normal">
              You must be 18 years of age or older to view page.
              <br />
              Please verify your age to enter.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <button
                type="button"
                onClick={handleConfirmOver18}
                className="w-full sm:w-auto min-w-[165px] px-7 py-3.5 rounded-lg bg-[#e60000] hover:bg-[#cc0000] active:scale-[0.99] text-white text-sm sm:text-[15px] font-bold tracking-wide shadow-md transition-all cursor-pointer"
              >
                I am 18 or Older
              </button>

              <button
                type="button"
                onClick={handleUnder18}
                className="w-full sm:w-auto min-w-[155px] px-7 py-3.5 rounded-lg bg-[#e60000] hover:bg-[#cc0000] active:scale-[0.99] text-white text-sm sm:text-[15px] font-bold tracking-wide shadow-md transition-all cursor-pointer"
              >
                I am Under 18
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-[#e60000]">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <h2
              className="text-2xl sm:text-3xl font-bold text-[#e60000]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Access Restricted (18+ Only)
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md mx-auto">
              Sorry, you must be 18 years of age or older to access Shisha Rent Kolkata. Hookah and shisha rental services are strictly prohibited for minors.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clicked by mistake? Verify Age Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
