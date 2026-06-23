import React, { useMemo } from 'react';
import DataTable from '../../../components/ui/DataTable';

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
  const columns = useMemo(() => [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans text-muted-foreground leading-tight">
          {row.original.date}
        </span>
      )
    },
    {
      header: 'Transaction ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-primary leading-tight">
          {row.original.id}
        </span>
      )
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans text-muted-foreground font-medium">
          {row.original.type}
        </span>
      )
    },
    {
      header: 'Order ID',
      accessorKey: 'orderId',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-primary leading-tight">
          {row.original.orderId || '—'}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} type={row.original.type} />
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
      cell: ({ row }) => (
        <span className={`text-[12px] font-sans font-bold ${row.original.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
          {row.original.amount}
        </span>
      )
    }
  ], []);

  return (
    <DataTable
      title="Recent Transactions"
      columns={columns}
      data={transactions || []}
      emptyStateMessage="No transaction records found."
    />
  );
};

export default TransactionsTable;
