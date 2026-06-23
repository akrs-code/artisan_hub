import React, { useState } from 'react';

const statusColor = (status) => {
  if (status === 'DELIVERED' || status === 'COMPLETED') return 'bg-green-100 text-green-700';
  if (status === 'PENDING') return 'bg-amber-100 text-amber-700';
  if (status === 'CANCELLED') return 'bg-red-100 text-red-700';
  if (status === 'CONFIRMED' || status === 'ACCEPTED') return 'bg-blue-100 text-blue-700';
  return 'bg-muted text-muted-foreground';
};

const TransactionLogsTable = ({ data }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = data.filter(row => {
    const matchStatus = statusFilter === 'All' || row.status === statusFilter;
    const matchSearch = row.shopName.toLowerCase().includes(search.toLowerCase()) ||
      row.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const uniqueStatuses = ['All', ...new Set(data.map(r => r.status))];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-border gap-3">
        <h2 className="text-base font-headline font-bold text-foreground">All Transactions</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by shop or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-xs font-sans px-3 py-1.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-44"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-[11px] font-sans font-bold px-3 py-1.5 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            {uniqueStatuses.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="py-3 px-5 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Date</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Order ID</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Shop</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Amount</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-sm font-sans text-muted-foreground">
                  No transactions found.
                </td>
              </tr>
            ) : filtered.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="py-4 px-5 text-[13px] font-sans text-muted-foreground">{row.date}</td>
                <td className="py-4 px-4 text-[10px] font-sans text-muted-foreground uppercase tracking-widest font-mono">#{row.id}</td>
                <td className="py-4 px-4 text-[13px] font-sans font-bold text-foreground">{row.shopName}</td>
                <td className="py-4 px-4 text-[13px] font-headline font-bold text-green-600">{row.amount}</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${statusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-muted/20 text-[11px] font-sans text-muted-foreground">
        Showing <span className="font-bold text-foreground">{filtered.length}</span> of{' '}
        <span className="font-bold text-foreground">{data.length}</span> transactions
      </div>
    </div>
  );
};

export default TransactionLogsTable;
