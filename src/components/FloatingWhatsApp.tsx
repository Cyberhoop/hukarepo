import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Phone } from 'lucide-react';
import { useContact } from '../context/ContactContext';

export const FloatingWhatsApp: React.FC = () => {
  const { contactConfig, getWhatsAppLink } = useContact();
  const [isOpen, setIsOpen] = useState(false);
  const [quickMsg, setQuickMsg] = useState(
    'Hi Shisha Rent Kolkata, I would like to book hookah / party services.'
  );

  const phoneCallUrl = `tel:${(contactConfig.phone || '+919876543210').replace(/[^0-9+]/g, '')}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Mini Chat Popup */}
      {isOpen && (
        <div className="mb-1 w-72 sm:w-80 rounded-2xl bg-[#0e0e16] border border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-left">
          <div className="p-3.5 bg-gradient-to-r from-emerald-900/90 to-emerald-950 border-b border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow">
                SR
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Shisha Rent Concierge</span>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </div>
                <div className="text-[10px] text-emerald-200">
                  Online · {contactConfig.whatsappNumber || contactConfig.phone}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 space-y-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
              Welcome to Shisha Rent {contactConfig.city}! Need hookahs, pre-filled chillums, coconut coal, or bartenders delivered tonight?
            </div>

            <textarea
              rows={2}
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
            />

            <div className="space-y-2">
              <a
                href={getWhatsAppLink(quickMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Start WhatsApp Chat</span>
              </a>

              <a
                href={phoneCallUrl}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>Call Helpline Directly</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Triggers: Direct Call + WhatsApp */}
      <div className="flex items-center gap-2">
        <a
          href={phoneCallUrl}
          aria-label="Call Shisha Rent Helpline Directly"
          className="flex items-center gap-2 px-3.5 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-red-950/60 border border-red-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Phone className="w-4 h-4 text-white shrink-0" />
          <span className="hidden sm:inline">Call Helpline</span>
        </a>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open WhatsApp Concierge"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 border border-emerald-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-current shrink-0" />
          <span className="hidden sm:inline">WhatsApp Concierge</span>
        </button>
      </div>
    </div>
  );
};
