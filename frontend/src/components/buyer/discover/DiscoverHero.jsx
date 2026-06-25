import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Store } from 'lucide-react';

export const DiscoverHero = ({ onExploreShops }) => (
  <section
    className="relative rounded-xl overflow-hidden mb-6 min-h-[280px] sm:min-h-[340px] md:min-h-[400px] flex items-center"
    aria-label="Discover Artisan Marketplace"
  >
    {/* Gradient background (used when no image) */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#2C1A0E] via-[#4A2512] to-[#1A0F08]" />

    {/* Decorative pattern */}
    <div className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(160,82,45,0.6) 0%, transparent 50%), 
                          radial-gradient(circle at 80% 20%, rgba(139,105,20,0.4) 0%, transparent 40%)`,
      }}
    />

    {/* Content */}
    <div className="relative z-10 w-full max-w-2xl px-5 sm:px-8 md:px-12 py-10 flex flex-col items-start">
      {/* Label chip */}
      <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-sans font-bold text-white/90 uppercase tracking-widest">
        <Sparkles className="w-3 h-3" />
        Artisan Marketplace
      </span>

      {/* Headline */}
      <h1 className="font-headline font-bold text-white leading-tight mb-3 text-2xl sm:text-4xl md:text-5xl">
        Discover Authentic<br className="hidden sm:block" />
        <span className="text-amber-300"> Filipino Craftsmanship</span>
      </h1>

      {/* Description */}
      <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
        Connect with talented local artisans and find one-of-a-kind handmade goods that tell a story.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onExploreShops}
          className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-sans font-semibold shadow-lg transition-all active:scale-95"
        >
          <Store className="w-4 h-4" />
          Explore Shops
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        <Link
          to="/cart"
          className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-sans font-semibold hover:bg-white/20 transition-all active:scale-95"
        >
          View Cart
        </Link>
      </div>
    </div>
  </section>
);