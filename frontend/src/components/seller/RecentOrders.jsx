import React from 'react';
import { Download } from 'lucide-react';

const orders = [
  {
    id: '#AH-12940',
    customer: { name: 'Julianna Meyer', initials: 'JM' },
    status: 'SHIPPED',
    date: 'Oct 18, 2023',
    amount: 'P124.50'
  },
  {
    id: '#AH-12939',
    customer: { name: 'Thomas Hughes', initials: 'TH' },
    status: 'PROCESSING',
    date: 'Oct 18, 2023',
    amount: 'P59.00'
  }
];

const StatusBadge = ({ status }) => {
  if (status === 'SHIPPED') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest border border-neutral-dark/20 text-neutral-dark/70 uppercase">
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

const RecentOrders = () => {
  return (
    <div className="card-custom !p-0 overflow-hidden mt-6 group hover:card-custom-hover">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-dark/10">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Recent Orders</h2>
        <button className="flex items-center gap-2 text-xs font-sans font-medium text-neutral-dark/60 hover:text-primary transition-colors">
          Export CSV <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-dark/5">
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Order ID</th>
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Customer</th>
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Status</th>
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Date</th>
              <th className="py-4 px-6 text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id} className="border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row cursor-pointer">
                <td className="py-5 px-6 text-[13px] font-sans font-bold text-primary group-hover/row:text-primary-dark">
                  {order.id}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBE5D9] flex items-center justify-center text-[10px] font-bold text-neutral-dark/70">
                      {order.customer.initials}
                    </div>
                    <span className="text-[13px] font-sans font-bold text-neutral-dark">
                      {order.customer.name}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-5 px-6 text-[13px] font-sans text-neutral-dark/70">
                  {order.date}
                </td>
                <td className="py-5 px-6 text-[13px] font-sans font-bold text-neutral-dark text-right">
                  {order.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
