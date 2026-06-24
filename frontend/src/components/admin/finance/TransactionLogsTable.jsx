import React, { useState, useMemo } from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Search } from 'lucide-react';
import DataTable from '../../ui/DataTable';

const TransactionLogsTable = ({ data }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = data.filter(row => {
    const matchStatus = statusFilter === 'All' || row.status === statusFilter;
    const matchSearch =
      row.shopName.toLowerCase().includes(search.toLowerCase()) ||
      row.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const uniqueStatuses = ['All', ...new Set(data.map(r => r.status))];

  const columns = useMemo(() => [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => <span className="text-sm font-sans text-muted-foreground">{row.original.date}</span>
    },
    {
      header: 'Order ID',
      accessorKey: 'id',
      cell: ({ row }) => <span className="text-[10px] font-sans text-muted-foreground uppercase tracking-widest font-mono">#{row.original.id}</span>
    },
    {
      header: 'Shop',
      accessorKey: 'shopName',
      cell: ({ row }) => <span className="text-sm font-sans font-semibold text-foreground">{row.original.shopName}</span>
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => <span className="text-sm font-headline font-bold text-primary">{row.original.amount}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    }
  ], []);

  return (
    <div className="w-full">
      <DataTable
        title="All Transactions"
        subtitle={`Showing ${filtered.length} of ${data.length} records`}
        columns={columns}
        data={filtered}
        emptyStateMessage="No transactions found."
        headerActions={
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search by shop or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-search rounded-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs font-sans font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {uniqueStatuses.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>
        }
        footer={
          <div className="text-xs font-sans text-muted-foreground w-full">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{' '}
            <span className="font-semibold text-foreground">{data.length}</span> transactions
          </div>
        }
      />
    </div>
  );
};

export default TransactionLogsTable;
