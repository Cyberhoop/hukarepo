import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Check,
  MessageCircle,
  Calendar,
  ShoppingBag,
  Info,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { CONTACT_INFO, ProductItem } from '../data/productsData';
import { useCart } from '../context/CartContext';

interface ChillumFlavourBookingConfiguratorProps {
  onOpenBookingWithConfig: (configuredItem: {
    flavourName: string;
    chillumType: 'classic_clay' | 'gold_silicon';
    chillumPrice: number;
    wantsBase: boolean;
    baseType?: string;
    basePrice?: number;
    totalPrice: number;
  }) => void;
}

export interface FlavourProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  hardness: number; // out of 10
  freshness: number; // out of 10
  fruity: number; // out of 10
  image: string;
}

export const FLAVOUR_PROFILES: FlavourProfile[] = [
  {
    id: 'dark-rose',
    name: 'SR Dark Rose',
    tagline: 'Deep Floral & Velvety Smooth',
    description:
      'Enter a world of rich florals with Shisha Rent Kolkata’s signature Dark Rose Flavoured Chillum — an intense, aromatic rose blend with subtle earthy undertones that feels elegant, soothing, and luxuriously smooth.',
    hardness: 7,
    freshness: 8,
    fruity: 0,
    image: '/src/assets/images/flavour_paan_collection_1791655854763.jpg',
  },
  {
    id: 'meetha-paan',
    name: 'Kolkata Meetha Paan',
    tagline: 'Sweet Betel Leaf, Gulkand & Mint',
    description:
      'The authentic taste of Kolkata evenings. Infused with sweet gulkand, crushed cardamom, and refreshing menthol chill. Dense, aromatic clouds with long-lasting flavour retention.',
    hardness: 6,
    freshness: 9,
    fruity: 3,
    image: '/src/assets/images/flavour_paan_collection_1791655854763.jpg',
  },
  {
    id: 'brainfreezer-rose',
    name: 'Brainfreezer Gum Rose',
    tagline: 'Sub-Zero Icy Blast & Sweet Rose',
    description:
      'Our most requested party blend. An icy spearmint rush combined with sweet Damascus rose. Creates ultra-dense, refreshing cool clouds ideal for terrace and late-night gatherings.',
    hardness: 8,
    freshness: 10,
    fruity: 2,
    image: '/src/assets/images/category_flavours_1791648613614.jpg',
  },
  {
    id: 'blueberry-blast',
    name: 'Blueberry Mint Blast',
    tagline: 'Ripe Wild Berries & Arctic Frost',
    description:
      'Bursting with rich antioxidant blueberry syrup and crisp arctic mint. Perfect for social chills and prolonged group sessions without any harsh throat tickle.',
    hardness: 5,
    freshness: 8,
    fruity: 9,
    image: '/src/assets/images/category_flavours_1791648613614.jpg',
  },
  {
    id: 'double-apple',
    name: 'Double Apple Anise',
    tagline: 'Traditional Middle Eastern Royalty',
    description:
      'For true shisha connoisseurs. Traditional red and green crisp apples blended with licorice-spiced star anise. Thick, heavy clouds with an authentic lounge punch.',
    hardness: 9,
    freshness: 6,
    fruity: 7,
    image: '/src/assets/images/category_flavours_1791648613614.jpg',
  },
];

export const ChillumFlavourBookingConfigurator: React.FC<
  ChillumFlavourBookingConfiguratorProps
> = ({ onOpenBookingWithConfig }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedFlavour, setSelectedFlavour] = useState<FlavourProfile>(
    FLAVOUR_PROFILES[0]
  );
  const [selectedChillum, setSelectedChillum] = useState<
    'classic_clay' | 'gold_silicon'
  >('gold_silicon');
  const [wantsBase, setWantsBase] = useState<boolean>(false);
  const [selectedBaseType, setSelectedBaseType] = useState<
    'bohemian' | 'russian_alpha'
  >('bohemian');
  const [addedToast, setAddedToast] = useState(false);

  // Prices per exact screenshot notes:
  // Classic Clay = Rs. 600
  // Gold Silicon Cloud = Rs. 700
  const chillumPrice = selectedChillum === 'classic_clay' ? 600 : 700;
  const basePrice = wantsBase
    ? selectedBaseType === 'bohemian'
      ? 399
      : 499
    : 0;
  const totalPrice = chillumPrice + basePrice;

  // Prepare custom item for cart
  const handleAddToCart = () => {
    const configuredProduct: ProductItem = {
      id: `configured-${selectedFlavour.id}-${selectedChillum}-${wantsBase ? selectedBaseType : 'no-base'}`,
      name: `${selectedFlavour.name} (${
        selectedChillum === 'classic_clay' ? 'Classic Clay' : 'Gold Silicon Cloud'
      }${wantsBase ? ` + ${selectedBaseType === 'bohemian' ? 'Bohemian Base' : 'Russian Alpha Base'}` : ''})`,
      category: 'chilam',
      categoryLabel: 'Pre-filled Ready Chillum',
      type: 'Ready-to-Smoke Setup',
      brand: 'Shisha Rent Kolkata',
      price: totalPrice,
      description: `${selectedFlavour.tagline}. Chillum: ${
        selectedChillum === 'classic_clay' ? 'Classic Clay (₹600)' : 'Gold Silicon Cloud (₹700)'
      }. Hookah Base: ${wantsBase ? `Included (${selectedBaseType === 'bohemian' ? 'Bohemian Glass +₹399' : 'Russian Alpha +₹499'})` : 'No (Pre-filled Chillum Only)'}.`,
      inStock: true,
      rentalOrSale: 'Available for Rental & Setup',
      rating: 5.0,
      reviewsCount: 142,
      images: [selectedFlavour.image],
      specs: {
        'Chillum Type':
          selectedChillum === 'classic_clay' ? 'Handcrafted Clay' : 'Gold Silicon Lotus',
        'Flavour Blend': selectedFlavour.name,
        'Base Included': wantsBase ? 'Yes (Complete Setup)' : 'No (Chillum Delivery Only)',
        'Hardness': `${selectedFlavour.hardness}/10`,
        'Freshness': `${selectedFlavour.freshness}/10`,
      },
    };

    addToCart(configuredProduct, 1, true);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      setIsCartOpen(true);
    }, 800);
  };

  const handleBookNow = () => {
    onOpenBookingWithConfig({
      flavourName: selectedFlavour.name,
      chillumType: selectedChillum,
      chillumPrice,
      wantsBase,
      baseType: wantsBase
        ? selectedBaseType === 'bohemian'
          ? 'Bohemian Cut-Glass Base'
          : 'Russian Alpha Matte Base'
        : undefined,
      basePrice,
      totalPrice,
    });
  };

  // WhatsApp prefilled message
  const waMessage = `Hi Shisha Rent Kolkata, I want to book:
· Flavour: ${selectedFlavour.name}
· Chillum: ${selectedChillum === 'classic_clay' ? 'Classic Clay (₹600)' : 'Gold Silicon Cloud (₹700)'}
· Hookah Base: ${wantsBase ? `Yes (${selectedBaseType === 'bohemian' ? 'Bohemian Glass +₹399' : 'Russian Alpha +₹499'})` : 'No (Chillum Only)'}
· Total Amount: ₹${totalPrice} (Taxes Included)
Please confirm delivery slot for tonight!`;

  return (
    <div className="bg-gradient-to-b from-[#0e0e16] via-[#09090f] to-[#070709] border border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-2xl relative overflow-hidden min-w-0">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 text-left relative z-10 min-w-0">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-[2px] w-5 bg-red-600 shrink-0"></span>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
              CUSTOM FLAVOUR & CHILLUM BOOKING
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            Pre-Filled Ready Chillum & Setup
          </h2>
        </div>

        {/* Flavour switcher pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto max-w-full">
          {FLAVOUR_PROFILES.map((flv) => (
            <button
              key={flv.id}
              onClick={() => setSelectedFlavour(flv)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedFlavour.id === flv.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {flv.name.replace('SR ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left details + Right configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 pt-6 sm:pt-8 items-start relative z-10 min-w-0">
        
        {/* Left Column: Visual Flavour Showcase & Rating Meters */}
        <div className="lg:col-span-5 space-y-6 text-left min-w-0">
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800/80 aspect-[4/3] bg-neutral-950 shadow-xl group">
            <img
              src={selectedFlavour.image}
              alt={selectedFlavour.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-neutral-700/60 text-xs font-bold text-amber-400">
              Freshly Packed on Order
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
                {selectedFlavour.tagline}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                {selectedFlavour.name}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {selectedFlavour.description}
          </p>

          {/* 3 Circular Dial Rating Meters from the screenshot */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/50 border border-neutral-800/80 text-center">
            
            {/* 1. Hardness */}
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="#262626"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="#dc2626"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={
                      2 * Math.PI * 22 * (1 - selectedFlavour.hardness / 10)
                    }
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute text-center leading-none">
                  <span className="text-sm font-extrabold text-white">
                    {selectedFlavour.hardness}
                  </span>
                  <span className="text-[9px] text-neutral-500 block">/10</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-300 uppercase tracking-wider mt-2">
                <Flame className="w-3 h-3 text-red-500" />
                <span>Hardness</span>
              </div>
            </div>

            {/* 2. Freshness */}
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="#262626"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={
                      2 * Math.PI * 22 * (1 - selectedFlavour.freshness / 10)
                    }
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute text-center leading-none">
                  <span className="text-sm font-extrabold text-white">
                    {selectedFlavour.freshness}
                  </span>
                  <span className="text-[9px] text-neutral-500 block">/10</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-300 uppercase tracking-wider mt-2">
                <Sparkles className="w-3 h-3 text-red-400" />
                <span>Freshness</span>
              </div>
            </div>

            {/* 3. Fruity / Sweet */}
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="#262626"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={
                      2 * Math.PI * 22 * (1 - selectedFlavour.fruity / 10)
                    }
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute text-center leading-none">
                  <span className="text-sm font-extrabold text-white">
                    {selectedFlavour.fruity}
                  </span>
                  <span className="text-[9px] text-neutral-500 block">/10</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-300 uppercase tracking-wider mt-2">
                <span className="text-amber-400">●</span>
                <span>Fruity</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Pricing, Chillum Options & Hookah Base Switch */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Price Header with checkmark */}
          <div className="p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Calculated Rate (Taxes Included)
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums font-heading">
                  RS. {totalPrice}.00
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Ready to Smoke</span>
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase">Includes</span>
              <span className="text-xs font-semibold text-neutral-200">
                1kg Coconut Coals + Burner
              </span>
            </div>
          </div>

          {/* Section 1: Chillum Type Selection (Clay Rs. 600 vs Gold Silicon Rs. 700) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                1. Select Chillum Type:
              </label>
              <span className="text-xs text-red-400 font-medium">
                {selectedChillum === 'classic_clay' ? 'Traditional Clay' : 'Gold Silicon Cloud (Selected)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Option A: Classic Clay (Rs. 600) */}
              <div
                onClick={() => setSelectedChillum('classic_clay')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedChillum === 'classic_clay'
                    ? 'bg-neutral-900 border-red-600 ring-1 ring-red-600/50 shadow-lg shadow-red-950/40'
                    : 'bg-black/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/30'
                }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                  <img
                    src="/src/assets/images/chillum_classic_clay_1791655831825.jpg"
                    alt="Classic Clay Chillum"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-white font-heading">Classic Clay</div>
                    <span className="text-xs font-bold text-amber-400 tabular-nums">Rs. 600</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Authentic terracotta mud bowl for natural earthy shisha flavor.
                  </div>
                </div>
              </div>

              {/* Option B: Gold Silicon Cloud (Rs. 700) */}
              <div
                onClick={() => setSelectedChillum('gold_silicon')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedChillum === 'gold_silicon'
                    ? 'bg-neutral-900 border-red-600 ring-1 ring-red-600/50 shadow-lg shadow-red-950/40'
                    : 'bg-black/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/30'
                }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                  <img
                    src="/src/assets/images/chillum_gold_silicon_1791655843076.jpg"
                    alt="Gold Silicon Cloud Chillum"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-white font-heading">Gold Silicon Cloud</div>
                    <span className="text-xs font-bold text-amber-400 tabular-nums">Rs. 700</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Lotus heat management top with food-grade silicone (Zero burning).
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: "Do you want a Hookah base?" (Yes / No) - 2 Options from screenshot */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                2. Do you want a Hookah Base?
              </label>
              <span className="text-xs text-neutral-400">
                {wantsBase ? 'Full Hookah Setup Requested' : 'Pre-Filled Chillum Delivery Only'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWantsBase(true)}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  wantsBase
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/50'
                    : 'bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>YES (Include Hookah Base)</span>
              </button>

              <button
                type="button"
                onClick={() => setWantsBase(false)}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !wantsBase
                    ? 'bg-neutral-800 border-neutral-700 text-white shadow-md'
                    : 'bg-neutral-900/70 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>NO (Chillum Only)</span>
              </button>
            </div>

            {/* If YES: Choose Base Style */}
            {wantsBase && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 animate-in fade-in duration-200">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Select Hookah Base Model:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedBaseType('bohemian')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                      selectedBaseType === 'bohemian'
                        ? 'bg-neutral-900 border-red-600 text-white'
                        : 'bg-black/30 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                      <img
                        src="/src/assets/images/category_hookah_bases_1791648627967.jpg"
                        alt="Bohemian Base"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Bohemian Cut-Glass Base</div>
                      <div className="text-[11px] text-amber-400 tabular-nums">+Rs. 399 rental</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedBaseType('russian_alpha')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                      selectedBaseType === 'russian_alpha'
                        ? 'bg-neutral-900 border-red-600 text-white'
                        : 'bg-black/30 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                      <img
                        src="/src/assets/images/hero_luxury_hookah_1791648599431.jpg"
                        alt="Russian Alpha Base"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Russian Alpha Matte Base</div>
                      <div className="text-[11px] text-amber-400 tabular-nums">+Rs. 499 rental</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              
              {/* WhatsApp Chat Button (Exact feature from screenshot) */}
              <a
                href={`https://wa.me/91${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  waMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with us on WhatsApp</span>
              </a>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-100 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-red-500" />
                <span>{addedToast ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              {/* Book Now Primary Button */}
              <button
                type="button"
                onClick={handleBookNow}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Now (Rs. {totalPrice})</span>
              </button>

            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>60-Min Express Kolkata Doorstep Delivery</span>
              </span>
              <span>100% Organic Coconut Charcoal</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
