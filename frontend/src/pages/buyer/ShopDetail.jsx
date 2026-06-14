import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockShops, mockProducts } from '../../lib/mockData';
import { Star, Heart, Package, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '@/components/buyer/products/ProductCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const mockShopReviews = [
  {
    id: 1,
    userName: "Elena R.",
    rating: 5,
    date: "2026-05-12",
    comment: "This shop has the best handcrafted pottery. The packaging was extremely secure and the quality is outstanding! Will definitely order again."
  },
  {
    id: 2,
    userName: "Mark T.",
    rating: 4,
    date: "2026-06-01",
    comment: "Very unique designs and friendly communication. Delivery took a bit longer but the craftsmanship makes it worth the wait."
  },
  {
    id: 3,
    userName: "Sofia G.",
    rating: 5,
    date: "2026-06-10",
    comment: "Absolutely stunning pieces. You can feel the passion and detail put into each item. Highly recommend this artisan!"
  }
];

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, savedShopIds, toggleSaveShop } = useCart();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('creations');

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
        <div className="absolute inset-0 bg-linear-to-t from-neutral-dark/80 via-neutral-dark/40 to-transparent" />

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
            <div className="flex items-center gap-1 text-white bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
              ))}
              <span className="text-xs font-sans font-bold ml-1">{shop.rating || '4.9'}</span>
            </div>
            <button
              onClick={() => toggleSaveShop(shop._id)}
              className={`btn-base gap-2 text-sm rounded-xl cursor-pointer ${
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

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full pt-10">
        {/* Navigation Tabs */}
        <Tabs className="mb-8">
          <TabsList>
            <TabsTrigger
              active={activeTab === 'creations'}
              onClick={() => setActiveTab('creations')}
              className="mr-4"
            >
              <Package className="w-3.5 h-3.5 mr-1" />
              Creations ({products.length})
            </TabsTrigger>
            <TabsTrigger
              active={activeTab === 'reviews'}
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              Reviews ({mockShopReviews.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'creations' ? (
          <div>
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
                      className={`chip-pill text-xs rounded-xl cursor-pointer ${
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
                  className="btn-base btn-outlined text-sm mt-4 rounded-xl"
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
        ) : (
          <div className="space-y-6">
            <h2 className="text-4xl font-headline font-bold text-foreground mb-6">
              Shop Reviews
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Review Summary Widget */}
              <Card className="p-6 lg:col-span-1">
                <CardContent className="p-0 space-y-5">
                  <div>
                    <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Shop Rating</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-headline font-bold text-foreground">{shop.rating || '4.9'}</span>
                      <span className="text-sm text-muted-foreground font-sans">out of 5</span>
                    </div>
                    <div className="flex gap-0.5 mt-2.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-sans mt-2">
                      Based on {mockShopReviews.length} customer reviews
                    </p>
                  </div>

                  {/* Rating Distribution Bars */}
                  <div className="space-y-2.5 pt-4 border-t border-border/40">
                    {[
                      { stars: 5, percentage: 80, count: 2 },
                      { stars: 4, percentage: 20, count: 1 },
                      { stars: 3, percentage: 0, count: 0 },
                      { stars: 2, percentage: 0, count: 0 },
                      { stars: 1, percentage: 0, count: 0 }
                    ].map((bar) => (
                      <div key={bar.stars} className="flex items-center gap-3 text-xs font-sans">
                        <span className="w-3 text-right text-muted-foreground font-bold">{bar.stars}</span>
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${bar.percentage}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-muted-foreground text-[10px]">{bar.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Individual Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Customer Reviews</h3>
                {mockShopReviews.map((rev) => (
                  <Card key={rev.id} className="p-5">
                    <CardContent className="p-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-headline font-bold text-foreground text-sm">{rev.userName}</h4>
                          <span className="text-[10px] text-muted-foreground font-sans">
                            {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(rev.date))}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                          <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                          <span className="text-[10px] font-sans font-bold text-primary">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-body leading-relaxed">
                        {rev.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
