import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Package, MessageSquare, Loader2, Send } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { shopsAPI, productsAPI } from '../../services/api';
import { ProductCard } from '@/components/buyer/products/ProductCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
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
      <div className="relative h-[55vh] w-full overflow-hidden">
        <img
          src={shop.coverUrl || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1920&q=80'}
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
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(shop.rating || 0) ? 'fill-white text-white' : 'text-white/30'}`} />
              ))}
              <span className="text-xs font-sans font-bold ml-1">{(shop.rating || 0).toFixed(1)}</span>
            </div>
            <Button
              onClick={() => toggleSaveShop(shop._id)}
              variant={isSaved ? "default" : "outline"}
              className={`gap-2 ${isSaved ? '' : 'bg-white/15 backdrop-blur-md text-white border-white/30 hover:bg-white/25 hover:text-white'}`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save Shop'}
            </Button>
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
              <Card className="p-6 lg:col-span-1">
                <CardContent className="p-0 space-y-5">
                  <div>
                    <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Shop Rating</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-headline font-bold text-foreground">{(shop.rating || 0).toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground font-sans">out of 5</span>
                    </div>
                    <div className="flex gap-0.5 mt-2.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-5 h-5 ${star <= Math.round(shop.rating || 0) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-sans mt-2">
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
                </CardContent>
              </Card>

              {/* Individual Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Submit New Review Form */}
                <Card className="p-5 border border-primary/20 bg-primary/5">
                  <CardContent className="p-0">
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <h3 className="font-headline font-bold text-base text-neutral-dark">Write a Review</h3>
                      <p className="text-xs text-muted-foreground font-sans">Share your experience with this artisan shop.</p>
                      
                      {/* Rating selection */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-sans text-muted-foreground font-bold uppercase tracking-wider mr-2">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="hover:scale-110 transition-transform focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${star <= rating ? 'fill-primary text-primary' : 'text-neutral-dark/20'}`} />
                          </button>
                        ))}
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

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSubmittingReview}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit Review
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-xs text-muted-foreground font-sans py-4">No reviews yet. Be the first to review this shop!</p>
                ) : (
                  reviews.map((rev) => (
                    <Card key={rev._id} className="p-5">
                      <CardContent className="p-0 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-headline font-bold text-foreground text-sm">{rev.user?.name || 'Anonymous Customer'}</h4>
                            <span className="text-[10px] text-muted-foreground font-sans">
                              {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(rev.createdAt))}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                            <span className="text-[10px] font-sans font-bold text-primary">{(rev.rating || 0).toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed">
                          {rev.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))
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
