import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import DataTable from '../../../components/ui/DataTable';

const ApplicationsTable = ({ data, onRowClick }) => {
  const columns = useMemo(() => [
    {
      header: 'Shop Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-sans font-semibold text-foreground">{row.original.name}</div>
          <div className="text-[10px] font-sans text-muted-foreground mt-0.5">{row.original.ownerName}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => <span className="text-sm font-sans text-muted-foreground">{row.original.category}</span>
    },
    {
      header: 'Registered On',
      accessorKey: 'appliedOn',
      cell: ({ row }) => <span className="text-sm font-sans text-muted-foreground">{row.original.appliedOn}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      header: '',
      id: 'actions',
      meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
      cell: () => <ChevronRight className="w-4 h-4 text-muted-foreground/50 inline-block" />
    }
  ], []);

  return (
    <DataTable
      title="All Shops"
      subtitle="Click any row to review documents and take action."
      columns={columns}
      data={data || []}
      emptyStateMessage="No shops found."
      onRowClick={onRowClick}
      headerActions={
        <span className="text-xs font-sans text-muted-foreground">
          {data.length} total
        </span>
      }
      footer={
        <div className="text-xs font-sans text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{data.length}</span> shops
        </div>
      }
    />
  );
};

export default ApplicationsTable;
