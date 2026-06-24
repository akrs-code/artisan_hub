import React, { useMemo } from 'react';
import { Store } from 'lucide-react';
import DataTable from '../../ui/DataTable';

const CategoryPerformanceTable = ({ data }) => {
  const columns = useMemo(() => [
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Store className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[13px] font-sans font-bold text-foreground">
            {row.original.category?.name || 'Uncategorized'}
          </span>
        </div>
      )
    },
    {
      header: 'Total Shops',
      accessorKey: 'activeShops',
      cell: ({ row }) => (
        <span className="text-[13px] font-sans font-semibold text-foreground">
          {row.original.activeShops}
        </span>
      )
    }
  ], []);

  return (
    <div className="w-full">
      <DataTable
        title="Shops by Category"
        subtitle="Number of registered shops in each craft category."
        columns={columns}
        data={data || []}
        emptyStateMessage="No category data available."
      />
    </div>
  );
};

export default CategoryPerformanceTable;
