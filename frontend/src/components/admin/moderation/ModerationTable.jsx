import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import Pagination from '../common/Pagination';
import { StatusBadge } from '../common/StatusBadge';
import DataTable from '../../../components/ui/DataTable';

// ── Violation Badge ───────────────────────────────────────────────────────────
const violationVariants = {
  COPYRIGHT:  'bg-destructive/10 text-destructive border border-destructive/20',
  QUALITY:    'bg-amber-50 text-amber-700 border border-amber-200',
  PROHIBITED: 'bg-muted text-muted-foreground border border-border',
};

const ViolationBadge = ({ type }) => {
  const cls = violationVariants[type] || 'bg-muted text-muted-foreground border border-border';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold tracking-widest uppercase ${cls}`}>
      {type}
    </span>
  );
};

// ── Severity Bar ─────────────────────────────────────────────────────────────
const SeverityBar = ({ score }) => {
  let barColor = 'bg-muted-foreground/30';
  let textColor = 'text-muted-foreground';
  if (score >= 80) { barColor = 'bg-destructive'; textColor = 'text-destructive'; }
  else if (score >= 40) { barColor = 'bg-amber-500'; textColor = 'text-amber-600'; }

  return (
    <div className="flex flex-col gap-1 w-12">
      <div className={`text-sm font-headline font-bold text-center ${textColor}`}>{score}</div>
      <div className="h-1 w-full bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ModerationTable = ({ data, onFilterClick, onReviewClick }) => {
  const columns = useMemo(() => [
    {
      header: 'Product & ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center border border-border/50">
            <img src={row.original.image} alt={row.original.productName} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-sans font-semibold text-foreground">{row.original.productName}</div>
            <div className="text-[10px] font-sans text-muted-foreground tracking-widest uppercase">{row.original.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Shop',
      accessorKey: 'shopName',
      cell: ({ row }) => <span className="text-sm font-sans font-medium text-primary">{row.original.shopName}</span>,
    },
    {
      header: 'Violation',
      accessorKey: 'violation',
      cell: ({ row }) => <ViolationBadge type={row.original.violation} />,
    },
    {
      header: 'Flagged On',
      accessorKey: 'flaggedDate',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-sans text-muted-foreground">{row.original.flaggedDate}</div>
          <div className="text-[10px] font-sans text-muted-foreground/60 uppercase">{row.original.flaggedTime}</div>
        </div>
      ),
    },
    {
      header: 'Severity',
      accessorKey: 'severity',
      meta: {
        headerClassName: 'text-center',
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <SeverityBar score={row.original.severity} />
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={row.original.status} />
          <button
            onClick={() => onReviewClick(row.original.productName)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-sans font-semibold text-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer"
          >
            Review
          </button>
        </div>
      ),
    },
  ], [onReviewClick]);

  return (
    <DataTable
      title="Moderation Queue"
      subtitle="Review flagged listings and take action."
      columns={columns}
      data={data || []}
      emptyStateMessage="No tickets found."
      headerActions={
        <>
          <button
            onClick={() => onFilterClick('Violation')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-sans font-semibold text-foreground transition-colors"
          >
            All Violations
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={() => onFilterClick('Severity')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-sans font-semibold text-foreground transition-colors"
          >
            Severity: High First
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </>
      }
      footer={
        <>
          <div className="text-xs font-sans text-muted-foreground w-full sm:w-auto text-center sm:text-left">
            Showing <span className="font-semibold text-foreground">1</span> to{' '}
            <span className="font-semibold text-foreground">10</span> of{' '}
            <span className="font-semibold text-foreground">124</span> tickets
          </div>
          <Pagination 
            currentPage={1} 
            totalPages={Math.max(1, Math.ceil(124 / 10))} 
            onPageChange={() => {}} 
          />
        </>
      }
    />
  );
};

export default ModerationTable;
