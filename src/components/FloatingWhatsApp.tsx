import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { CONTACT_INFO } from '../data/productsData';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMsg, setQuickMsg] = useState('Hi Shisha Rent, I want to book a hookah and inquire about available flavours for tonight in Kolkata.');

  const handleSend = () => {
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(quickMsg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-16 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-80 rounded-2xl bg-[#0e0e16] border border-neutral-800 shadow-2xl p-4 text-left animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Shisha Rent Support</h4>
                <p className="text-[10px] text-emerald-400">Online 24/7 for Bookings</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-neutral-300">
            <p className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 leading-relaxed">
              Namaste! Need instant hookah delivery in Kolkata? Chat directly with our manager to request specific flavours, hookahs, or bartender services.
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              rows={2}
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(quickMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-900/50 hover:scale-105 transition-all cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-bold text-white items-center justify-center">1</span>
        </span>
        <MessageCircle className="w-7 h-7 fill-current drop-shadow" />
      </button>

    </div>
  );
};
