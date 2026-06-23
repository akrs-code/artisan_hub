import React from 'react';
import { Filter } from 'lucide-react';

const StatusBadge = ({ status, type }) => {
  let badgeStyle = "bg-blue-100 text-blue-800"; 
  
  const displayStatus = (status || 'COMPLETED').toUpperCase();

  if (displayStatus === 'PENDING' || displayStatus === 'CONFIRMED' || displayStatus === 'SHIPPED' || displayStatus === 'PROCESSING') {
    badgeStyle = "bg-primary/10 text-primary";
  } else if (displayStatus === 'CANCELLED') {
    badgeStyle = "bg-destructive/10 text-destructive";
  } else if (displayStatus === 'DELIVERED') {
    badgeStyle = "bg-green-100 text-green-800";
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-center ${badgeStyle}`}>
      {displayStatus === 'DELIVERED' ? 'COMPLETED' : displayStatus}
    </span>
  );
};

const TransactionsTable = ({ transactions = [] }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-border gap-4">
        <h2 className="text-lg font-headline font-bold text-foreground">Recent Transactions</h2>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 rounded-md border border-border bg-transparent hover:bg-muted/50 text-[11px] font-sans font-bold text-foreground transition-colors">
            Export CSV
          </button>
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Date</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Transaction ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Type</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Order ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Status</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center font-sans text-xs text-muted-foreground">
                  No transaction records found.
                </td>
              </tr>
            ) : (
              transactions.map((txn, i) => (
                <tr key={txn.id} className={`border-b border-border/50 hover:bg-muted/50 transition-colors group/row ${i === transactions.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="py-5 px-6 text-[12px] font-sans text-muted-foreground leading-tight">
                    {txn.date}
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-[12px] font-sans font-bold text-primary leading-tight">
                      {txn.id}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[13px] font-sans text-muted-foreground font-medium">
                    {txn.type}
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-[12px] font-sans font-bold text-primary leading-tight">
                      {txn.orderId || '—'}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <StatusBadge status={txn.status} type={txn.type} />
                  </td>
                  <td className="py-5 px-6 text-right">
                    <span className={`text-[13px] font-sans font-bold ${txn.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                      {txn.amount}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 px-6 text-center bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
        <span className="text-[11px] font-sans font-bold tracking-widest text-primary hover:text-primary/80 transition-colors">
          View All Transactions
        </span>
      </div>
    </div>
  );
};

export default TransactionsTable;
