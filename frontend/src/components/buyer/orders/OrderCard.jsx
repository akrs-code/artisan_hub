import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ChevronRight } from 'lucide-react';
import { mockShops } from '../../../lib/mockData';
import { StatusBadge } from './StatusBadge';

const formatPrice = (c) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(c / 100);

const formatDate = (d) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));

export const OrderCard = ({ order }) => {
  const shop = mockShops.find((s) => s._id === order.shop);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-[var(--shadow-soft-lg)] transition-all duration-400 flex flex-col h-full group">

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
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-start gap-3.5">
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
        ))}
        {order.items.length > 2 && (
          <div className="text-[10px] font-sans font-medium text-muted-foreground pl-14 pt-1">
            + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
          </div>
        )}
      </div>

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
            className="w-8 h-8 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-md transition-all duration-300"
            title="View Details"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-90 text-primary' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
