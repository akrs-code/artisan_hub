import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockShops, mockProducts } from '../../lib/mockData';
import { Star, ShoppingBag, ShieldCheck, Heart, MapPin, ChevronLeft, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '@/components/buyer/products/ProductCard';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, savedShopIds, toggleSaveShop } = useCart();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const foundShop = mockShops.find((s) => s._id === id);
    if (foundShop) {
      setShop(foundShop);
      setProducts(mockProducts.filter((p) => p.shop === id));
    }
  }, [id]);

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-primary border-border" />
      </div>
    );
  }

  const isSaved = savedShopIds.includes(shop._id);
  const availableCategories = ['All', ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full pb-24 animate-in fade-in duration-500 bg-background min-h-full">
      <div className="relative h-[55vh] w-full overflow-hidden">
        <img
          src={shop.coverUrl}
          alt={`${shop.name} cover`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/80 via-neutral-dark/40 to-transparent" />

        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 text-xs font-sans font-medium bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <Link to="/" className="hover:text-white transition-colors">Discovery</Link>
          <span>/</span>
          <span className="text-white font-bold">{shop.name}</span>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-12 px-8 text-center">
          <span className="text-white/70 text-[10px] font-sans font-bold uppercase tracking-[0.25em] mb-3">
            {shop.category}
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-white mb-4 leading-none">
            {shop.name}
          </h1>
          <p className="text-white/80 text-base md:text-lg font-body max-w-xl leading-relaxed mb-8">
            {shop.description}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-white bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/20">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
              ))}
              <span className="text-xs font-sans font-bold ml-1">4.9</span>
            </div>
            <button
              onClick={() => toggleSaveShop(shop._id)}
              className={`btn-base gap-2 text-sm ${
                isSaved
                  ? 'btn-primary'
                  : 'bg-white/15 backdrop-blur-md text-white border border-white/30 hover:bg-white/25'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              {isSaved ? 'Saved' : 'Save Shop'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-b border-border">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary block mb-4">
              Our Story
            </span>
            <h2 className="text-4xl font-headline font-bold text-foreground mb-5 leading-tight">
              A Legacy of Craft
            </h2>
            <div className="decorative-line decorative-line-primary w-16 mb-7" />
            <p className="text-muted-foreground text-lg leading-loose font-body">
              {shop.description}
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground font-sans">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{shop.address}</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-[var(--shadow-soft-lg)]">
              <img
                src={shop.logoUrl}
                alt={`${shop.name} craftsmanship`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 card-custom !p-5 !rounded-2xl flex flex-col items-center justify-center w-36 h-36 shadow-[var(--shadow-soft-lg)]">
              <ShieldCheck className="w-9 h-9 text-primary mb-2" />
              <span className="text-center text-xs font-sans font-bold text-foreground leading-snug">
                Certified Heritage Craft
              </span>
            </div>
          </div>
        </div>

        <div className="pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-headline font-bold text-foreground mb-2">
                Available Creations
              </h2>
              <p className="text-muted-foreground font-body">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available
              </p>
            </div>
            {availableCategories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`chip-pill text-xs ${
                      activeCategory === cat ? 'chip-pill-primary' : 'bg-card border border-border text-foreground hover:border-primary/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="card-custom text-center py-20">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-headline font-bold text-xl text-foreground mb-2">No items in this category</h3>
              <button
                onClick={() => setActiveCategory('All')}
                className="btn-base btn-outlined text-sm mt-4"
              >
                View All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
