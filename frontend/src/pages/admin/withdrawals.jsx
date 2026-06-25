import { useState, useEffect, useMemo } from 'react';
import { Search, CheckCircle, XCircle, Loader2, Banknote, Eye } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { StatusBadge } from '../../components/admin/common/StatusBadge';
import DataTable from '../../components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const WithdrawalDetailModal = ({ withdrawal, onClose, onUpdateStatus }) => {
    if (!withdrawal) return null;
    return (
        <Dialog open={!!withdrawal} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden gap-0 border-border shadow-xl bg-card">
                <DialogHeader className="px-6 py-4 border-b border-border bg-muted/20">
                    <DialogTitle className="text-lg font-headline font-bold text-foreground">
                        Withdrawal Request
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-5">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Account Information</p>
                        <p className="text-sm font-semibold text-foreground">{withdrawal.method.toUpperCase()} - {withdrawal.accountName}</p>
                        <p className="text-sm font-mono text-muted-foreground mt-0.5">{withdrawal.accountNumber}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Requested Amount</p>
                        <p className="text-2xl font-headline font-bold text-foreground">
                            {(withdrawal.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Current Status</p>
                        <StatusBadge status={withdrawal.status} />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-border bg-muted/20 flex flex-col gap-2">
                    {withdrawal.status === 'pending' && (
                        <>
                            <Button className="w-full flex items-center justify-center gap-2" onClick={() => { onUpdateStatus(withdrawal._id, 'approved'); onClose(); }}>
                                <CheckCircle className="w-4 h-4" /> Approve
                            </Button>
                            <Button variant="destructive" className="w-full flex items-center justify-center gap-2" onClick={() => { onUpdateStatus(withdrawal._id, 'rejected'); onClose(); }}>
                                <XCircle className="w-4 h-4" /> Reject
                            </Button>
                        </>
                    )}
                    {withdrawal.status === 'approved' && (
                        <Button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700" onClick={() => { onUpdateStatus(withdrawal._id, 'completed'); onClose(); }}>
                            <Banknote className="w-4 h-4" /> Mark as Paid
                        </Button>
                    )}
                    <Button variant="outline" className="w-full mt-2" onClick={onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getWithdrawals();
            if (res?.data) setWithdrawals(res.data);
        } catch (error) {
            console.error('Failed to load withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await adminAPI.updateWithdrawalStatus(id, status, `Payout ${status} by admin`);
            fetchWithdrawals();
        } catch (error) {
            console.error(`Failed to mark withdrawal as ${status}:`, error);
        }
    };

    // Map payout status to our unified badge vocabulary
    const normalizeStatus = (s) => {
        const map = { completed: 'COMPLETED', rejected: 'REJECTED', approved: 'APPROVED', pending: 'PENDING' };
        return map[s] || s.toUpperCase();
    };

    const columns = useMemo(() => [
        {
            header: 'Requested On',
            accessorKey: 'createdAt',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans text-muted-foreground leading-tight block whitespace-nowrap">
                    {new Date(row.original.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            )
        },
        {
            header: 'Shop',
            accessorKey: 'shop',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">{row.original.shop?.name || 'Unknown Shop'}</span>
            )
        },
        {
            header: 'Payout Method',
            accessorKey: 'method',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans text-muted-foreground leading-tight block uppercase tracking-widest font-bold">
                    {row.original.method}
                </span>
            )
        },
        {
            header: 'Account Name',
            accessorKey: 'accountName',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">
                    {row.original.accountName}
                </span>
            )
        },
        {
            header: 'Account Number',
            accessorKey: 'accountNumber',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans text-muted-foreground font-mono leading-tight block">
                    {row.original.accountNumber}
                </span>
            )
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">
                    {(row.original.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                </span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => (
                <StatusBadge status={normalizeStatus(row.original.status)} />
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            meta: { headerClassName: 'text-center', cellClassName: 'flex justify-center' },
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedWithdrawal(row.original)}
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                    title="View Details"
                >
                    <Eye className="w-4 h-4" />
                </button>
            )
        }
    ], [handleUpdateStatus]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-sans text-muted-foreground">Loading withdrawal requests...</p>
            </div>
        );
    }

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
                        Payout Requests
                    </h1>
                    <p className="text-muted-foreground font-sans text-xs">
                        Review, approve, and process seller withdrawal requests.
                    </p>
                </div>
            </div>

            <div className="w-full">
                <DataTable
                    title="All Requests"
                    columns={columns}
                    data={withdrawals}
                    emptyStateMessage="No withdrawals matching your search."
                />
            </div>

            <WithdrawalDetailModal
                withdrawal={selectedWithdrawal}
                onClose={() => setSelectedWithdrawal(null)}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
};

export default Withdrawals;
