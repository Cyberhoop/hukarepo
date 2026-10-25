import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Calendar,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight,
  Clock,
  Crown,
} from 'lucide-react';

export interface SlideItem {
  id: string;
  image: string;
  alt: string;
  tag: string;
  tagColor: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  badgeText: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  primaryActionType: 'booking' | 'products' | 'services';
  secondaryActionType: 'products' | 'services' | 'gallery';
  accentGradient: string;
}

export const HERO_SLIDES: SlideItem[] = [
  {
    id: 'slide-penthouse',
    image: '/src/assets/images/luxury_penthouse_lounge_night_1792919780346.jpg',
    alt: 'VIP Penthouse Rooftop Shisha Lounge in Kolkata at Night',
    tag: 'VIP Penthouse Rooftop Experience',
    tagColor: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
    title: 'Elevate Your Moments With',
    titleHighlight: 'Shisha Rent',
    subtitle:
      'Curated German stainless steel hookahs, 15+ exotic flavour brands, organic coconut coals, and nocturnal dispatch across Kolkata in 45–60 minutes.',
    badgeText: 'Good Vibes Only',
    primaryActionLabel: 'Book for Tonight',
    secondaryActionLabel: 'Explore Marketplace',
    primaryActionType: 'booking',
    secondaryActionType: 'products',
    accentGradient: 'from-red-600 via-rose-500 to-amber-400',
  },
  {
    id: 'slide-white-crystal',
    image: '/src/assets/images/luxury_white_hookah_hero_1792919777843.jpg',
    alt: 'White Ceramic and Crystal Glass Shisha Setup',
    tag: 'Pure White Edition',
    tagColor: 'text-neutral-100 border-neutral-300/40 bg-neutral-900/80',
    title: 'Crystal Clear &',
    titleHighlight: 'White Ceramic Shisha',
    subtitle:
      'Ultra-smooth pull, crystal glassware, and fresh natural chillum setup delivered ready-to-smoke to your doorstep in Kolkata.',
    badgeText: 'Fresh & Clean',
    primaryActionLabel: 'Book White Shisha',
    secondaryActionLabel: 'Explore Setups',
    primaryActionType: 'booking',
    secondaryActionType: 'products',
    accentGradient: 'from-white via-neutral-200 to-slate-400',
  },
  {
    id: 'slide-golden-service',
    image: '/src/assets/images/service_golden_bar_catering_1792919778409.jpg',
    alt: 'Royal Golden Cocktail Bar & VIP Event Shisha Catering in Kolkata',
    tag: 'Royal Golden Event Hospitality',
    tagColor: 'text-amber-300 border-amber-400/50 bg-amber-950/70',
    title: 'Turnkey Hospitality &',
    titleHighlight: 'Golden Service Bar',
    subtitle:
      'Professional flair bartenders, craft smoked cocktails, live barbecue chefs, and shisha sommeliers for weddings, bachelors, and terrace galas.',
    badgeText: 'VIP Crew Catering',
    primaryActionLabel: 'Hire Service Crew',
    secondaryActionLabel: 'View Services Menu',
    primaryActionType: 'services',
    secondaryActionType: 'services',
    accentGradient: 'from-amber-300 via-yellow-400 to-amber-600',
  },
  {
    id: 'slide-flavours-chillums',
    image: '/src/assets/images/category_flavours_1791648613614.jpg',
    alt: 'Authentic Imported Shisha Flavours and Pre-Filled Ready Chillums',
    tag: 'Pre-Filled Ready Chillums & 40+ Flavours',
    tagColor: 'text-red-400 border-red-500/40 bg-red-950/60',
    title: 'Al Fakher, Afzal &',
    titleHighlight: 'Kolkata Meetha Paan',
    subtitle:
      'Fresh pre-packed clay bowls (₹600) and gold silicon clouds (₹700). Delivered with hot coconut coals and electric coil burners ready to pull.',
    badgeText: 'Ready in 45 Mins',
    primaryActionLabel: 'Customize Chillum',
    secondaryActionLabel: 'Browse All 40+ Flavours',
    primaryActionType: 'products',
    secondaryActionType: 'products',
    accentGradient: 'from-rose-500 via-red-500 to-orange-400',
  },
];

interface HeroSliderProps {
  onOpenBooking: () => void;
  onNavigatePage: (page: 'products' | 'services' | 'gallery') => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenBooking, onNavigatePage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const SLIDE_DURATION = 5000; // 5 seconds per slide
  const TICK_INTERVAL = 50; // Progress bar tick

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Automated timer effect with pause condition
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + (TICK_INTERVAL / SLIDE_DURATION) * 100;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = HERO_SLIDES[currentIndex];

  const handleAction = (type: 'booking' | 'products' | 'services' | 'gallery') => {
    if (type === 'booking') {
      onOpenBooking();
    } else {
      onNavigatePage(type);
    }
  };

  return (
    <div
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800/90 bg-[#0a0a10] shadow-2xl shadow-black/90 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Aspect Ratio Box: 16/10 on mobile, 16/9 on desktop */}
      <div className="relative aspect-[16/11] sm:aspect-[16/9] w-full overflow-hidden">
        {/* Slides Images with Smooth Crossfade */}
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-1000"
              />
              {/* Cinematic Vignette Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />
            </div>
          );
        })}

        {/* Top Badges Bar: Slide Category + Status Condition */}
        <div className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 z-20 flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border backdrop-blur-md uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${activeSlide.tagColor}`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{activeSlide.tag}</span>
            </span>
            {isPaused && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-900/80 border border-neutral-700 text-[10px] font-semibold text-neutral-300">
                <Pause className="w-2.5 h-2.5" />
                <span>Paused</span>
              </span>
            )}
          </div>

          {/* Right Floating Badge (e.g. Good Vibes Only / 100% Sanitized) */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 sm:px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-neutral-700/80 text-[11px] sm:text-xs font-serif italic text-amber-300 flex items-center gap-1.5 shadow-lg">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>{activeSlide.badgeText}</span>
            </div>

            {/* Play/Pause Control Button */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume Auto-Slider' : 'Pause Auto-Slider'}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Slide Content Overlay (Positioned at Bottom-Left) */}
        <div className="absolute bottom-12 sm:bottom-14 left-3 sm:left-6 right-3 sm:right-6 z-20 text-left pointer-events-auto max-w-2xl">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading drop-shadow-md">
            {activeSlide.title}{' '}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${activeSlide.accentGradient} drop-shadow-[0_2px_15px_rgba(220,38,38,0.5)]`}
            >
              {activeSlide.titleHighlight}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-200 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2 max-w-xl drop-shadow">
            {activeSlide.subtitle}
          </p>

          {/* Interactive Slide Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-3 sm:mt-4">
            <button
              type="button"
              onClick={() => handleAction(activeSlide.primaryActionType)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-xl shadow-red-950/60 transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span>{activeSlide.primaryActionLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(activeSlide.secondaryActionType)}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-black/75 hover:bg-black/90 border border-neutral-600 text-neutral-100 font-semibold text-xs sm:text-sm flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
            >
              <span>{activeSlide.secondaryActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Left & Right Slider Arrows */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous slide"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next slide"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Bottom Status Bar: Pagination Dots + Slide Counter + Auto Progress Bar */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-6 right-3 sm:right-6 z-20 flex items-center justify-between gap-3">
          {/* Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((_, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Jump to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'w-6 sm:w-8 bg-red-600'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              );
            })}
          </div>

          {/* Slide Counter & Progress Bar */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-neutral-300 tabular-nums">
              0{currentIndex + 1} <span className="text-neutral-500">/ 0{HERO_SLIDES.length}</span>
            </span>

            {/* Countdown Progress Bar */}
            <div className="w-16 sm:w-24 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-400 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
