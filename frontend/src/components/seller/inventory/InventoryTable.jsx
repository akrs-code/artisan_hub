import React, { useState, useMemo } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import Pagination from '../common/Pagination'; 
import DataTable from '../../../components/ui/DataTable';
import StatusBadge from '../../../components/ui/StatusBadge';

const InventoryTable = ({ items, totalItems, currentlyShowing, onUpdateStock }) => {
  const [editingSku, setEditingSku] = useState(null);
  const [editingStockValue, setEditingStockValue] = useState(0);

  const startEditing = (item) => {
    setEditingSku(item.sku);
    setEditingStockValue(item.currentStock);
  };

  const cancelEditing = () => {
    setEditingSku(null);
  };

  const saveStock = async (sku) => {
    if (onUpdateStock) {
      await onUpdateStock(sku, editingStockValue);
    }
    setEditingSku(null);
  };

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
      cell: ({ row }) => {
        const item = row.original;
        if (editingSku === item.sku) {
          return (
            <div className="flex items-center justify-center gap-1.5">
              <input
                type="number"
                value={editingStockValue}
                onChange={(e) => setEditingStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center border border-border rounded px-1.5 py-0.5 font-sans font-bold text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={() => saveStock(item.sku)} className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Save">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={cancelEditing} className="p-1 text-destructive hover:bg-red-50 rounded transition-colors" title="Cancel">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center gap-2 group/edit">
            <span className={`text-[12px] font-sans font-bold ${item.currentStock === 0 ? 'text-destructive' : 'text-foreground'}`}>
              {item.currentStock} pcs
            </span>
            <button onClick={() => startEditing(item)} className="p-1 text-muted-foreground hover:text-primary rounded opacity-0 group-hover/row:opacity-100 transition-opacity" title="Edit Stock">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      }
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
      meta: { headerClassName: 'text-right', cellClassName: 'flex justify-end' },
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    }
  ], [editingSku, editingStockValue, saveStock, cancelEditing, startEditing]);

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
                  onPageChange={() => {}} 
                />
            </div>
          </>
        }
      />
    </div>
  );
};

export default InventoryTable;
