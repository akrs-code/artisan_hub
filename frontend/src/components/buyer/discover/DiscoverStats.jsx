import { MapPin, Package, Heart, ShoppingBag } from 'lucide-react';

export const DiscoverStats = ({ shopCount, productCount, savedCount, ordersCount }) => {
  const stats = [
    { icon: MapPin,      value: `${shopCount}+`,    label: 'Artisan Shops',    color: 'text-primary' },
    { icon: Package,     value: `${productCount}+`, label: 'Handcrafted Items', color: 'text-secondary' },
    { icon: Heart,       value: savedCount,          label: 'Saved Favorites',  color: 'text-destructive' },
    { icon: ShoppingBag, value: ordersCount,         label: 'Your Orders',      color: 'text-tertiary' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {stats.map(({ icon: Icon, value, label, color }) => (
        <div
          key={label}
          className="flex items-center gap-3 bg-card border border-border/70 rounded-xl px-4 py-3.5 shadow-sm"
        >
          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-current/8 ${color}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <p className="font-headline font-bold text-lg text-foreground leading-none mb-0.5">{value}</p>
            <p className="text-[10px] font-sans text-muted-foreground leading-none">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
