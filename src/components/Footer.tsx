import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Shield, Search, ExternalLink } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useContact } from '../context/ContactContext';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenBooking,
  onOpenAdmin,
}) => {
  const { navigateTo } = useNavigation();
  const { contactConfig, getWhatsAppLink } = useContact();

  return (
    <footer id="contact" className="bg-[#050508] border-t border-neutral-900 pt-14 sm:pt-16 pb-12 text-neutral-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Brand & Overview (col-span-4) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center text-left cursor-pointer"
              aria-label="Shisha Rent Home"
            >
              <BrandLogo size="md" />
            </button>

            <p className="text-neutral-400 leading-relaxed text-xs">
              Kolkata's premier luxury hookah rental and hospitality event provider. Supplying authentic flavour brands, crystal Bohemian hookahs, professional mixologists and gourmet chefs for private parties, birthdays, bachelors, and weddings.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/50 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {contactConfig.whatsappNumber || contactConfig.phone}</span>
              </a>

              {contactConfig.instagramUrl && (
                <a
                  href={contactConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-red-400" />
                </a>
              )}

              {contactConfig.facebookUrl && (
                <a
                  href={contactConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </a>
              )}
            </div>
          </div>

          {/* Multi-Page Navigation (col-span-2) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Explore Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Marketplace Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('services')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Event & Bar Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  About Us & Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('gallery')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-red-400 transition-colors text-left font-semibold text-white"
                >
                  My Account & Orders (Client Panel)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('track')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Search className="w-3 h-3 text-amber-400" />
                  <span>Track Booking Status</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Contact & Coverage
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-red-400 transition-colors text-left flex items-center gap-1.5 text-neutral-400 hover:text-white"
                >
                  <Shield className="w-3.5 h-3.5 text-red-500" />
                  <span>Admin Management Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Products & Flavours Highlight (col-span-3) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Categories
            </h4>
            <div className="space-y-1.5 text-xs">
              <div>
                <button
                  onClick={() => navigateTo('products', 'hookah-bases')}
                  className="hover:text-red-400 transition-colors text-left text-neutral-300"
                >
                  · Hookah & Bohemian Glass Bases
                </button>
              </div>
              <div>
                <button
                  onClick={() => navigateTo('products', 'flavours')}
                  className="hover:text-red-400 transition-colors text-left text-neutral-300"
                >
                  · 15+ Exotic Flavour Brands
                </button>
              </div>
              <div>
                <button
                  onClick={() => navigateTo('products', 'chilam')}
                  className="hover:text-red-400 transition-colors text-left text-neutral-300"
                >
                  · Clay & Glazed Chilam Bowls
                </button>
              </div>
              <div>
                <button
                  onClick={() => navigateTo('products', 'pipes')}
                  className="hover:text-red-400 transition-colors text-left text-neutral-300"
                >
                  · Washable Silicone Hoses
                </button>
              </div>
              <div>
                <button
                  onClick={() => navigateTo('products', 'coal-accessories')}
                  className="hover:text-red-400 transition-colors text-left text-neutral-300"
                >
                  · 100% Coconut Charcoal & Burners
                </button>
              </div>
              <div>
                <button
                  onClick={() => navigateTo('services')}
                  className="hover:text-red-400 transition-colors text-left text-neutral-300"
                >
                  · Bartenders & Live Party Cooks
                </button>
              </div>
            </div>
            <div className="pt-2 text-neutral-400 text-[11px] leading-relaxed">
              Serving Maya, Coco Aaya, Amy Deluxe, Starbuzz, Al Fakher, and Afzal blends.
            </div>
          </div>

          {/* Contact & Kolkata Coverage (col-span-3) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              {contactConfig.city} Service Hub
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  {contactConfig.address && (
                    <div className="text-neutral-200 font-medium leading-snug">
                      {contactConfig.address}
                    </div>
                  )}
                  <span className="text-neutral-400 leading-snug block">
                    {contactConfig.areasServed}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <div className="flex flex-wrap items-center gap-2">
                  <a href={`tel:${contactConfig.phone.replace(/\s+/g, '')}`} className="hover:text-white tabular-nums">
                    {contactConfig.phone}
                  </a>
                  {contactConfig.secondaryPhone && (
                    <>
                      <span className="text-neutral-600">/</span>
                      <a
                        href={`tel:${contactConfig.secondaryPhone.replace(/\s+/g, '')}`}
                        className="hover:text-white tabular-nums text-neutral-400"
                      >
                        {contactConfig.secondaryPhone}
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${contactConfig.email}`} className="hover:text-white">
                  {contactConfig.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-amber-400/90">{contactConfig.hours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Legal Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 text-center sm:text-left">
          <div className="space-y-1">
            <p>© 2026 Shisha Rent Kolkata. All rights reserved.</p>
            <p className="text-[11px] text-neutral-600">
              Disclaimer: Hookah equipment rental is intended for adults aged 21+ only. 100% tobacco-free herbal shisha options are available upon customer request.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onOpenTerms}
              className="text-neutral-400 hover:text-white underline cursor-pointer text-xs"
            >
              Terms & Customer Choice Policy
            </button>
            <button
              onClick={onOpenBooking}
              className="px-3.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-semibold cursor-pointer"
            >
              Book Online
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
