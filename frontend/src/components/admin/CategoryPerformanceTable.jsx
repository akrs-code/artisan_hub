import React from 'react';
import { Store } from 'lucide-react';

const CategoryPerformanceTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-sm font-sans text-muted-foreground">No category data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-base font-headline font-bold text-foreground">Shops by Category</h2>
        <p className="text-xs font-sans text-muted-foreground mt-0.5">Number of registered shops in each craft category.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="py-3 px-5 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Category</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Total Shops</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${i === data.length - 1 ? 'border-b-0' : ''}`}>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Store className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-[13px] font-sans font-bold text-foreground">
                      {row.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[13px] font-sans font-semibold text-foreground">
                  {row.activeShops}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryPerformanceTable;
