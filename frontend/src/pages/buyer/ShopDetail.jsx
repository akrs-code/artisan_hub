import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Package, MessageSquare, Loader2, Send } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { shopsAPI, productsAPI } from '../../services/api';
import { ProductCard } from '@/components/buyer/products/ProductCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, savedShopIds, toggleSaveShop } = useCart();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('creations');
  const [isLoading, setIsLoading] = useState(true);

  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const loadShopData = async () => {
    try {
      setIsLoading(true);
      const [shopRes, productsRes, reviewsRes] = await Promise.all([
        shopsAPI.getShopById(id),
        productsAPI.getShopProducts(id),
        shopsAPI.getReviews(id).catch(() => ({ data: [] }))
      ]);
      setShop(shopRes?.data);
      setProducts(productsRes?.data || []);
      setReviews(reviewsRes?.data || []);
    } catch (err) {
      console.error("Failed to load shop details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShopData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      setReviewError('Please select a rating');
      return;
    }
    try {
      setIsSubmittingReview(true);
      setReviewError('');
      await shopsAPI.createReview(id, rating, comment);
      setComment('');
      setRating(5);
      
      const [shopRes, reviewsRes] = await Promise.all([
        shopsAPI.getShopById(id),
        shopsAPI.getReviews(id)
      ]);
      setShop(shopRes?.data);
      setReviews(reviewsRes?.data || []);
      alert('Thank you! Your review has been submitted.');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review. You may have already reviewed this shop or you must be logged in as a buyer.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-sans text-muted-foreground">Loading artisan shop...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10">
        <p className="text-muted-foreground mb-4">Artisan shop not found.</p>
        <Button onClick={() => navigate('/discover')}>
          Go back to marketplace
        </Button>
      </div>
    );
  }

  const isSaved = savedShopIds.includes(shop._id);
  const availableCategories = ['All', ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory);

  // Calculate review averages dynamically
  const reviewCount = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { stars, percentage, count };
  });

  return (
    <div className="w-full pb-24 bg-background min-h-full">
      <div className="relative min-h-[70vh] w-full overflow-hidden flex items-end justify-center pb-16 pt-32">
        <img
          src={shop.coverUrl || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1920&q=80'}
          alt={`${shop.name} cover`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-neutral-dark/30 via-neutral-dark/60 to-neutral-dark/95" />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl px-6">
          {/* Shop Logo Avatar */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl mb-6 bg-background shrink-0 hover:scale-105 transition-transform duration-500">
             <img 
               src={shop.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=2C3E50&color=fff&size=256`}
               alt={`${shop.name} logo`}
               className="w-full h-full object-cover"
             />
          </div>

          {/* Glass Info Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass rounded-[2rem] p-8 md:p-10 w-full hover:border-white/30 transition-colors duration-500">
            <span className="inline-block text-primary-foreground/90 text-[10px] font-sans font-bold uppercase tracking-[0.3em] mb-4 bg-primary/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/30">
              {shop.category || 'Artisan Shop'}
            </span>
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white mb-4 leading-none drop-shadow-md">
              {shop.name}
            </h1>
            <p className="text-white/80 text-sm md:text-base font-body max-w-2xl mx-auto leading-relaxed mb-8">
              {shop.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-1.5 text-white bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-inner">
                <StarRating rating={shop.rating || 0} maxStars={5} size="sm" interactive={false} />
                <span className="text-sm font-sans font-bold ml-1">{(shop.rating || 0).toFixed(1)}</span>
                <span className="text-[10px] text-white/60 ml-1">({reviews.length})</span>
              </div>
              <Button
                onClick={() => toggleSaveShop(shop._id)}
                className={`gap-2 h-11 px-6 rounded-xl transition-all ${isSaved ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-neutral-dark hover:bg-neutral-100 hover:scale-105 shadow-lg'}`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved to Favorites' : 'Save Shop'}
              </Button>
            </div>
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
              Reviews ({reviews.length})
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
                    <Button
                      key={cat}
                      variant={activeCategory === cat ? "default" : "outline"}
                      onClick={() => setActiveCategory(cat)}
                      className="rounded-full h-8 px-4 text-xs"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="card-custom text-center py-20">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-headline font-bold text-xl text-foreground mb-2">No items in this category</h3>
                <Button
                  variant="outline"
                  onClick={() => setActiveCategory('All')}
                  className="mt-4"
                >
                  View All
                </Button>
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
              <div className="glass-card p-6 lg:col-span-1 space-y-5">
                <div>
                  <h3 className="text-xs font-sans font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Shop Rating</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-headline font-bold text-foreground">{(shop.rating || 0).toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground font-sans">out of 5</span>
                  </div>
                  <div className="mt-3">
                    <StarRating rating={shop.rating || 0} maxStars={5} size="lg" />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-sans mt-3">
                    Based on {reviews.length} customer reviews
                  </p>
                </div>

                  {/* Rating Distribution Bars */}
                  <div className="space-y-2.5 pt-4 border-t border-border/40">
                    {ratingDistribution.map((bar) => (
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
              </div>

              {/* Individual Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Submit New Review Form */}
                <div className="glass-card p-6 border border-primary/20 bg-primary/5">
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <div>
                      <h3 className="font-headline font-bold text-lg text-neutral-dark mb-1">Write a Review</h3>
                      <p className="text-xs text-muted-foreground font-sans">Share your experience with this artisan shop.</p>
                    </div>
                      
                      {/* Rating selection */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-sans text-muted-foreground font-bold uppercase tracking-wider">Your Rating:</span>
                        <StarRating rating={rating} onRatingChange={setRating} interactive size="xl" />
                      </div>

                      {/* Comment Box */}
                      <div className="space-y-1">
                        <Textarea
                          placeholder="What did you think of their products, customization, or service?"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                        />
                      </div>

                      {reviewError && (
                        <p className="text-xs font-sans text-destructive">{reviewError}</p>
                      )}

                      <div className="flex justify-end mt-2">
                        <Button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="px-6"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit Review
                        </Button>
                      </div>
                  </form>
                </div>

                <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-xs text-muted-foreground font-sans py-4">No reviews yet. Be the first to review this shop!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="glass-card p-5 hover:border-primary/30 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-headline font-bold text-foreground text-sm">{rev.user?.name || 'Anonymous Customer'}</h4>
                            <span className="text-[10px] text-muted-foreground font-sans">
                              {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(rev.createdAt))}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                            <StarRating rating={rev.rating || 0} maxStars={5} size="sm" />
                            <span className="text-[10px] font-sans font-bold text-primary ml-1">{(rev.rating || 0).toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 font-body leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
