import React, { useState } from 'react';
import { Filter, Download, Edit2, Check, X } from 'lucide-react';
import Pagination from './Pagination'; 

const StatusBadge = ({ status }) => {
  let badgeStyle = "bg-muted text-muted-foreground"; 
  if (status === 'LOW STOCK') {
    badgeStyle = "bg-destructive/10 text-destructive";
  } else if (status === 'OUT OF STOCK') {
    badgeStyle = "bg-destructive/10 text-destructive";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase text-center leading-tight whitespace-pre-wrap min-w-[70px] justify-center ${badgeStyle}`}>
      {status.replace(' ', '\n')}
    </span>
  );
};

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

  return (
    <div className="card-custom !p-0 overflow-hidden mt-6 flex flex-col group hover:card-custom-hover">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h2 className="text-lg font-headline font-bold text-foreground">Stock Inventory List</h2>
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"><Filter className="w-4 h-4" /></button>
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"><Download className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase w-[35%]">Item Details</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">SKU</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Category</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase text-center w-[20%]">Current Stock</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase text-center">Reorder Point</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.sku} className={`border-b border-border/50 hover:bg-muted/50 transition-colors group/row ${i === items.length - 1 ? 'border-b-0' : ''}`}>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-border">
                      <img src={item.image || 'https://placehold.co/100x100?text=Product'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-sans font-bold text-foreground group-hover/row:text-primary transition-colors leading-tight mb-0.5">{item.name}</h4>
                      <p className="text-[10px] font-sans text-muted-foreground leading-snug">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <span className="text-[11px] font-sans font-medium text-primary">
                    {item.sku.substring(0, 8)}...
                  </span>
                </td>
                <td className="py-5 px-4">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                    {item.category}
                  </span>
                </td>
                <td className="py-5 px-4 text-center">
                  {editingSku === item.sku ? (
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
                  ) : (
                    <div className="flex items-center justify-center gap-2 group/edit">
                      <span className={`text-[13px] font-sans font-bold ${item.currentStock === 0 ? 'text-destructive' : 'text-foreground'}`}>
                        {item.currentStock} pcs
                      </span>
                      <button onClick={() => startEditing(item)} className="p-1 text-muted-foreground hover:text-primary rounded opacity-0 group-hover/row:opacity-100 transition-opacity" title="Edit Stock">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-5 px-4 text-center text-[13px] font-sans text-muted-foreground font-medium">
                  {item.reorderPoint ? `${item.reorderPoint} pcs` : ''}
                </td>
                <td className="py-5 px-6 flex justify-end">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-border p-4 px-6 flex items-center justify-between bg-muted/50">
        <div className="text-[11px] font-sans text-muted-foreground">
          Showing <span className="font-bold text-foreground">{currentlyShowing}</span> of <span className="font-bold text-foreground">{totalItems}</span> items
        </div>
        <div className="scale-90 origin-right">
            <Pagination />
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
