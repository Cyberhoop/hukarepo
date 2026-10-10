import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Send,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { CONTACT_INFO } from '../data/productsData';
import { useNavigation } from '../context/NavigationContext';

export const ContactPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [service, setService] = useState('Hookah Rental');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const zones = [
    { name: 'South Kolkata (Alipore, Ballygunge, Gariahat)', eta: '30–45 mins' },
    { name: 'Central Kolkata (Park Street, Camac Street)', eta: '30–45 mins' },
    { name: 'East Kolkata (Salt Lake, Sector V, New Town)', eta: '40–55 mins' },
    { name: 'EM Bypass, Ruby & Jadavpur', eta: '35–50 mins' },
    { name: 'North Kolkata & Shyambazar', eta: '45–60 mins' },
    { name: 'Howrah, Shibpur & Riverfront', eta: '45–60 mins' },
  ];

  const faqs = [
    {
      q: 'Do you provide charcoal, burner and accessories with the hookah?',
      a: 'Yes, every rental package is 100% turnkey. We provide the complete set: heavy glass hookah, clay bowl, heat management device, washable silicon hose, electric coal burner, tongs, and 1kg of premium natural coconut coals.',
    },
    {
      q: 'How does pickup work after my event ends?',
      a: 'Zero cleaning is required on your part! Our delivery team returns the following morning or afternoon at a pre-arranged time to collect all hardware and safely settle your security deposit.',
    },
    {
      q: 'Are the mouthpieces sanitized and hygienic?',
      a: 'Absolutely. We practice hospital-grade hygiene. Every glass vase and stem is ultrasonically sanitized before dispatch. All mouthpieces are individually sealed, sterile, and single-use.',
    },
    {
      q: 'Can we order late at night for rooftop or house parties?',
      a: 'Yes! Our late-night delivery desk operates until 4:00 AM across Kolkata on weekends and holidays. Typical dispatch time is between 45 and 60 minutes.',
    },
    {
      q: 'What is the age requirement?',
      a: 'In accordance with local regulations, customers must be at least 21 years of age. A valid government photo ID is verified at the time of delivery.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const waText = `Hi Shisha Rent Kolkata, my name is ${name} (${phone}). I would like to inquire about ${service} for ${date || 'tonight'}. Note: ${message}`;
    window.open(
      `https://wa.me/91${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`,
      '_blank'
    );
  };

  return (
    <div className="py-6 sm:py-10 space-y-12">
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
          <span className="text-white font-medium">Contact & Location</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-900">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-[2px] w-5 bg-red-600"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                24/7 CONCIERGE DESK
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Contact & Coverage Zones
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
            Direct hotline, WhatsApp concierge, and 60-minute delivery coverage across the entire Kolkata metropolitan area.
          </p>
        </div>
      </div>

      {/* Contact Cards & Form Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info & Zones (col-span-5) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-6 rounded-2xl bg-[#0b0b12] border border-neutral-800 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-white font-heading">
                Direct Contact Channels
              </h3>

              <div className="space-y-3 text-xs">
                <a
                  href={`tel:+91${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Phone Hotline</div>
                    <div className="text-neutral-400 tabular-nums">{CONTACT_INFO.phone}</div>
                  </div>
                </a>

                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/40 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-emerald-200">WhatsApp Concierge</div>
                    <div className="text-emerald-400/80">Instant booking & live photo chat</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Operating Hours</div>
                    <div className="text-neutral-400">{CONTACT_INFO.hours} (Late night till 4 AM)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Main Kolkata Hub</div>
                    <div className="text-neutral-400">{CONTACT_INFO.city} (Central & Suburban Hubs)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Zones */}
            <div className="p-6 rounded-2xl bg-[#0b0b12] border border-neutral-800 space-y-3 shadow-xl">
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
                Kolkata Delivery Reach & ETA
              </h3>
              <div className="divide-y divide-neutral-900 text-xs">
                {zones.map((z, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="text-neutral-300">{z.name}</span>
                    <span className="font-semibold text-amber-400 tabular-nums">{z.eta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form & FAQs (col-span-7) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0b12] border border-neutral-800 shadow-xl space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">
                  QUICK INQUIRY
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-neutral-400">
                  Fill in your details below to dispatch your booking inquiry directly to our priority desk.
                </p>
              </div>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs text-center space-y-2">
                  <div className="font-bold text-sm">Thank You for Inquiring!</div>
                  <p>Our Kolkata event desk has received your request and will reach out shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sen"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98300 XXXXX"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">
                        Service Needed
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-600"
                      >
                        <option value="Hookah Rental">Hookah Rental (1 Night)</option>
                        <option value="Rooftop Party Pack">Rooftop Party Pack (2+ Hookahs)</option>
                        <option value="Bartender & Mixologist">Flair Bartender & Mixologist</option>
                        <option value="Private Chef">Private Event Cook & BBQ</option>
                        <option value="Wedding Shisha Lounge">Wedding / Sangeet Lounge</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Event Address & Special Notes
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mention your Kolkata locality (e.g. Salt Lake Block BD, Alipore), guests count, or flavour preferences..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to WhatsApp Concierge</span>
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Accordion */}
            <div className="p-6 rounded-2xl bg-[#0b0b12] border border-neutral-800 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-red-500" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-neutral-800/80 rounded-xl overflow-hidden bg-neutral-950/60"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left font-semibold text-white flex items-center justify-between hover:text-red-400 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-500 transition-transform ${
                            isOpen ? 'rotate-180 text-red-500' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 text-neutral-400 leading-relaxed pt-1 border-t border-neutral-900">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
