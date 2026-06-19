import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const DiscoverHero = ({ onExploreShops }) => (
  <section 
    className="relative rounded-xl overflow-hidden mb-6 min-h-[320px] md:min-h-[400px] flex items-center shadow-lg"
    aria-label="Discover Artisan Marketplace"
  >
    {/* Background Image */}
    <img
      src=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    
    {/* Gradient Overlay - Fixed direction for left-aligned text readability */}
    <div className="absolute inset-0 bg-linear-to-r from-[#2C1A0E]/95 via-[#2C1A0E]/70 to-[#2C1A0E]/10" />

    {/* Content Container */}
    <div className="relative z-10 p-6 md:p-10 lg:p-12 w-full max-w-2xl flex flex-col items-start">
      
      {/* Badge/Eyebrow */}
      <span className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[10px] sm:text-xs font-sans font-bold text-primary uppercase tracking-widest shadow-sm">
        <Sparkles className="w-3 h-3" />
        Artisan Marketplace
      </span>

      {/* Headline */}
      <h1 className="font-headline font-bold text-white leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl">
        Discover Authentic<br className="hidden sm:block" /> Filipino Craftsmanship
      </h1>

      {/* Description */}
      <p className="text-white/80 font-body text-sm sm:text-base leading-relaxed mb-8 max-w-md">
        Connect with talented local artisans and find one-of-a-kind handmade goods that tell a story.
      </p>

      {/* Call to Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={onExploreShops}
          className="group btn-base btn-primary inline-flex items-center gap-2 text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          Explore Shops 
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        
        <Link
          to="/cart"
          className="btn-base inline-flex items-center gap-2 text-sm px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all active:scale-95 shadow-sm"
        >
          View Cart
        </Link>
      </div>
      
    </div>
  </section>
);