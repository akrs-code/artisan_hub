import React from 'react';
import { Filter, ChevronDown, ChevronRight } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const isTrending = status === 'TRENDING';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-center ${isTrending ? 'bg-[#F5EDE8] text-[#8C5233]' : 'bg-[#EBE5D9] text-neutral-dark/60'}`}>
      {status}
    </span>
  );
};

const CategoryPerformanceTable = ({ data, onViewDetailedAnalyticsClick, onAllRegionsClick }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-neutral-dark/10 gap-4">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Shop Performance by Category</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={onAllRegionsClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-dark/10 bg-transparent hover:bg-neutral-dark/5 text-[11px] font-sans text-neutral-dark transition-colors"
          >
            All Regions
            <ChevronDown className="w-3.5 h-3.5 text-neutral-dark/50" />
          </button>
          <button className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1">
            <Filter className="w-4 h-4 text-neutral-dark/60" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-neutral-dark/5 border-b border-neutral-dark/10">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Category</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Active Shops</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Avg. Sales</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Growth</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Status</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row cursor-pointer ${i === data.length - 1 ? 'border-b-0' : ''}`}>
                <td className="py-5 px-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#F5EDE8] flex items-center justify-center shrink-0">
                    <row.category.icon className="w-4 h-4 text-[#8C5233]" />
                  </div>
                  <span className="text-[13px] font-sans font-bold text-neutral-dark">
                    {row.category.name}
                  </span>
                </td>
                <td className="py-5 px-4 text-[13px] font-sans text-neutral-dark/60 font-medium">
                  {row.activeShops}
                </td>
                <td className="py-5 px-4 text-[13px] font-sans font-bold text-neutral-dark">
                  {row.avgSales}
                </td>
                <td className="py-5 px-4">
                  <span className={`text-[13px] font-sans font-bold ${row.growth.startsWith('+') ? 'text-[#C85746]' : 'text-destructive'}`}>
                    {row.growth}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-5 px-6 text-right">
                  <ChevronRight className="w-4 h-4 text-neutral-dark/30 inline-block group-hover/row:text-neutral-dark/60 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Link */}
      <div 
        onClick={onViewDetailedAnalyticsClick}
        className="border-t border-neutral-dark/10 p-4 px-6 text-center bg-transparent hover:bg-neutral-dark/5 transition-colors cursor-pointer"
      >
        <span className="text-[11px] font-sans font-bold tracking-widest text-[#8C5233] hover:text-[#7E4A2E] transition-colors">
          View Detailed Analytics
        </span>
      </div>
    </div>
  );
};

export default CategoryPerformanceTable;
