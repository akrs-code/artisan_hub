import React, { useMemo } from 'react';
import DataTable from '../../../components/ui/DataTable';

const StatusBadge = ({ status }) => {
  if (status === 'shipped') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest border border-border text-muted-foreground uppercase">
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

const RecentOrders = ({ orders = [] }) => {
  const columns = useMemo(() => [
    {
      header: 'Order ID',
      accessorKey: '_id',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-primary group-hover/row:text-primary-dark">
          #{row.original._id.substring(0, 8)}
        </span>
      )
    },
    {
      header: 'Customer',
      accessorKey: 'buyer',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-foreground">
          {row.original.buyer?.name || 'Guest Buyer'}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      )
    },
    {
      header: 'Amount',
      accessorKey: 'total',
      meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-foreground">
          {(row.original.total / 100).toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
          })}
        </span>
      )
    }
  ], []);

  return (
    <div className="mt-6">
      <DataTable
        title="Recent Orders"
        columns={columns}
        data={orders.slice(0, 5) || []}
        emptyStateMessage="No orders recorded yet."
      />
    </div>
  );
};

export default RecentOrders;
