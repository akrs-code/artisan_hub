import React, { useMemo } from 'react';
import DataTable from '../../../components/ui/DataTable';

const StatusBadge = ({ status }) => {
  if (status === 'shipped') {
    return (
      <span className="badge-custom border border-border text-muted-foreground">
        {status}
      </span>
    );
  }
  return (
    <span className="badge-custom bg-primary/10 text-primary">
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
