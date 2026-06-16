import React from 'react';
import { ChevronDown, Download } from 'lucide-react';
import Pagination from '../seller/Pagination';

const ViolationBadge = ({ type }) => {
  let styleClass = "bg-neutral-dark/10 text-neutral-dark/60"; // Default
  if (type === 'COPYRIGHT') {
    styleClass = "bg-[#F8E2DF] text-destructive"; // Pink/Red
  } else if (type === 'QUALITY') {
    styleClass = "bg-[#FDF3E1] text-[#B7791F]"; // Yellow/Orange
  } else if (type === 'PROHIBITED') {
    styleClass = "bg-[#E2E8F0] text-[#4A5568]"; // Gray
  }

  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase border border-neutral-dark/5 ${styleClass}`}>
      {type}
    </span>
  );
};

const SeverityBar = ({ score }) => {
  let colorClass = "bg-[#CBD5E1] text-[#64748B]"; // Default gray (<30)
  if (score >= 80) {
    colorClass = "bg-destructive text-destructive"; // High (red)
  } else if (score >= 40) {
    colorClass = "bg-[#ED8936] text-[#DD6B20]"; // Medium (orange)
  }

  return (
    <div className="flex flex-col gap-1 w-12">
      <div className={`text-[13px] font-headline font-bold text-center ${colorClass.split(' ')[1]}`}>
        {score}
      </div>
      <div className="h-1 w-full bg-[#EBE5D9] rounded-full overflow-hidden flex">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClass.split(' ')[0]}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

const StatusDisplay = ({ status }) => {
  if (status === 'ESCALATED') {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
        <span className="text-[9px] font-bold tracking-widest uppercase text-destructive">
          ESCALATED
        </span>
      </div>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EBE5D9] text-[#8C5233] text-[9px] font-bold tracking-widest uppercase text-center">
      {status}
    </span>
  );
};

const ModerationTable = ({ data, onFilterClick, onDownloadClick, onReviewClick }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-neutral-dark/10 gap-4">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Moderation Queue</h2>
        <div className="flex items-center gap-4 text-neutral-dark/60">
          <button 
            onClick={() => onFilterClick('Violation')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-dark/10 bg-neutral-dark/5 hover:bg-neutral-dark/10 text-[11px] font-sans font-bold text-neutral-dark transition-colors uppercase tracking-wider"
          >
            ALL VIOLATION TYPES
            <ChevronDown className="w-3 h-3 text-neutral-dark/50" />
          </button>
          <button 
            onClick={() => onFilterClick('Severity')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-dark/10 bg-neutral-dark/5 hover:bg-neutral-dark/10 text-[11px] font-sans font-bold text-neutral-dark transition-colors uppercase tracking-wider"
          >
            SEVERITY: HIGH FIRST
            <ChevronDown className="w-3 h-3 text-neutral-dark/50" />
          </button>
          <div className="w-px h-5 bg-neutral-dark/10 mx-1"></div>
          <button 
            onClick={onDownloadClick}
            className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1 pb-24"> {/* Extra padding bottom for the floating bar */}
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-neutral-dark/5 border-b border-neutral-dark/10">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Product & ID</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Shop Name</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Violation</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Flagged On</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-center">Severity</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr 
                key={i} 
                className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row ${i === data.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="py-5 px-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-dark/10 overflow-hidden shrink-0 flex items-center justify-center">
                    <img src={row.image} alt={row.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[13px] font-sans font-bold text-neutral-dark mb-0.5">
                      {row.productName}
                    </div>
                    <div className="text-[10px] font-sans text-neutral-dark/40 tracking-widest uppercase">
                      {row.id}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <a href="#" className="text-[13px] font-sans font-medium text-[#8C5233] hover:underline underline-offset-2">
                    {row.shopName}
                  </a>
                </td>
                <td className="py-5 px-4">
                  <ViolationBadge type={row.violation} />
                </td>
                <td className="py-5 px-4">
                  <div className="text-[13px] font-sans text-neutral-dark/60 font-medium mb-0.5">
                    {row.flaggedDate}
                  </div>
                  <div className="text-[10px] font-sans text-neutral-dark/40 uppercase">
                    {row.flaggedTime}
                  </div>
                </td>
                <td className="py-5 px-4 flex justify-center">
                  <SeverityBar score={row.severity} />
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-between gap-4">
                    <StatusDisplay status={row.status} />
                    <button 
                      onClick={() => onReviewClick(row.productName)}
                      className="px-4 py-1.5 rounded-md border border-neutral-dark/20 text-neutral-dark text-[11px] font-sans font-bold hover:bg-neutral-dark/5 transition-colors shadow-sm bg-background shrink-0"
                    >
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-neutral-dark/10 p-4 px-6 flex items-center justify-between bg-neutral-dark/5 relative z-10">
        <div className="text-[11px] font-sans text-neutral-dark/60">
          Showing <span className="font-bold text-neutral-dark">1</span> to <span className="font-bold text-neutral-dark">10</span> of <span className="font-bold text-neutral-dark">124</span> tickets
        </div>
        <div className="scale-90 origin-right">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default ModerationTable;
