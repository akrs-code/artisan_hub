import React from 'react';

// ── Shared status badge utility ───────────────────────────────────────────────
export const statusVariants = {
  VERIFIED:    'bg-green-50 text-green-700 border border-green-200',
  ACTIVE:      'bg-green-50 text-green-700 border border-green-200',
  DELIVERED:   'bg-green-50 text-green-700 border border-green-200',
  COMPLETED:   'bg-green-50 text-green-700 border border-green-200',
  PENDING:     'bg-amber-50 text-amber-700 border border-amber-200',
  'UNDER REVIEW': 'bg-amber-50 text-amber-700 border border-amber-200',
  CONFIRMED:   'bg-blue-50 text-blue-700 border border-blue-200',
  ACCEPTED:    'bg-blue-50 text-blue-700 border border-blue-200',
  APPROVED:    'bg-blue-50 text-blue-700 border border-blue-200',
  SUSPENDED:   'bg-destructive/10 text-destructive border border-destructive/20',
  REJECTED:    'bg-destructive/10 text-destructive border border-destructive/20',
  FLAGGED:     'bg-destructive/10 text-destructive border border-destructive/20',
  HIDDEN:      'bg-destructive/10 text-destructive border border-destructive/20',
  CANCELLED:   'bg-destructive/10 text-destructive border border-destructive/20',
};

export const StatusBadge = ({ status }) => {
  const cls = statusVariants[status] || 'bg-muted text-muted-foreground border border-border';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};

export default StatusBadge;
