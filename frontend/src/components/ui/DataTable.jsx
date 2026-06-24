import React, { useState } from 'react';
import {
    useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const DataTable = ({ title, subtitle, columns, data = [], emptyStateMessage = "No records found.", onRowClick, headerActions, footer, enableSorting = true, enableGlobalFilter = true, enablePagination = true, defaultPageSize = 10,
}) => {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getFilteredRowModel: enableGlobalFilter ? getFilteredRowModel() : undefined,
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    });
    const pageCount = table.getPageCount();
    const currentPageIndex = table.getState().pagination.pageIndex;
    // Generate page numbers array with a sliding window around current page
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (pageCount <= maxVisiblePages) {
            for (let i = 0; i < pageCount; i++) pages.push(i);
        } else {
            let start = Math.max(0, currentPageIndex - 2);
            let end = Math.min(pageCount - 1, currentPageIndex + 2);
            if (currentPageIndex <= 2) {
                end = 4;
            } else if (currentPageIndex >= pageCount - 3) {
                start = pageCount - 5;
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        return pages;
    };
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full group w-full">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 lg:p-6 border-b border-border gap-4 bg-card shrink-0">
                <div className="flex-1">
                    {title && <h2 className="text-[16px] lg:text-lg font-headline font-bold text-foreground leading-tight">{title}</h2>}
                    {subtitle && <p className="text-[11px] lg:text-xs font-sans text-muted-foreground mt-1">{subtitle}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {enableGlobalFilter && (
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-9 pr-8 py-2 h-9 text-xs"
                            />
                            {globalFilter && (
                                <button
                                    onClick={() => setGlobalFilter('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
                                    aria-label="Clear search"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )}
                    {headerActions && (
                        <div className="flex items-center gap-2">
                            {headerActions}
                        </div>
                    )}
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto flex-1 bg-card">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-muted/40 border-b border-border">
                                {headerGroup.headers.map(header => {
                                    const canSort = header.column.getCanSort() && enableSorting;
                                    const isSorted = header.column.getIsSorted();
                                    return (
                                        <th key={header.id} className="py-3 px-5 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap"
                                            aria-sort={isSorted === 'asc' ? 'ascending' : isSorted === 'desc' ? 'descending' : 'none'}>
                                            {header.isPlaceholder ? null : canSort ? (
                                                <button
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors uppercase tracking-widest font-bold text-[10px] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded px-1 -mx-1 py-0.5"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    <span className="shrink-0">
                                                        {isSorted === 'asc' ? (
                                                            <ArrowUp className="w-3 h-3 text-primary" />
                                                        ) : isSorted === 'desc' ? (
                                                            <ArrowDown className="w-3 h-3 text-primary" />
                                                        ) : (
                                                            <ArrowUpDown className="w-3 h-3 text-muted-foreground/45" />
                                                        )}
                                                    </span>
                                                </button>
                                            ) : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, i) => (
                                <tr key={row.id} onClick={() => onRowClick && onRowClick(row.original)} className={`border-b border-border/50 hover:bg-muted/30 transition-colors group/row ${onRowClick ? 'cursor-pointer' : ''} ${i === table.getRowModel().rows.length - 1 ? 'border-b-0' : ''}`}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className={`py-3.5 px-5 text-[13px] font-sans text-foreground align-middle ${cell.column.columnDef.meta?.cellClassName || ''}`}>
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

            {/* Footer / Pagination */}
            {footer ? (
                <div className="border-t border-border p-4 px-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10 shrink-0">
                    {footer}
                </div>
            ) : enablePagination && pageCount > 1 ? (
                <div className="border-t border-border p-4 px-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10 shrink-0">
                    <div className="text-xs font-sans text-muted-foreground w-full text-center sm:text-left">
                        Showing page <span className="font-semibold text-foreground">{currentPageIndex + 1}</span> of <span className="font-semibold text-foreground">{pageCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 w-full justify-center sm:justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 w-8 p-0 shrink-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {getPageNumbers().map(pageNum => (
                            <Button
                                key={pageNum}
                                variant={currentPageIndex === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => table.setPageIndex(pageNum)}
                                className={`h-8 w-8 p-0 text-xs font-sans shrink-0 ${currentPageIndex === pageNum ? 'font-bold' : ''}`}
                            >
                                {pageNum + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-8 w-8 p-0 shrink-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default DataTable;
