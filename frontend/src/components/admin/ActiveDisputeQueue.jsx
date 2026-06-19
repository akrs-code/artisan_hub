import React from 'react';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import Pagination from './Pagination';

const ReasonBadge = ({ reason }) => {
  return (
    <span className="inline-flex px-3 py-1 rounded-full bg-[#EBE5D9] text-[#8C5233] text-[9px] font-bold tracking-widest uppercase">
      {reason}
    </span>
  );
};

const ActiveDisputeQueue = ({ data, onRowClick, onFilterClick, onSortClick }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-neutral-dark/10 gap-4">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Active Dispute Queue</h2>
        <div className="flex items-center gap-4 text-neutral-dark/60">
          <button
            onClick={onSortClick}
            className="text-neutral-dark/40 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button
            onClick={onFilterClick}
            className="text-neutral-dark/40 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-neutral-dark/10 mx-2"></div>
          <span className="text-[11px] font-sans text-neutral-dark/60">
            1-4 of 24
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-neutral-dark/5 border-b border-neutral-dark/10">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Dispute ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Artisan / Shop</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Customer</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Reason</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick(row.id)}
                className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors cursor-pointer group/row ${i === data.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="py-5 px-6">
                  <span className="text-[10px] font-sans font-bold text-[#8C5233] uppercase tracking-widest">
                    {row.id}
                  </span>
                </td>
                <td className="py-5 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 bg-neutral-dark/10">
                    <img src={row.shopImg} alt={row.shopName} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[13px] font-sans font-bold text-neutral-dark">
                    {row.shopName}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <span className="text-[13px] font-sans text-neutral-dark/80">
                    {row.customerName}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <ReasonBadge reason={row.reason} />
                </td>
                <td className="py-5 px-6 text-right">
                  <span className="text-[13px] font-headline font-bold text-neutral-dark">
                    {row.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-neutral-dark/10 p-4 px-6 flex items-center justify-between bg-neutral-dark/5">
        <div className="text-[11px] font-sans text-neutral-dark/60">
          Showing <span className="font-bold text-neutral-dark">1-4</span> of <span className="font-bold text-neutral-dark">24</span> open disputes
        </div>
        <div className="scale-90 origin-right">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default ActiveDisputeQueue;
