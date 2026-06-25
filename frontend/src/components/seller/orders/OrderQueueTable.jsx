import React, { useMemo } from 'react';
import Pagination from '../common/Pagination';
import { Eye } from 'lucide-react';
import DataTable from '../../../components/ui/DataTable';
import StatusBadge from '../../../components/ui/StatusBadge';

const OrderQueueTable = ({ orders, totalOrders, currentlyShowing, onSelectOrder }) => {
  const columns = useMemo(() => [
    {
      header: 'Order ID',
      accessorKey: '_id',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-primary leading-tight">
          {row.original._id.substring(0, 8)}...
        </span>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        const dateStr = new Date(row.original.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        return <span className="text-[12px] font-sans text-muted-foreground leading-tight">{dateStr}</span>;
      },
    },
    {
      header: 'Customer',
      accessorKey: 'buyer',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-foreground block leading-tight">
          {row.original.buyer?.name || 'Guest Buyer'}
        </span>
      ),
    },
    {
      header: 'Products',
      accessorKey: 'items',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans text-muted-foreground font-medium truncate max-w-[200px] block">
          {row.original.items.map(item => `${item.quantity}x ${item.name || item.product?.title || 'Item'}`).join(', ')}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessorKey: 'paymentMethod',
      cell: ({ row }) => {
        const isCod = row.original.paymentMethod === 'cod';
        return (
          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest font-bold ${isCod ? 'bg-amber-100 text-amber-800' : 'bg-primary/10 text-primary'}`}>
            {isCod ? 'COD' : 'Card'}
          </span>
        );
      },
    },
    {
      header: 'Total',
      accessorKey: 'total',
      meta: {
        headerClassName: 'text-right',
        cellClassName: 'text-right',
      },
      cell: ({ row }) => {
        const formattedTotal = (row.original.total / 100).toLocaleString('en-PH', {
          style: 'currency',
          currency: 'PHP',
        });
        return (
          <span className="text-[12px] font-sans font-bold text-foreground leading-tight">{formattedTotal}</span>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      meta: {
        headerClassName: 'text-center',
        cellClassName: 'flex justify-center',
      },
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: 'Actions',
      id: 'actions',
      meta: {
        headerClassName: 'text-center',
        cellClassName: 'flex justify-center',
      },
      cell: () => (
        <button className="text-muted-foreground hover:text-primary transition-colors p-1" title="View Details">
            <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ], []);

  const totalPages = Math.max(1, Math.ceil(Number(totalOrders) / Math.max(1, Number(currentlyShowing))));

  return (
    <DataTable
      title="Recent Orders Queue"
      columns={columns}
      data={orders || []}
      emptyStateMessage="No orders found."
      onRowClick={onSelectOrder}
      footer={
        <>
          <div className="text-[11px] font-sans text-muted-foreground">
            Showing <span className="font-bold text-foreground">{currentlyShowing}</span> of <span className="font-bold text-foreground">{totalOrders}</span> orders
          </div>
          <div className="scale-90 origin-right">
            <Pagination
              currentPage={1}
              totalPages={totalPages}
              onPageChange={() => { }}
            />
          </div>
        </>
      }
    />
  );
};

export default OrderQueueTable;
