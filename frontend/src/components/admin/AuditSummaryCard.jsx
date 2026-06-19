import React from 'react';

const AuditSummaryCard = ({ onReviewClick, onDownloadClick }) => {
  return (
    <div className="card-custom !p-8 h-full flex flex-col justify-between relative overflow-hidden group hover:card-custom-hover">
      {/* Background Graphic Suggestion */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-neutral-dark/5 to-transparent pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-xl font-headline font-bold text-neutral-dark mb-4">
          Automated Audit Summary
        </h2>
        <p className="text-[13px] font-sans text-neutral-dark/70 leading-relaxed max-w-md">
          The platform AI has analyzed the last 500 transactions. No systemic anomalies detected, but 2 shops are flagged for manual review based on volume spikes.
        </p>
      </div>

      <div className="flex items-center gap-4 mt-8 relative z-10">
        <button 
          onClick={onReviewClick}
          className="px-6 py-2.5 rounded-md bg-[#8C5233] hover:bg-[#7E4A2E] text-white text-[11px] tracking-widest font-sans font-bold uppercase transition-colors shadow-sm"
        >
          Review Flags
        </button>
        <button 
          onClick={onDownloadClick}
          className="px-6 py-2.5 rounded-md border border-[#8C5233] text-[#8C5233] hover:bg-[#8C5233]/5 text-[11px] tracking-widest font-sans font-bold uppercase transition-colors"
        >
          Download Audit
        </button>
      </div>
    </div>
  );
};

export default AuditSummaryCard;
