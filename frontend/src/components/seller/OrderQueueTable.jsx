import React from 'react';
import { Filter, MoreVertical } from 'lucide-react';
import Pagination from './Pagination';

const StatusBadge = ({ status }) => {
  let badgeStyle = "bg-[#EBE5D9] text-[#8C5233]"; // default PENDING / READY FOR PICKUP
  if (status === 'PROCESSING') {
    badgeStyle = "bg-[#D9E2EB] text-[#4A6478]";
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-center ${badgeStyle}`}>
      {status}
    </span>
  );
};

const OrderQueueTable = ({ orders, totalOrders, currentlyShowing }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-dark/10">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Recent Orders Queue</h2>
        <div className="flex items-center gap-4 text-neutral-dark/60">
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"><Filter className="w-4 h-4" /></button>
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-neutral-dark/5 border-b border-neutral-dark/10">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Order ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Date</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Customer</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Product</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id} className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row ${i === orders.length - 1 ? 'border-b-0' : ''}`}>
                <td className="py-5 px-6">
                  <span className="text-[12px] font-sans font-bold text-[#8C5233] leading-tight">
                    {order.id.split('-').map((part, index) => (
                      <React.Fragment key={index}>
                        {part}{index < order.id.split('-').length - 1 ? '-' : ''}<br/>
                      </React.Fragment>
                    ))}
                  </span>
                </td>
                <td className="py-5 px-4 text-[12px] font-sans text-neutral-dark/60 leading-tight">
                  {order.date.replace(', ', ',\n')}
                </td>
                <td className="py-5 px-4">
                  <span className="text-[13px] font-sans font-bold text-neutral-dark block leading-tight max-w-[100px] whitespace-pre-wrap">
                    {order.customer.replace(' ', '\n')}
                  </span>
                </td>
                <td className="py-5 px-4 text-[13px] font-sans text-neutral-dark/70 font-medium">
                  {order.product}
                </td>
                <td className="py-5 px-6 text-right">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-neutral-dark/10 p-4 px-6 flex items-center justify-between bg-neutral-dark/5">
        <div className="text-[11px] font-sans text-neutral-dark/60">
          Showing <span className="font-bold text-neutral-dark">{currentlyShowing}</span> of <span className="font-bold text-neutral-dark">{totalOrders}</span> pending orders
        </div>
        <div className="scale-90 origin-right">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default OrderQueueTable;
