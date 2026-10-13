import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    authCheckoutReason,
    closeAuthModal,
    login,
    register,
    loginWithGoogle,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);
  const [showGoogleFlow, setShowGoogleFlow] = useState(false);

  // Login State
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [area, setArea] = useState(KOLKATA_AREAS[0]);
  const [addressLine, setAddressLine] = useState('');

  // Google Sign-In State
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googlePhone, setGooglePhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setActiveTab(authModalTab);
    setShowGoogleFlow(false);
    setErrorMsg('');
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await login(identifier, loginPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign in');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      area,
      addressLine,
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account');
    }
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginWithGoogle({
      email: googleEmail,
      name: googleName,
      phone: googlePhone,
      area,
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Google authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c0c14] border border-neutral-800 shadow-2xl overflow-hidden my-4">
        {/* Top Accent Banner */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-neutral-800/80 bg-neutral-950/60">
          <div className="text-left pr-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Sparkles className="w-3 h-3" />
              <span>SHISHA RENT KOLKATA ACCOUNT</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
              {showGoogleFlow
                ? 'Continue with Google (Gmail)'
                : activeTab === 'login'
                ? 'Welcome Back'
                : 'Create Your Account'}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Manage your active bookings, reorder in 1 click & save Kolkata delivery addresses.
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flipkart-style Checkout Gate Notice */}
        {authCheckoutReason && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5 text-left">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Account Required to Place Order</strong>
              <span>{authCheckoutReason}</span>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-xl bg-red-950/70 border border-red-700/60 text-xs text-red-200 flex items-center justify-between gap-2 text-left">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-red-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-5 text-left max-h-[78vh] overflow-y-auto">
          {/* Tabs (Sign In vs Create Account) */}
          {!showGoogleFlow && (
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Continue with Google Button */}
          {!showGoogleFlow ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleFlow(true);
                  setErrorMsg('');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 20.9 7.4 24 12 24z"
                  />
                </svg>
                <span>Continue with Google / Gmail</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-neutral-800 w-full" />
                <span className="bg-[#0c0c14] px-3 text-[10px] uppercase tracking-widest text-neutral-500 shrink-0">
                  or with email / phone
                </span>
                <div className="border-t border-neutral-800 w-full" />
              </div>
            </div>
          ) : (
            /* Google / Gmail Instant Sign-In Form */
            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 20.9 7.4 24 12 24z"
                    />
                  </svg>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Google / Gmail Account Sign-In</div>
                  <div className="text-neutral-400">Instant 1-step login or registration with your Gmail address</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Gmail / Google Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Rohan Chatterjee"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  WhatsApp / Contact Number (for Kolkata dispatch)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98300 XXXXX"
                    value={googlePhone}
                    onChange={(e) => setGooglePhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowGoogleFlow(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Signing in...' : 'Continue with Gmail'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Standard Sign In Form */}
          {!showGoogleFlow && activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Email Address or Phone Number *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your email or 10-digit phone number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to My Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Create Account Form */}
          {!showGoogleFlow && activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sourav Ganguly"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    WhatsApp Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98300 XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={4}
                    placeholder="Minimum 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Default Kolkata Delivery Area
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-red-500 absolute left-3.5 top-3" />
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-red-600 mb-2"
                  >
                    {KOLKATA_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Optional: Apartment / House / Landmark for fast checkout"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900/70 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Continue'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
