import React from 'react';

const AuditSummaryCard = ({ onReviewClick }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 h-full flex flex-col justify-between relative overflow-hidden">
      {/* Subtle ambient */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-xl font-headline font-bold text-foreground mb-3">
          Automated Audit Summary
        </h2>
        <p className="text-sm font-sans text-muted-foreground leading-relaxed max-w-md">
          The platform AI has analyzed the last 500 transactions. No systemic anomalies detected, but 2 shops are flagged for manual review based on volume spikes.
        </p>
      </div>

      <div className="flex items-center gap-4 mt-8 relative z-10">
        <button
          onClick={onReviewClick}
          className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans font-semibold uppercase tracking-wide transition-colors shadow-sm"
        >
          Review Flags
        </button>
      </div>
    </div>
  );
};

export default AuditSummaryCard;
