import React from 'react';
import { Filter, MoreVertical } from 'lucide-react';
import Pagination from './Pagination';

const StatusBadge = ({ status }) => {
  let badgeStyle = "bg-primary/10 text-primary"; 
  if (status === 'confirmed') {
    badgeStyle = "bg-blue-100 text-blue-800"; 
  } else if (status === 'shipped') {
    badgeStyle = "bg-primary/20 text-primary"; 
  } else if (status === 'delivered') {
    badgeStyle = "bg-green-100 text-green-800"; 
  } else if (status === 'cancelled') {
    badgeStyle = "bg-destructive/10 text-destructive"; 
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-center ${badgeStyle}`}>
      {status}
    </span>
  );
};

const OrderQueueTable = ({ orders, totalOrders, currentlyShowing, onSelectOrder }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h2 className="text-lg font-headline font-bold text-foreground">Recent Orders Queue</h2>
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"><Filter className="w-4 h-4" /></button>
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Order ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Date</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Customer</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Products</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase text-right">Total</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center font-sans text-sm text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, i) => {
                const formattedTotal = (order.total / 100).toLocaleString('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                });
                const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr
                    key={order._id}
                    onClick={() => onSelectOrder && onSelectOrder(order)}
                    className={`border-b border-border/50 hover:bg-muted/50 transition-colors group/row cursor-pointer ${
                      i === orders.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-5 px-6">
                      <span className="text-[12px] font-sans font-bold text-primary leading-tight">
                        {order._id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="py-5 px-4 text-[12px] font-sans text-muted-foreground leading-tight">
                      {dateStr}
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-[13px] font-sans font-bold text-foreground block leading-tight">
                        {order.buyer?.name || 'Guest Buyer'}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-[13px] font-sans text-muted-foreground font-medium">
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </td>
                    <td className="py-5 px-4 text-[13px] font-sans text-muted-foreground font-bold text-right">
                      {formattedTotal}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-border p-4 px-6 flex items-center justify-between bg-muted/50">
        <div className="text-[11px] font-sans text-muted-foreground">
          Showing <span className="font-bold text-foreground">{currentlyShowing}</span> of <span className="font-bold text-foreground">{totalOrders}</span> orders
        </div>
        <div className="scale-90 origin-right">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default OrderQueueTable;
