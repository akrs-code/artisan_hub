import React from 'react';
import { ChevronRight } from 'lucide-react';

const statusColor = (status) => {
  if (status === 'VERIFIED') return 'bg-green-100 text-green-700';
  if (status === 'FLAGGED' || status === 'REJECTED') return 'bg-red-100 text-red-700';
  if (status === 'UNDER REVIEW') return 'bg-amber-100 text-amber-700';
  return 'bg-muted text-muted-foreground';
};

const ApplicationsTable = ({ data, onRowClick }) => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-base font-headline font-bold text-foreground">All Shops</h2>
        <p className="text-xs font-sans text-muted-foreground mt-0.5">Click any row to review documents and take action.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="py-3 px-5 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Shop Name</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Category</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Registered On</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Status</th>
              <th className="py-3 px-5 text-right" />
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-sm font-sans text-muted-foreground">
                  No shops found.
                </td>
              </tr>
            ) : data.map((row, i) => (
              <tr
                key={row._id || i}
                onClick={() => onRowClick(row)}
                className={`border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer ${i === data.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="py-4 px-5">
                  <div className="text-[13px] font-sans font-bold text-foreground">{row.name}</div>
                  <div className="text-[9px] font-sans text-muted-foreground uppercase tracking-wider">{row.ownerName}</div>
                </td>
                <td className="py-4 px-4 text-[13px] font-sans text-muted-foreground">{row.category}</td>
                <td className="py-4 px-4 text-[13px] font-sans text-muted-foreground">{row.appliedOn}</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${statusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border p-4 bg-muted/20 text-[11px] font-sans text-muted-foreground">
        Showing <span className="font-bold text-foreground">{data.length}</span> shops
      </div>
    </div>
  );
};

export default ApplicationsTable;
