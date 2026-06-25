import { Link } from 'react-router-dom';
import { Store, MapPin, Star } from 'lucide-react';

export const StoreDetailsHero = ({ shop }) => (
  <section
    className="relative rounded-xl overflow-hidden mt-16 mb-6 min-h-[280px] sm:min-h-[300px] md:min-h-[340px] flex items-center justify-center text-center"
    aria-label="Store Details"
  >
    {/* Background Image */}
    <img
      src={shop.coverUrl || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1920&q=80'}
      alt={`${shop.name} cover`}
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Gradient Overlay for readability */}
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-dark/80 via-neutral-dark/90 to-neutral-dark/95" />

    {/* Decorative pattern */}
    <div className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%), 
                          radial-gradient(circle at 80% 20%, var(--tertiary) 0%, transparent 40%)`,
      }}
    />

    {/* Content */}
    <div className="relative z-10 w-full max-w-3xl px-5 sm:px-8 md:px-12 py-10 flex flex-col items-center">
      {/* Label chip */}
      <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-sans font-bold text-white/90 uppercase tracking-widest">
        <Store className="w-3 h-3" />
        {shop.category || 'Artisan Shop'}
      </span>

      {/* Headline */}
      <h2 className="font-headline font-bold text-white leading-tight mb-3 text-2xl sm:text-4xl md:text-5xl">
        {shop.name}
      </h2>

      {/* Description */}
      <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
        {shop.description}
      </p>

      {/* Stats / Info */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-white/90 text-sm font-sans">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-tertiary" />
          <span>{shop.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-tertiary fill-tertiary" />
          <span>{shop.rating || '4.8'} / 5.0 Rating</span>
        </div>
      </div>

      {/* CTAs */}
      <Link
        to={`/shop/${shop._id}`}
        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-sans font-semibold shadow-lg transition-all active:scale-95"
      >
        <Store className="w-4 h-4" />
        Visit Store
        <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
      </Link>
    </div>
  </section>
);
