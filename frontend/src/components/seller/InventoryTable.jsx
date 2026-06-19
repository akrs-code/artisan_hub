import React from 'react';
import { Filter, Download } from 'lucide-react';
import Pagination from './Pagination'; // Reuse the Pagination component

const StatusBadge = ({ status }) => {
  let badgeStyle = "bg-[#EBE5D9] text-neutral-dark/70"; // IN STOCK
  if (status === 'LOW STOCK') {
    badgeStyle = "bg-[#F8E2DF] text-[#C85746]";
  } else if (status === 'OUT OF STOCK') {
    badgeStyle = "bg-[#F8E2DF] text-destructive";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase text-center leading-tight whitespace-pre-wrap min-w-[70px] justify-center ${badgeStyle}`}>
      {status.replace(' ', '\n')}
    </span>
  );
};

const InventoryTable = ({ items, totalItems, currentlyShowing }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden mt-6 flex flex-col group hover:card-custom-hover">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-dark/10">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Stock Inventory List</h2>
        <div className="flex items-center gap-4 text-neutral-dark/60">
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"><Filter className="w-4 h-4" /></button>
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"><Download className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-dark/5">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase w-[35%]">Item Details</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">SKU</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Category</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-center">Current Stock</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-center">Reorder Point</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.sku} className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row ${i === items.length - 1 ? 'border-b-0' : ''}`}>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-neutral-dark/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-sans font-bold text-neutral-dark group-hover/row:text-primary transition-colors leading-tight mb-0.5">{item.name}</h4>
                      <p className="text-[10px] font-sans text-neutral-dark/50 leading-snug">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <div className="text-[12px] font-sans font-medium text-[#8C5233] w-20 leading-tight">
                    {item.sku.split('-').map((part, index) => (
                      <React.Fragment key={index}>
                        {part}{index < item.sku.split('-').length - 1 ? '-' : ''}<br/>
                      </React.Fragment>
                    ))}
                  </div>
                </td>
                <td className="py-5 px-4">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-dark/10 text-[9px] font-bold tracking-widest text-neutral-dark/60 uppercase">
                    {item.category}
                  </span>
                </td>
                <td className="py-5 px-4 text-center">
                  <span className={`text-[13px] font-sans font-bold ${item.currentStock === 0 ? 'text-destructive' : 'text-neutral-dark'}`}>
                    {item.currentStock} pcs
                  </span>
                </td>
                <td className="py-5 px-4 text-center text-[13px] font-sans text-neutral-dark/60 font-medium">
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
      <div className="border-t border-neutral-dark/10 p-4 px-6 flex items-center justify-between bg-neutral-dark/5">
        <div className="text-[11px] font-sans text-neutral-dark/60">
          Showing <span className="font-bold text-neutral-dark">{currentlyShowing}</span> of <span className="font-bold text-neutral-dark">{totalItems}</span> items
        </div>
        <div className="scale-90 origin-right">
            <Pagination />
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
