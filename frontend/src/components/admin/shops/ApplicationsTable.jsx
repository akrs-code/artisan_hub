import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';
import DataTable from '../../../components/ui/DataTable';

const ApplicationsTable = ({ data, onRowClick }) => {
  const columns = useMemo(() => [
    {
      header: 'Shop Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">
          {row.original.name}
        </span>
      )
    },
    {
      header: 'Owner Name',
      accessorKey: 'ownerName',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans text-muted-foreground leading-tight block">
          {row.original.owner?.name || row.original.ownerName || '—'}
        </span>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => <span className="text-[12px] font-sans text-muted-foreground leading-tight block">{row.original.category}</span>
    },
    {
      header: 'Registered On',
      accessorKey: 'appliedOn',
      cell: ({ row }) => <span className="text-[12px] font-sans text-muted-foreground leading-tight block">{row.original.appliedOn}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      header: 'Actions',
      id: 'actions',
      meta: { headerClassName: 'text-center', cellClassName: 'flex justify-center' },
      cell: () => (
        <button className="text-muted-foreground hover:text-primary transition-colors p-1" title="View Details">
            <Eye className="w-4 h-4" />
        </button>
      )
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
      footer={
        <div className="text-xs font-sans text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{data.length}</span> shops
        </div>
      }
    />
  );
};

export default ApplicationsTable;
