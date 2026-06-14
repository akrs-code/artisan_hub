import React from 'react';
import { Filter } from 'lucide-react';

const StatusBadge = ({ status, type }) => {
  let badgeStyle = "bg-[#D9E2EB] text-[#4A6478]"; // Default COMPLETED
  
  if (status === 'PROCESSING') {
    badgeStyle = "bg-[#EBE5D9] text-[#8C5233]";
  } else if (status === 'COMPLETED' && type === 'Refund') {
    badgeStyle = "bg-[#F8E2DF] text-[#C85746]";
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-center ${badgeStyle}`}>
      {status}
    </span>
  );
};

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-neutral-dark/10 gap-4">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Recent Transactions</h2>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 rounded-md border border-neutral-dark/10 bg-transparent hover:bg-neutral-dark/5 text-[11px] font-sans font-bold text-neutral-dark transition-colors">
            Export CSV
          </button>
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1">
            <Filter className="w-4 h-4 text-neutral-dark/60" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-neutral-dark/5 border-b border-neutral-dark/10">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Date</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Transaction ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Type</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Order ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Status</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr key={txn.id} className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row ${i === transactions.length - 1 ? 'border-b-0' : ''}`}>
                <td className="py-5 px-6 text-[12px] font-sans text-neutral-dark/60 leading-tight">
                  {txn.date.replace(', ', ',\n')}
                </td>
                <td className="py-5 px-4">
                  <span className="text-[12px] font-sans font-bold text-[#8C5233] leading-tight">
                    {txn.id}
                  </span>
                </td>
                <td className="py-5 px-4 text-[13px] font-sans text-neutral-dark/70 font-medium">
                  {txn.type}
                </td>
                <td className="py-5 px-4">
                  <span className="text-[12px] font-sans font-bold text-[#8C5233] leading-tight">
                    {txn.orderId || '—'}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <StatusBadge status={txn.status} type={txn.type} />
                </td>
                <td className="py-5 px-6 text-right">
                  <span className={`text-[13px] font-sans font-bold ${txn.amount.startsWith('-') ? 'text-neutral-dark' : 'text-neutral-dark'}`}>
                    {txn.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-dark/10 p-4 px-6 text-center bg-neutral-dark/5 hover:bg-neutral-dark/10 transition-colors cursor-pointer">
        <span className="text-[11px] font-sans font-bold tracking-widest text-[#8C5233] hover:text-[#7E4A2E] transition-colors">
          View All Transactions
        </span>
      </div>
    </div>
  );
};

export default TransactionsTable;
