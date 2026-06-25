import { useState } from 'react';
import { MapPin, Star, Send } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const ProductDetailTabs = ({ product, shop, activeTab, onTabChange, reviews = [], onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    const success = await onReviewSubmit(rating, comment);
    if (success) {
      setRating(5);
      setComment('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 mb-7">
      <Tabs>

        <TabsList className="pb-2 mb-3 gap-4">
          {['product', 'reviews'].map((tab) => (
            <TabsTrigger
              key={tab}
              active={activeTab === tab}
              onClick={() => onTabChange(tab)}
              className="pb-1 uppercase tracking-widest text-[10px]"
            >
              {tab === 'product' ? 'Product Details' : `Reviews (${reviews.length})`}
            </TabsTrigger>
          ))}
        </TabsList>


        <div className="max-h-32 overflow-y-auto pr-1.5 text-xs text-muted-foreground leading-relaxed custom-scrollbar font-body">
          <TabsContent active={activeTab === 'product'}>
            <div>
              <p className="mb-2 text-foreground font-semibold">{product.name}</p>
              <p>{product.description}</p>
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-[10px] font-sans text-muted-foreground/80 border-t border-border/30 pt-3">
                <div>
                  <span className="block font-bold uppercase tracking-widest text-[8px] text-muted-foreground/50">Category</span>
                  <span className="text-foreground font-semibold">{product.category}</span>
                </div>
                <div>
                  <span className="block font-bold uppercase tracking-widest text-[8px] text-muted-foreground/50">Availability</span>
                  <span className={`font-semibold ${product.inStock ? 'text-secondary-dark' : 'text-destructive'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>


          <TabsContent active={activeTab === 'reviews'}>
            <div className="space-y-6 pb-2">

              {/* Write Review Form */}
              <form onSubmit={handleSubmit} className="bg-muted/30 p-4 rounded-xl border border-border/50">
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-3">Write a Review</h4>
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= rating ? 'fill-primary text-primary' : 'text-border'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={2}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs font-sans focus:outline-none focus:border-primary/50 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="btn-sm btn-solid w-full sm:w-auto px-6 py-2 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  Submit Review
                </button>
              </form>

              {/* Review List */}
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground/50 py-4 font-sans text-xs italic">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="pb-4 border-b border-border/30 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-foreground text-xs">{rev.user?.name || 'Anonymous User'}</span>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-primary text-primary' : 'text-border'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

