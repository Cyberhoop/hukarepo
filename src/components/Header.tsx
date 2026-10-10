import React, { useState } from 'react';
import { MessageCircle, Calendar, Menu, X, Shield, Search, ShoppingBag, User } from 'lucide-react';
import { CONTACT_INFO } from '../data/productsData';
import { useCart } from '../context/CartContext';
import { useNavigation, PageId } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
  currentDomain?: string;
  onSelectDomain?: (domain: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenAdmin,
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { currentPage, navigateTo } = useNavigation();
  const { user, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageId }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Marketplace', page: 'products' },
    { label: 'Services', page: 'services' },
    { label: 'About Us', page: 'about' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Track Order', page: 'track' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden bg-[#070709]/95 backdrop-blur-md border-b border-neutral-900 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-4 min-w-0">
          
          {/* Brand Wordmark & Emblem */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center group shrink-0 cursor-pointer text-left min-w-0"
            aria-label="Shisha Rent Home"
          >
            <BrandLogo size="md" />
          </button>

          {/* Clean Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`transition-colors duration-150 py-1 relative group whitespace-nowrap shrink-0 cursor-pointer text-sm ${
                    isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-red-600 transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Account + Track + Cart + Admin + Book Now (sm+) + Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Customer Login / My Account Button */}
            {user ? (
              <button
                onClick={() => navigateTo('account')}
                title="Open My Account & Orders"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === 'account'
                    ? 'bg-red-600/20 border-red-500 text-white'
                    : 'bg-neutral-900/90 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-red-600 to-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[68px] sm:max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Login</span>
              </button>
            )}

            {/* Quick Track Icon */}
            <button
              onClick={() => navigateTo('track')}
              title="Track Booking Status"
              className={`hidden sm:flex p-2 rounded-lg border transition-colors cursor-pointer ${
                currentPage === 'track'
                  ? 'text-amber-400 bg-neutral-900 border-amber-500/50'
                  : 'text-neutral-400 hover:text-amber-400 hover:bg-neutral-900 border-neutral-800/80'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              title="View Cart"
              className="relative p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800/80 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Admin Key Icon */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className="hidden sm:flex p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-900 border border-neutral-800/80 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* WhatsApp Contact */}
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-600/40 hover:border-emerald-500/80 hover:bg-emerald-900/30 transition-all text-xs font-semibold text-emerald-300 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Primary CTA (Visible on sm+ in header; on mobile surfaced in Hero, Sticky Bar & Drawer) */}
            <button
              onClick={onOpenBooking}
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-red-700/30 hover:shadow-red-600/40 transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 shrink-0" />
              <span>Book Now</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-900 bg-[#0b0b10] px-4 pt-3 pb-5 space-y-3 animate-in fade-in duration-150">
          {/* Primary Book Now CTA for Mobile */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Hookah & Event Setup Now</span>
          </button>

          {/* Mobile Account Row */}
          <div className="pb-2 border-b border-neutral-900">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('account');
                }}
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{user.name}</div>
                    <div className="text-[11px] text-amber-400">Open My Account & Orders →</div>
                  </div>
                </div>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="py-2.5 rounded-lg bg-neutral-900 text-white border border-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="py-2.5 rounded-lg bg-neutral-900 text-white border border-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo(link.page);
                }}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                  currentPage === link.page
                    ? 'bg-neutral-900 text-red-400 border-red-900/60 font-bold'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white border-neutral-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-900 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('track');
              }}
              className="py-2.5 rounded-lg bg-neutral-900 text-amber-400 border border-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="py-2.5 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
