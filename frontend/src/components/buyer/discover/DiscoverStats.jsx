import { MapPin, Package, Heart, ShoppingBag } from 'lucide-react';

export const DiscoverStats = ({ shopCount, productCount, savedCount, ordersCount }) => {
  const stats = [
    { icon: MapPin,      value: `${shopCount}+`,    label: 'Artisan Shops',     bg: 'bg-primary/10',      icon_color: 'text-primary'     },
    { icon: Package,     value: `${productCount}+`, label: 'Handcrafted Items', bg: 'bg-secondary/10',    icon_color: 'text-secondary'   },
    { icon: Heart,       value: savedCount,          label: 'Saved Favorites',   bg: 'bg-destructive/10',  icon_color: 'text-destructive'  },
    { icon: ShoppingBag, value: ordersCount,          label: 'Your Orders',       bg: 'bg-amber-100',       icon_color: 'text-amber-700'   },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
      {stats.map(({ icon: Icon, value, label, bg, icon_color }) => (
        <div
          key={label}
          className="flex items-center gap-3 bg-card border border-border rounded-xl px-3.5 sm:px-4 py-3 hover:border-primary/25 hover:shadow-sm transition-all duration-200"
        >
          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
            <Icon className={`w-4 h-4 ${icon_color}`} />
          </div>
          <div className="min-w-0">
            <p className="font-headline font-bold text-lg text-foreground leading-none mb-0.5 truncate">{value}</p>
            <p className="text-[10px] font-sans text-muted-foreground leading-none truncate">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
