import React, { useState, useMemo } from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Search, Eye } from 'lucide-react';
import DataTable from '../../ui/DataTable';

const TransactionLogsTable = ({ data }) => {
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = data.filter(row => {
    const matchStatus = statusFilter === 'All' || row.status === statusFilter;
    return matchStatus;
  });

  const uniqueStatuses = ['All', ...new Set(data.map(r => r.status))];

  const columns = useMemo(() => [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => <span className="text-[12px] font-sans text-muted-foreground leading-tight block">{row.original.date}</span>
    },
    {
      header: 'Order ID',
      accessorKey: 'id',
      cell: ({ row }) => <span className="text-[12px] font-sans font-bold text-primary leading-tight block uppercase tracking-widest font-mono">#{row.original.id}</span>
    },
    {
      header: 'Shop',
      accessorKey: 'shopName',
      cell: ({ row }) => <span className="text-[12px] font-sans text-muted-foreground leading-tight block">{row.original.shopName}</span>
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">{row.original.amount}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      header: 'Actions',
      id: 'actions',
      meta: { headerClassName: 'text-center', cellClassName: 'flex justify-center' },
      cell: () => (
        <button className="text-muted-foreground hover:text-primary transition-colors p-1" title="View Details">
            <Eye className="w-4 h-4" />
        </button>
      )
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
