import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ChevronDown, Star, Send } from 'lucide-react';
import { ordersAPI, shopsAPI, productsAPI } from '../../../services/api';
import { StatusBadge } from './StatusBadge';
import { StarRating } from '@/components/ui/star-rating';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/dialog';

const formatPrice = (c) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(c / 100);

const formatDate = (d) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));

// ── Review Modal ──────────────────────────────────────────────────────────────
const ReviewModal = ({ title, subtitle, rating, onRatingChange, comment, onCommentChange, onClose, onSubmit, submitDisabled }) => (
  <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="max-w-md">
      <DialogClose onClick={onClose} />
      
      {/* Header */}
      <DialogHeader>
        <DialogDescription className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest mb-1">
          {subtitle}
        </DialogDescription>
        <DialogTitle className="font-headline font-bold text-foreground text-base leading-tight">
          {title}
        </DialogTitle>
      </DialogHeader>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {/* Star rating */}
        <div className="flex items-center justify-between py-3 border-y border-border/60">
          <span className="field-label !mb-0">Your Rating</span>
          <StarRating rating={rating} onRatingChange={onRatingChange} interactive size="xl" />
        </div>

        {/* Comment */}
        <div>
          <label className="field-label">Comments</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Share your honest experience..."
            className="field-textarea"
          />
        </div>
      </div>

      {/* Footer */}
      <DialogFooter className="flex gap-3 px-6 pb-5 pt-0 border-t-0 bg-transparent mt-0">
        <button
          type="button"
          onClick={onClose}
          className="btn-sm btn-outline flex-1 py-2.5"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitDisabled}
          className="btn-sm btn-solid flex-1 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          Submit
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);


// ── Detail Row ────────────────────────────────────────────────────────────────
const DetailRow = ({ label, value, bold }) => (
  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 last:pt-1">
    <span className="text-xs text-muted-foreground font-sans">{label}</span>
    <span className={`text-xs font-sans ${bold ? 'font-headline font-bold text-sm text-primary' : 'font-semibold text-foreground'}`}>
      {value}
    </span>
  </div>
);

// ── Main OrderCard ────────────────────────────────────────────────────────────
export const OrderCard = ({ order, onOrderUpdate }) => {
  const shop = typeof order.shop === 'object' ? order.shop : null;
  const shopId = shop?._id || order.shop;

  const [expanded, setExpanded] = useState(false);
  const [reviewsSubmitted, setReviewsSubmitted] = useState({});
  const [activeReviewItem, setActiveReviewItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [shopReviewSubmitted, setShopReviewSubmitted] = useState(false);
  const [isReviewingShop, setIsReviewingShop] = useState(false);
  const [shopRating, setShopRating] = useState(5);
  const [shopComment, setShopComment] = useState('');

  const handleReviewSubmit = async (item) => {
    try {
      const productId = typeof item.product === 'object' ? item.product._id : item.product;
      await productsAPI.addProductReview(productId, rating, comment);
      setReviewsSubmitted((prev) => ({ ...prev, [item.name]: { rating, comment } }));
      setActiveReviewItem(null);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error(err);
      alert('Failed to submit product review. You may have already reviewed this product.');
    }
  };

  const submitShopReview = async () => {
    try {
      await shopsAPI.createReview(shopId, shopRating, shopComment);
      setShopReviewSubmitted(true);
      setIsReviewingShop(false);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await ordersAPI.cancelOrder(order._id);
      if (onOrderUpdate) onOrderUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel order');
    }
  };

  const handleReceiveOrder = async () => {
    if (!window.confirm('Confirm that you have received this order?')) return;
    try {
      await ordersAPI.receiveOrder(order._id);
      if (onOrderUpdate) onOrderUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to mark order as received');
    }
  };

  const handleCompleteOrder = async () => {
    if (!window.confirm('Mark this order as completed? This will finalize the transaction.')) return;
    try {
      await ordersAPI.completeOrder(order._id);
      if (onOrderUpdate) onOrderUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to complete order');
    }
  };

  const isDelivered = order.status === 'delivered';
  const visibleItems = order.items.slice(0, expanded ? order.items.length : 2);

  return (
    <>
      {/* Card — NO overflow-hidden so nothing clips */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col hover:border-primary/30 hover:shadow-md transition-all duration-200">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-border/60">
          <div className="min-w-0">
            <p className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest mb-1">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <Link
              to={`/shop/${shopId}`}
              className="font-headline font-bold text-foreground text-sm leading-tight block mb-1 hover:text-primary transition-colors truncate"
            >
              {shop?.name || 'Artisan Shop'}
            </Link>
            <span className="text-[10px] text-muted-foreground font-sans">
              {formatDate(order.createdAt)}
            </span>
          </div>
          <div className="shrink-0 mt-0.5">
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* ── Items ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 mb-4">
          {visibleItems.map((item, idx) => {
            const hasReviewed = reviewsSubmitted[item.name];
            return (
              <div key={idx} className="flex items-start gap-3 py-2.5 border-b border-border/30 last:border-0">
                {/* Icon */}
                <div className="w-9 h-9 bg-primary/8 rounded-xl flex items-center justify-center shrink-0 border border-primary/12">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-foreground text-sm line-clamp-1 leading-snug">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-sans mt-0.5">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                {/* Review button (delivered only) */}
                {isDelivered && (
                  <div className="shrink-0">
                    {hasReviewed ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 border border-green-100 text-[10px] font-bold text-green-700">
                        <Star className="w-2.5 h-2.5 fill-green-600" />
                        {hasReviewed.rating}
                      </div>
                    ) : (
                      <button
                        onClick={() => { setActiveReviewItem(item); setRating(5); setComment(''); }}
                        className="btn-sm btn-outline px-2.5 py-1 text-[10px]"
                      >
                        Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Show more indicator */}
          {order.items.length > 2 && !expanded && (
            <p className="text-[10px] font-sans text-muted-foreground pl-12">
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* ── Shop Review (delivered) ────────────────────────────────── */}
        {isDelivered && (
          <div className="mb-4 pb-4 border-b border-border/40">
            {shopReviewSubmitted ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                <span className="text-[10px] font-bold text-green-700 font-sans uppercase tracking-wider">
                  Shop Reviewed
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-green-600 text-green-600" />
                  <span className="text-[10px] font-bold text-green-700">{shopRating}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="field-label !mb-0">Rate this shop</span>
                <button
                  onClick={() => { setIsReviewingShop(true); setShopRating(5); setShopComment(''); }}
                  className="btn-sm btn-outline text-[10px]"
                >
                  Review Shop
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tracking banner ───────────────────────────────────────── */}
        {order.status === 'shipped' && order.trackingNumber && (
          <div className="flex items-center gap-2.5 px-3.5 py-3 mb-4 rounded-xl bg-primary/8 border border-primary/15">
            <Truck className="w-4 h-4 text-primary shrink-0" />
            <p className="text-[10px] font-sans text-primary truncate">
              <span className="font-bold">{order.courier}</span>
              {order.courier && ' · '}
              {order.trackingNumber}
            </p>
          </div>
        )}

        {/* ── Footer: total + actions ───────────────────────────────── */}
        <div className="mt-auto">
          {/* Total + action row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-muted/30 rounded-xl border border-border/50">
            <div>
              <p className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                Total Amount
              </p>
              <p className="font-headline font-bold text-primary text-base leading-none">
                {formatPrice(order.total)}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {order.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  className="btn-sm btn-danger"
                >
                  Cancel Order
                </button>
              )}
              {(order.status === 'shipped' || order.status === 'out_for_delivery') && (
                <button
                  onClick={handleReceiveOrder}
                  className="btn-sm btn-solid"
                >
                  Order Received
                </button>
              )}
              {order.status === 'delivered' && (
                <button
                  onClick={handleCompleteOrder}
                  className="btn-sm btn-solid bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700"
                >
                  Complete Order
                </button>
              )}
              {/* Expand toggle */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="btn-sm btn-outline w-8 h-8 p-0 !gap-0"
                title={expanded ? 'Collapse' : 'View Details'}
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expanded details panel */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-300">
              <p className="field-label mb-3">Order Details</p>
              <DetailRow label="Order ID" value={`#${order._id}`} />
              <DetailRow label="Shop" value={shop?.name || 'Artisan Shop'} />
              <DetailRow label="Date Placed" value={formatDate(order.createdAt)} />
              <DetailRow label="Status" value={order.status.replace('_', ' ')} />
              {order.courier && <DetailRow label="Courier" value={order.courier} />}
              {order.trackingNumber && <DetailRow label="Tracking No." value={order.trackingNumber} />}
              <DetailRow label="Payment" value={order.paymentMethod?.toUpperCase()} />
              <DetailRow label="Total" value={formatPrice(order.total)} bold />
            </div>
          )}
        </div>
      </div>

      {/* ── Product Review Modal ────────────────────────────────────── */}
      {activeReviewItem && (
        <ReviewModal
          title={activeReviewItem.name}
          subtitle="Product Review"
          rating={rating}
          onRatingChange={setRating}
          comment={comment}
          onCommentChange={setComment}
          onClose={() => setActiveReviewItem(null)}
          onSubmit={() => handleReviewSubmit(activeReviewItem)}
          submitDisabled={!comment.trim()}
        />
      )}

      {/* ── Shop Review Modal ───────────────────────────────────────── */}
      {isReviewingShop && (
        <ReviewModal
          title={shop?.name || 'Artisan Shop'}
          subtitle="Shop Review"
          rating={shopRating}
          onRatingChange={setShopRating}
          comment={shopComment}
          onCommentChange={setShopComment}
          onClose={() => setIsReviewingShop(false)}
          onSubmit={submitShopReview}
          submitDisabled={!shopComment.trim()}
        />
      )}
    </>
  );
};
