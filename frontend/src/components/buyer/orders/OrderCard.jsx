import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ChevronRight, Star, Send } from 'lucide-react';
import { mockShops } from '../../../lib/mockData';
import { StatusBadge } from './StatusBadge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const formatPrice = (c) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(c / 100);

const formatDate = (d) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));

export const OrderCard = ({ order }) => {
  const shop = mockShops.find((s) => s._id === order.shop);
  const [expanded, setExpanded] = useState(false);

  const [reviewsSubmitted, setReviewsSubmitted] = useState({});
  const [activeReviewItem, setActiveReviewItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [shopReviewSubmitted, setShopReviewSubmitted] = useState(false);
  const [isReviewingShop, setIsReviewingShop] = useState(false);
  const [shopRating, setShopRating] = useState(5);
  const [shopComment, setShopComment] = useState('');

  const handleReviewSubmit = (itemName) => {
    setReviewsSubmitted((prev) => ({
      ...prev,
      [itemName]: { rating, comment },
    }));
    setActiveReviewItem(null);
    setComment('');
    setRating(5);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-[var(--shadow-soft-lg)] transition-all duration-400 flex flex-col h-full group">

      {/* Header */}
      <div className="flex justify-between items-start mb-5 pb-4 border-b border-border/60">
        <div>
          <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest mb-1.5 block">
            Order #{order._id.split('_').pop().toUpperCase()}
          </span>
          <Link to={`/shop/${order.shop}`} className="font-headline font-bold text-foreground text-sm leading-tight block mb-1 hover:text-primary transition-colors">
            {shop?.name || 'Artisan Shop'}
          </Link>
          <span className="text-[10px] text-muted-foreground font-sans">
            Placed on {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="shrink-0">
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 flex flex-col gap-3.5 mb-6">
        {order.items.slice(0, expanded ? order.items.length : 2).map((item, idx) => {
          const isDelivered = order.status === 'delivered';
          const hasReviewed = reviewsSubmitted[item.name];
          const isReviewing = activeReviewItem === item.name;

          return (
            <div key={idx} className="flex flex-col gap-3 py-2 border-b border-border/30 last:border-0">
              <div className="flex items-start justify-between gap-3.5">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary/10 transition-colors duration-300">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-headline font-bold text-foreground text-sm line-clamp-1 leading-snug mb-0.5">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-sans tracking-wide">
                      Qty: {item.quantity} &times; {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                {isDelivered && (
                  <div className="shrink-0 pt-0.5">
                    {hasReviewed ? (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-sans font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        <span>Reviewed</span>
                        <div className="flex items-center">
                          <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                          <span>{hasReviewed.rating}</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReviewItem(item.name);
                          setRating(5);
                          setComment('');
                        }}
                        className="text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all duration-200 cursor-pointer"
                      >
                        Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {order.items.length > 2 && !expanded && (
          <div className="text-[10px] font-sans font-medium text-muted-foreground pl-14 pt-1">
            + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Shop Review Section */}
      {order.status === 'delivered' && (
        <div className="border-t border-border/40 pt-4 mt-2">
          {shopReviewSubmitted ? (
            <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3 flex items-center justify-between">
              <span className="text-[10px] font-sans font-bold text-emerald-700 uppercase tracking-wider">
                Artisan Shop Reviewed
              </span>
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                <span className="text-[10px] font-sans font-bold text-emerald-700">{shopRating}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">
                Rate Shop
              </span>
              <button
                onClick={() => {
                  setIsReviewingShop(true);
                  setShopRating(5);
                  setShopComment('');
                }}
                className="text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all duration-200 cursor-pointer"
              >
                Review Shop
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Area */}
      <div className="mt-auto flex flex-col gap-4">
        {/* Tracking */}
        {order.status === 'shipped' && order.trackingNumber && (
          <div className="bg-secondary/10 px-3.5 py-3 rounded-xl border border-secondary/20 flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-secondary-dark shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-sans text-secondary-dark truncate leading-none">
                <span className="font-bold">{order.courier}</span> &bull; {order.trackingNumber}
              </p>
            </div>
          </div>
        )}

        {/* Total & Action */}
        <div className="flex items-center justify-between bg-muted/30 px-4 py-3.5 rounded-xl border border-border/50">
          <div>
            <span className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">
              Total Amount
            </span>
            <span className="font-headline font-bold text-primary text-base leading-none block">
              {formatPrice(order.total)}
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
            title="View Details"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-90 text-primary' : ''}`} />
          </button>
        </div>

        {/* Expanded Details Panel */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-300 ease-out">
            <h4 className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-wider mb-3">Order Details</h4>
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-semibold text-foreground">#{order._id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Shop</span>
                <span className="font-semibold text-foreground">{shop?.name || 'Artisan Shop'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Date Placed</span>
                <span className="font-semibold text-foreground">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-foreground capitalize">{order.status}</span>
              </div>
              {order.courier && (
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Courier</span>
                  <span className="font-semibold text-foreground">{order.courier}</span>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Tracking No.</span>
                  <span className="font-semibold text-foreground">{order.trackingNumber}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold text-foreground uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1.5 pt-2 font-headline font-bold text-sm">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Review Dialog Overlay */}
      {activeReviewItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 relative space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest block mb-1">
                  Product Review
                </span>
                <h3 className="font-headline font-bold text-foreground text-lg leading-tight">
                  {activeReviewItem}
                </h3>
              </div>
              <button
                onClick={() => setActiveReviewItem(null)}
                className="text-muted-foreground hover:text-foreground text-xs font-sans font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-y border-border/40">
                <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">
                  Your Rating
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= rating
                          ? 'fill-primary text-primary'
                          : 'text-muted/30'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="product-review-comment" className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  Comments / Feedback
                </Label>
                <Textarea
                  id="product-review-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this handcrafted item..."
                  className="text-xs placeholder:text-muted-foreground/35 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewItem(null)}
                  className="flex-1 py-2.5 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg text-xs font-sans font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewSubmit(activeReviewItem)}
                  disabled={!comment.trim()}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-sans font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop Review Dialog Overlay */}
      {isReviewingShop && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 relative space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest block mb-1">
                  Artisan Shop Review
                </span>
                <h3 className="font-headline font-bold text-foreground text-lg leading-tight">
                  {shop?.name || 'Artisan Shop'}
                </h3>
              </div>
              <button
                onClick={() => setIsReviewingShop(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-sans font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-y border-border/40">
                <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">
                  Shop Rating
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setShopRating(star)}
                      className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= shopRating
                          ? 'fill-primary text-primary'
                          : 'text-muted/30'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shop-review-comment" className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  Shop Feedback
                </Label>
                <Textarea
                  id="shop-review-comment"
                  rows={4}
                  value={shopComment}
                  onChange={(e) => setShopComment(e.target.value)}
                  placeholder="Share your experience with this artisan's service, packaging, or communication..."
                  className="text-xs placeholder:text-muted-foreground/35 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewingShop(false)}
                  className="flex-1 py-2.5 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg text-xs font-sans font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShopReviewSubmitted(true);
                    setIsReviewingShop(false);
                  }}
                  disabled={!shopComment.trim()}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-sans font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
