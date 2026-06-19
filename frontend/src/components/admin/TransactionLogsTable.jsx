import React from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import Pagination from '../seller/Pagination';

const TypeBadge = ({ type }) => {
  return (
    <span className="inline-flex px-3 py-1 rounded-full bg-[#EBE5D9] text-[#8C5233] text-[9px] font-bold tracking-widest uppercase">
      {type}
    </span>
  );
};

const AmountDisplay = ({ amount, type }) => {
  let colorClass = "text-neutral-dark";
  if (type === 'SALE') colorClass = "text-[#16A34A]"; // Green
  if (type === 'REFUND') colorClass = "text-destructive"; // Red

  return (
    <span className={`text-[13px] font-headline font-bold ${colorClass}`}>
      {amount}
    </span>
  );
};

const StatusDisplay = ({ status }) => {
  let colorClass = "bg-[#16A34A] text-[#16A34A]"; // COMPLETED (Green)
  if (status === 'PENDING') colorClass = "bg-[#D97706] text-[#D97706]";
  if (status === 'DISPUTED') colorClass = "bg-destructive text-destructive";

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${colorClass.split(' ')[0]}`}></div>
      <span className={`text-[9px] font-bold tracking-widest uppercase ${colorClass.split(' ')[1]}`}>
        {status}
      </span>
    </div>
  );
};

const TransactionLogsTable = ({ data, onFilterClick, onActionClick }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-neutral-dark/10 gap-4">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Recent Financial Activities</h2>
        <div className="flex items-center gap-4 text-neutral-dark/60">
          <button
            onClick={() => onFilterClick('Type')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-dark/10 bg-neutral-dark/5 hover:bg-neutral-dark/10 text-[11px] font-sans font-bold text-neutral-dark transition-colors uppercase tracking-wider"
          >
            ALL TYPES
            <ChevronDown className="w-3 h-3 text-neutral-dark/50" />
          </button>
          <button
            onClick={() => onFilterClick('Status')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-dark/10 bg-neutral-dark/5 hover:bg-neutral-dark/10 text-[11px] font-sans font-bold text-neutral-dark transition-colors uppercase tracking-wider"
          >
            STATUS: ALL
            <ChevronDown className="w-3 h-3 text-neutral-dark/50" />
          </button>
          <div className="w-px h-5 bg-neutral-dark/10 mx-2"></div>
          <span className="text-[11px] font-sans text-neutral-dark/60">
            1-5 of 1,284
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-neutral-dark/5 border-b border-neutral-dark/10">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Date</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Transaction ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Shop Name</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Type</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Amount</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Status</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row ${i === data.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="py-5 px-6">
                  <div className="text-[13px] font-sans text-neutral-dark/60 font-medium mb-0.5">
                    {row.date.split(',')[0]},
                  </div>
                  <div className="text-[13px] font-sans text-neutral-dark/60 font-medium">
                    {row.date.split(',')[1]}
                  </div>
                </td>
                <td className="py-5 px-4">
                  <span className="text-[10px] font-sans text-neutral-dark/40 uppercase tracking-widest">
                    {row.id}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <span className="text-[13px] font-sans font-bold text-neutral-dark">
                    {row.shopName}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <TypeBadge type={row.type} />
                </td>
                <td className="py-5 px-4">
                  <AmountDisplay amount={row.amount} type={row.type} />
                </td>
                <td className="py-5 px-4">
                  <StatusDisplay status={row.status} />
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-end gap-5">
                    <button
                      onClick={() => onActionClick('View Details', row.id)}
                      className="text-neutral-dark/40 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-neutral-dark/10 p-4 px-6 flex items-center justify-between bg-neutral-dark/5">
        <div className="text-[11px] font-sans text-neutral-dark/60">
          Showing <span className="font-bold text-neutral-dark">1</span> to <span className="font-bold text-neutral-dark">5</span> of <span className="font-bold text-neutral-dark">1,284</span> transactions
        </div>
        <div className="scale-90 origin-right">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default TransactionLogsTable;
