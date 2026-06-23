import React from 'react';
import { Download } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (status === 'shipped') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest border border-border text-muted-foreground uppercase">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest bg-primary/10 text-primary uppercase">
      {status}
    </span>
  );
};

const RecentOrders = ({ orders = [] }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden mt-6 group hover:card-custom-hover">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h2 className="text-lg font-headline font-bold text-foreground">Recent Orders</h2>
        <button className="flex items-center gap-2 text-xs font-sans font-medium text-muted-foreground hover:text-primary transition-colors">
          Export CSV <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Order ID</th>
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Customer</th>
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Status</th>
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Date</th>
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-muted-foreground uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center font-sans text-xs text-muted-foreground">
                  No orders recorded yet.
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => {
                const formattedAmount = (order.total / 100).toLocaleString('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                });
                const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                const customerName = order.buyer?.name || 'Guest Buyer';
                const initials = customerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr key={order._id} className="border-b border-border/50 hover:bg-muted/50 transition-colors group/row cursor-pointer">
                    <td className="py-5 px-6 text-[13px] font-sans font-bold text-primary group-hover/row:text-primary-dark">
                      #{order._id.substring(0, 8)}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          {initials}
                        </div>
                        <span className="text-[13px] font-sans font-bold text-foreground">
                          {customerName}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-5 px-6 text-[13px] font-sans text-muted-foreground">
                      {dateStr}
                    </td>
                    <td className="py-5 px-6 text-[13px] font-sans font-bold text-foreground text-right">
                      {formattedAmount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
