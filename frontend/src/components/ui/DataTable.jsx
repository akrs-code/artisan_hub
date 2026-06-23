import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

const DataTable = ({
  title,
  subtitle,
  columns,
  data,
  emptyStateMessage = "No records found.",
  onRowClick,
  headerActions,
  footer,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="ec-card ec-card-hover overflow-hidden flex flex-col h-full group w-full">
      {/* Header */}
      {(title || headerActions) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 lg:p-6 border-b border-border gap-4 bg-card">
          <div>
            {title && <h2 className="text-[16px] lg:text-lg font-headline font-bold text-foreground leading-tight">{title}</h2>}
            {subtitle && <p className="text-[11px] lg:text-xs font-sans text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto flex-1 bg-card">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-muted/40 border-b border-border">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`py-3 px-5 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap ${header.column.columnDef.meta?.headerClassName || ''}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={`border-b border-border/50 hover:bg-muted/30 transition-colors group/row ${onRowClick ? 'cursor-pointer' : ''} ${i === table.getRowModel().rows.length - 1 ? 'border-b-0' : ''}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={`py-3 px-5 text-[13px] font-sans text-foreground align-middle ${cell.column.columnDef.meta?.cellClassName || ''}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center font-sans text-xs text-muted-foreground">
                  {emptyStateMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-border p-4 px-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
          {footer}
        </div>
      )}
    </div>
  );
};

export default DataTable;
