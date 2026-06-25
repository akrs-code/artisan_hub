import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import Pagination from '../common/Pagination';
import DataTable from '../../../components/ui/DataTable';
import StatusBadge from '../../../components/ui/StatusBadge';

const InventoryTable = ({ items, totalItems, currentlyShowing, onUpdateStock }) => {

  const columns = useMemo(() => [
    {
      header: 'Product Name',
      accessorKey: 'name',
      meta: { headerClassName: 'w-[20%]' },
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">
          {row.original.name}
        </span>
      )
    },
    {
      header: 'Description',
      accessorKey: 'description',
      meta: { headerClassName: 'w-[25%]' },
      cell: ({ row }) => (
        <span className="text-[11px] font-sans text-muted-foreground truncate max-w-[200px] block">
          {row.original.description || '-'}
        </span>
      )
    },
    {
      header: 'SKU',
      accessorKey: 'sku',
      cell: ({ row }) => (
        <span className="text-[11px] font-sans font-medium text-primary">
          {row.original.sku.substring(0, 8)}...
        </span>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => (
        <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
          {row.original.category}
        </span>
      )
    },
    {
      header: 'Current Stock',
      accessorKey: 'currentStock',
      meta: { headerClassName: 'text-center w-[20%]', cellClassName: 'text-center' },
      cell: ({ row }) => (
        <span className={`text-[12px] font-sans font-bold ${row.original.currentStock === 0 ? 'text-destructive' : 'text-foreground'}`}>
          {row.original.currentStock} pcs
        </span>
      )
    },
    {
      header: 'Reorder Point',
      accessorKey: 'reorderPoint',
      meta: { headerClassName: 'text-center', cellClassName: 'text-center text-[12px] font-sans text-muted-foreground font-medium' },
      cell: ({ row }) => row.original.reorderPoint ? `${row.original.reorderPoint} pcs` : ''
    },
    {
      header: 'Status',
      accessorKey: 'status',
      meta: { headerClassName: 'text-center', cellClassName: 'flex justify-center' },
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      header: 'Actions',
      id: 'actions',
      meta: { headerClassName: 'text-center w-[10%]', cellClassName: 'text-center align-middle' },
      cell: () => (
        <div className="flex items-center justify-center w-full">
          <button className="text-muted-foreground hover:text-primary transition-colors p-1 flex items-center justify-center" title="View Details">
              <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ], []);

  const totalPages = Math.max(1, Math.ceil(Number(totalItems) / Math.max(1, Number(currentlyShowing))));

  return (
    <div className="mt-6">
      <DataTable
        title="Stock Inventory List"
        columns={columns}
        data={items || []}
        emptyStateMessage="No inventory items found."
        footer={
          <>
            <div className="text-[11px] font-sans text-muted-foreground w-full sm:w-auto text-center sm:text-left">
              Showing <span className="font-bold text-foreground">{currentlyShowing}</span> of <span className="font-bold text-foreground">{totalItems}</span> items
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
    </div>
  );
};

export default InventoryTable;
