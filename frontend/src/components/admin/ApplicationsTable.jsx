import React from 'react';
import { Filter, Download, ChevronRight } from 'lucide-react';
import Pagination from './Pagination';

const StatusBadge = ({ status }) => {
  const isFlagged = status === 'FLAGGED';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-center ${isFlagged ? 'bg-[#F8E2DF] text-destructive' : 'bg-[#EBE5D9] text-[#8C5233]'}`}>
      {status}
    </span>
  );
};

const ScoreBar = ({ score }) => {
  const isLow = score < 50;
  const colorClass = isLow ? 'bg-destructive' : 'bg-[#8C5233]';

  return (
    <div className="flex flex-col gap-1 w-16">
      <div className={`text-[13px] font-headline font-bold text-center ${isLow ? 'text-destructive' : 'text-[#8C5233]'}`}>
        {score}
      </div>
      <div className="h-1 w-full bg-[#EBE5D9] rounded-full overflow-hidden flex">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

const ApplicationsTable = ({ data, onFilterClick, onDownloadClick, onRowClick }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-dark/10">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Applications Overview</h2>
        <div className="flex items-center gap-4 text-neutral-dark/60">
          <button
            onClick={onFilterClick}
            className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={onDownloadClick}
            className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-dark/5 border-b border-neutral-dark/10">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Shop Name</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Category</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Applied On</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-center">Score</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Status</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick(row.name)}
                className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row cursor-pointer ${i === data.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="py-5 px-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F8F5F0] border border-[#EBE5D9] flex items-center justify-center shrink-0">
                    <row.icon className="w-5 h-5 text-[#8C5233]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-sans font-bold text-neutral-dark mb-0.5">
                      {row.name}
                    </div>
                    <div className="text-[10px] font-sans text-neutral-dark/40 tracking-widest uppercase">
                      {row.id}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4 text-[13px] font-sans text-neutral-dark/60 font-medium">
                  {row.category}
                </td>
                <td className="py-5 px-4 text-[13px] font-sans text-neutral-dark/60 font-medium">
                  {row.appliedOn}
                </td>
                <td className="py-5 px-4 flex justify-center">
                  <ScoreBar score={row.score} />
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

      {/* Footer / Pagination */}
      <div className="border-t border-neutral-dark/10 p-4 px-6 flex items-center justify-between bg-neutral-dark/5">
        <div className="text-[11px] font-sans text-neutral-dark/60">
          Showing <span className="font-bold text-neutral-dark">4</span> of <span className="font-bold text-neutral-dark">42</span> pending shops
        </div>
        <div className="scale-90 origin-right">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default ApplicationsTable;
